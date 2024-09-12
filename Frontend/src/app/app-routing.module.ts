import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./property/property.module').then(m => m.PropertyModule),
        data: { breadcrumb: 'Home' }
    },

    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
