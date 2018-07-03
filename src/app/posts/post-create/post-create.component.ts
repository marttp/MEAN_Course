import { PostsService } from './../post.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
//args - JS Obj
@Component({
  selector: 'app-post-create',
  //Target to html file
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  public newPost: String = 'No Content';
  public enteredContent: String = '';
  public enteredTitle: String = '';

  // @Output() postCreated = new EventEmitter<Post>();

  constructor(public postsService: PostsService) { }

  ngOnInit() {
  }

  // onAddPost(postInput: HTMLTextAreaElement){
  //   console.log(postInput);
  //   console.dir(postInput);
  //   this.newPost = postInput.value;

  // }
  // onAddPost(){
  //   this.newPost = this.enteredContent;
  // }
  onAddPost(form: NgForm){
    if(form.invalid){
      return;
    }
    const post: Post = { 
      id: null,
      title: form.value.title, 
      content: form.value.content
    };
    // this.postCreated.emit(post);
    this.postsService.addPost(form.value.title,form.value.content);
    form.resetForm();
  }
}
