import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

// Set name of route
// array of js object
const routes: Routes = [
    {
        // main page / starting page
        path: '',
        component: PostListComponent
    },
    {
        path: 'create',
        component: PostCreateComponent
    },
    {
        path: 'edit/:postId',
        component: PostCreateComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})


export class AppRoutingModule {}
