import { AuthInterceptor } from './auth/auth-intercepter';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule
} from '@angular/material';
import { NgModule } from '@angular/core';

// Form module for interact with client
// import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// HTTP connect built in function
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AppRoutingModule } from './app.routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
// import { PostsService } from './posts/posts.service';

@NgModule({
   declarations: [
      AppComponent,
      PostCreateComponent,
      HeaderComponent,
      PostListComponent,
      LoginComponent,
      SignupComponent
   ],
   imports: [
      BrowserModule,
      // add app routing module
      AppRoutingModule,
      ReactiveFormsModule,
      // FormsModule,
      BrowserAnimationsModule,
      MatInputModule,
      MatCardModule,
      MatButtonModule,
      MatToolbarModule,
      MatExpansionModule,
      MatProgressSpinnerModule,
      MatPaginatorModule,
      FormsModule,
      HttpClientModule
   ],
   providers: [
    //  PostsService
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
