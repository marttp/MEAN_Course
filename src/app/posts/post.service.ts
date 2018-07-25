
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {

    }

    getPosts() {
        // return [...this.posts];
        this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
        // Transform response data to application such as _id => id
        .pipe(map((postData) => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                }
            });
        }))
        // .subscribe((postData) => {
        //     this.posts = postData.posts;
        //     this.postsUpdated.next([...this.posts]);
        // });
        .subscribe((transformPosts) => {
            this.posts = transformPosts;
            console.log(transformPosts)
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    getPost(id: String){
        return this.http.get<{
            _id: string,
            title: string,
            content: string
        }>
        ('http://localhost:3000/api/posts/' + id);
    }

    addPost(title: string, content: string, image: File) {
        // const post: Post = {
        //     id: null,
        //     title: title,
        //     content: content};

        /*
            Change it to FormData
         */
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
        .subscribe((responseData) => {
            const post: Post = {
                id: responseData.post.id,
                title: title,
                content: content,
                imagePath: responseData.post.imagePath
            };
            // console.log(responseData.message);
            // const postId = responseData.postId;
            // post.id = postId;
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        });
    }


    updatePost(id: String, title: String, content: String){
        const post: Post = { id: id, title: title, content: content, imagePath: null };
        this.http.put('http://localhost:3000/api/posts/' + id, post)
        .subscribe((response) => {
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts])
            this.router.navigate(['/']);
        });
    }

    deletePost(postId: String) {
        this.http.delete('http://localhost:3000/api/posts/' + postId)
        .subscribe(() => {
            console.log(`Deleted : ${postId} !`);
            const updatePosts = this.posts.filter(
                post => post.id !== postId
            );
            this.posts = updatePosts;
            this.postsUpdated.next([...this.posts]);
        });
    }
}
