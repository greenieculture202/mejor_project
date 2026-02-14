import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService, BlogPost } from '../../../services/blog.service';

@Component({
    selector: 'app-admin-blog',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-blog.html',
    styleUrls: ['./admin-blog.css']
})
export class AdminBlogComponent implements OnInit {
    posts: BlogPost[] = [];
    showForm = false;

    newPost: Partial<BlogPost> = {
        title: '',
        category: 'Guide',
        image: '',
        excerpt: '',
        content: ''
    };

    constructor(private blogService: BlogService) { }

    ngOnInit() {
        this.blogService.posts$.subscribe(p => this.posts = p);
    }

    savePost(event: Event) {
        event.preventDefault();
        if (!this.newPost.title) return;

        if (this.newPost.id) {
            this.blogService.updatePost(this.newPost as BlogPost);
        } else {
            this.blogService.addPost(this.newPost);
        }

        this.showForm = false;
        this.resetForm();
    }

    editPost(post: BlogPost) {
        this.newPost = { ...post };
        this.showForm = true;
    }

    deletePost(id: number) {
        if (confirm('Are you sure you want to delete this post?')) {
            this.blogService.deletePost(id);
        }
    }

    resetForm() {
        this.newPost = {
            title: '',
            category: 'Guide',
            image: '',
            excerpt: '',
            content: ''
        };
        // Explicitly remove id for new posts
        delete this.newPost.id;
    }
}
