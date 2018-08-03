import { AuthService } from './../../auth/auth.service';
import { PostsService } from './../post.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';

// args - JS Obj
@Component({
  selector: 'app-post-create',
  // Target to html file
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  post: Post;
  public newPost: String = 'No Content';
  public enteredContent: String = '';
  public enteredTitle: String = '';
  private mode = 'create';
  private postId: String;
  isLoading = false;
  form: FormGroup;
  imagePreview: String;
  private authStatusSub: Subscription;

  // @Output() postCreated = new EventEmitter<Post>();

  // constructor(public postsService: PostsService) { }
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // find if have parameter. use edit mode

      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        //
        this.isLoading = true;
        //
        this.postsService.getPost(this.postId).subscribe(postData => {
          //
          this.isLoading = false;
          //
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
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

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    // reevaluate when change
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.post.id,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    // const post: Post = {
    //   id: null,
    //   title: form.value.title,
    //   content: form.value.content
    // };
    // this.postCreated.emit(post);
    // form.resetForm();
    this.form.reset();
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
