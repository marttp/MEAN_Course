import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from './angular-material.module';

// HTTP connect built in function
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app.routing.module';
import { ErrorComponent } from './error/error.component';

// import { PostsService } from './posts/posts.service';
import { ErrorInterceptor } from './error-interceptor';
import { AuthInterceptor } from './auth/auth-intercepter';

import { PostModule } from './posts/post.module';
// import { AuthModule } from './auth/auth.module';

@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      ErrorComponent
   ],
   imports: [
      BrowserModule,
      // add app routing module
      AppRoutingModule,
      // FormsModule,
      BrowserAnimationsModule,
      AngularMaterialModule,
      HttpClientModule,
      PostModule,
      // AuthModule
   ],
   providers: [
    //  PostsService
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
   ],
   bootstrap: [
      AppComponent
   ],
   entryComponents: [
     ErrorComponent
   ]
})
export class AppModule {}
