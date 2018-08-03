import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // public posts: Object = [
  //   {title: 'First Post', content: 'This is the first post\'s content'},
  //   {title: 'Second Post', content: 'This is the Second post\'s content'},
  //   {title: 'Third Post', content: 'This is the Third post\'s content'}
  // ];

  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;
  // Pagination
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  private authStatusSub: Subscription;
  userIsAuth = false;
  userId: string;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  // auto work when create component
  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.userId = this.authService.getUserId();
      });

    this.userIsAuth = this.authService.getIsAuthenticated();

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuth = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    // Fix error by add check not null value or undefune
    if (this.postSub){
      this.postSub.unsubscribe();
    }

    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }

  onDelete(postId: String) {
    // Move from post service to here
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }
}
