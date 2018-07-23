import { PostsService } from './../post.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
//args - JS Obj
@Component({
  selector: 'app-post-create',
  // Target to html file
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  post: Post;
  public newPost: String = 'No Content';
  public enteredContent: String = '';
  public enteredTitle: String = '';
  private mode = 'create';
  private postId: String;
  // @Output() postCreated = new EventEmitter<Post>();

  // constructor(public postsService: PostsService) { }
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      // find if have parameter. use edit mode

      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  // onAddPost(postInput: HTMLTextAreaElement){
  //   console.log(postInput);
  //   console.dir(postInput);
  //   this.newPost = postInput.value;

  // }
  // onAddPost(){
  //   this.newPost = this.enteredContent;
  // }


  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if(this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.post.id,
        form.value.title,
        form.value.content
      );
    }
    // const post: Post = {
    //   id: null,
    //   title: form.value.title,
    //   content: form.value.content
    // };
    // this.postCreated.emit(post);
    form.resetForm();
  }
}
