
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    getPosts(){
        return [...this.posts];
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title: String, content: String) {
        const post: Post = { title: title, content: content};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}
