import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },

  // Обычный lazy, но он в процессе получит remoteEntry скрипт
  {
    path: 'cart',
    loadChildren: () =>
      import('cart/CartFeatureModule').then((m) => {
        return m.CartFeatureModule;
      }),
  },

  // Ожидание в т.ч. скрипта remoteEntry.
  // Host приложение падать не будет сразу если что-то не так на remote стороне, выдаст ошибку при попытке загрузить модуль.
  // {
  //   path: 'cart',
  //   loadChildren: () =>
  //     loadRemoteModule({
  //       type: 'module',
  //       remoteEntry: 'http://localhost:5000/remoteEntry.js',
  //       exposedModule: './CartFeatureModule',
  //     }).then((m) => m.CartFeatureModule),
  // },


  // Эксперимент с remote react. Нужен wrapper для react как минимум если захочется использовать компоненты из полученного модуля.
  // {
  //   path: 'react',
  //   loadChildren: () =>
  //     loadRemoteModule({
  //       type: 'module',
  //       remoteEntry: 'http://localhost:3000/remoteModule.js',
  //       exposedModule: './App',
  //     }).then((m) => m.App),
  // },


  // {
  //   path: 'react',
  //   loadChildren: () =>
  //     import('react/App').then((m) => {
  //       return m.App;
  //     }),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
