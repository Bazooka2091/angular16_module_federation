# Это переработанная инструкция из [статьи 🛠️](https://dev.to/sbhuvane/micro-frontend-in-angular-using-module-federation-31om)

# Так же есть описание [других boilerplate 🛠️](MFE_README.md)

# Так же есть описание remote React app и react-wrapper для Angular [в этом репозитории есть примеры 🛠️](https://github.com/ilya-isupov/multi-framework-module-federation)

# Создание основного проекта

## Версии пакетов

1. angular CLI
2. angular 16
3. node 18.17.1
4. npm 8.19.4
5. nvm 1.11.1

### Дополнительно будет пакет

0. Он позволит добавить webpack config для проектов и преднастроить его
1. @angular-architects/module-federation

## Создание проекта

1. Создание без основного приложение

```shell
ng new YOUR_PROJECT_NAME --create-application=false
```

## Создание подпроектов

### HOST проект

1. Генерация нового подпроекта - он будет главным `host`

```shell
ng g application host --routing --style=scss
```

2. Добавить к этому проекту компоненты:

```shell
ng g c home --project=host
```

3. `app-routing.module.ts` настроить там Routes

```typescript
const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    pathMatch: "full",
  },
];
```

4. Упростить компонент `app.component.ts` до:

```html
<h1>Module Federation HOST</h1>
<router-outlet></router-outlet>
```

### CART проект

1. Генерация нового подпроекта это будет уже дополнительный микрофронтенд корзина `cart`

```shell
ng g application cart --routing --style=scss
```

2. Добавить к этому проекту компоненты:

```shell
ng g c home --project=cart
```

2. Добавить модуль и компонент к нему

```shell
ng g m cartfeature --routing --project=cart
ng g c cartfeature --project=cart
```

3. `cartfeature.module.ts` настроить там Routes

```typescript
const routes: Routes = [
  {
    path: "",
    component: CartfeatureComponent,
    pathMatch: "full",
  },
];
```

3. `app-routing.module.ts` теперь чуть сложнее, там настроить там Routes + lazy

```typescript
const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    pathMatch: "full",
  },
  {
    path: "cart",
    loadChildren: () =>
      import("./cartfeature/cartfeature.module").then(
        (m) => m.CartfeatureModule
      ),
  },
];
```

4. Упростить компонент `app.component.ts` до:

```html
<h1>Module Federation CART</h1>
<a routerLink="/">Home</a>
<a routerLink="/cart">Cart</a>
<router-outlet></router-outlet>
```

## Добавление Module Federation

1. Добавить к host

```shell
ng add @angular-architects/module-federation --project host --port 4200
```

2. Добавить к cart

```shell
ng add @angular-architects/module-federation --project cart --port 5000
```

3. В `package.json` добавить секцию `resolutions` на данный момент Angular 16 версии, выбрал такие версии пакетов
   может быть нужно уточнить детали если версия уйдёт далеко вперёд.

```json
"resolutions": {
    "webpack": "^5.61.0",
    "license-webpack-plugin": "^3.0.1"
},
```

4. В проекте host к `app-routing.module.ts` добавить

```typescript
{
    path: 'cart',
    loadChildren: () =>
        import('cart/CartfeatureModule').then((m) => {
        return m.CartfeatureModule;
        }),
},
```

5. Что бы проект собирался с отсутствующим `cart/CartfeatureModule` т.к. он будет только в runtime`е
нужно прописать в файл `decl.d.ts` он располагается в ../projects/host/src

```typescript
declare module "cart/CartfeatureModule";
```

# Запуск

1. Запустим host `ng serve host`
2. Запустим cart `ng serve cart`

# Debug

## vscode launch.json

1. Если вы делаете проект в нормальном каталоге, просто новом, и для vscode он корневой тогда можно просто использовать
   что сгенерит vscode по умолчанию
   В моём случае так

```json
{
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ng serve HOST",
      "type": "chrome",
      "request": "launch",
      "preLaunchTask": "npm: start",
      "url": "http://localhost:4200/"
    },
    {
      "name": "ng serve CART",
      "type": "chrome",
      "request": "launch",
      "preLaunchTask": "npm: start",
      "url": "http://localhost:5000/"
    },
    {
      "name": "ng test",
      "type": "chrome",
      "request": "launch",
      "preLaunchTask": "npm: test",
      "url": "http://localhost:9876/debug.html"
    }
  ]
}
```

2. Запускаем по порядку
1. host приложение `ng serve host --host=127.0.0.1`
1. cart приложение `ng serve cart --host=127.0.0.1`
1. Жмём `F5`

1. Нужно понимать, что мы в remote указали только `CartfeatureModule`. Соответственно доступный для debug`а код будет загружен только из него.

1. Но при этом, если открывать сам микрофронтенд по `localhost:5000` то тут уже доступен debug всего, но только конкретно этого микро-фронтенда.

# Angular lazy load

1. Способ 1 - предварительная подгрузка remoteEntry скрипта

```shell
{
  path: 'cart',
  loadChildren: () =>
    import('cart/CartfeatureModule').then((m) => {
      return m.CartfeatureModule;
    }),
},
```

2. Способ 2 - полное ожидание до момента обращения к remote с помощью loadRemoteModule, что позволит загружать host приложение,
  даже если в перспективе есть ошибки в загружаемом remoteEntry скрипте. Используя Способ 1 наверное  безопасней, но не запустит всё приложение если есть проблемы во внешнем коде.

```shell
{
  path: 'cart',
  loadChildren: () =>
    loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:5000/remoteEntry.js',
      exposedModule: './CartfeatureModule',
    }).then((m) => m.CartfeatureModule),
},
```

# Добавление React remote приложения в host Angular

## Создание React приложения

1. Создаём новое

```shell
npx create-react-app react_module_federation
```

2. Внутри `react_module_federation` ставим:

```shell
npm install --save-dev webpack webpack-cli html-webpack-plugin webpack-dev-server babel-loader
```

3. Запустим для проверки `npm run start` откроется стандартный boilerplate react

4. Основная проблема в том что react dev server отдаёт не модуль, а html и компилирует в процессе, из-за этого MF host не может
   получить модуль как код. Нужно понять как делается преобразование на лету.

5. Нужен wrapper для react. [в этом репозитории есть примеры](https://github.com/ilya-isupov/multi-framework-module-federation)
  репозиторий староват, но даёт представление.
