import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';

import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title = 'app';

  // storedPosts: Post[] = [];

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.authService.autoAuthUser();
  }

  // onPostAdded(post) {
  //   this.storedPosts.push(post);
  // }
}
