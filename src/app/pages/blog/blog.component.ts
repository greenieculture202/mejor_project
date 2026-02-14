import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService, BlogPost } from '../../services/blog.service';

@Component({
    selector: 'app-blog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './blog.html',
    styleUrls: ['./blog.css']
})
export class BlogComponent {
    showModal = false;
    currentPost: any = null;
    posts: BlogPost[] = [];

    featuredPost = {
        title: 'The Secret Language of Flowers',
        excerpt: 'Flowers have been used to convey messages for centuries. Explore the hidden meanings behind your favorite blooms.',
        content: 'Floriography, or the language of flowers, was a Victorian-era means of communication in which various flowers and floral arrangements were used to send coded messages, allowing individuals to express feelings which otherwise could not be spoken.\n\n*   **Red Roses**: Love and Passion.\n*   **White Lilies**: Purity and refined beauty.\n*   **Sunflowers**: Adoration and loyalty.\n*   **Tulips**: Perfect love.\n*   **Orchids**: Rare beauty and strength.\n\nNext time you receive a bouquet, look closer—there might be a hidden message waiting to be deciphered.',
        image: 'assets/bg4.jpg',
        category: 'Culture',
        date: 'Jan 10, 2026'
    };

    constructor(private blogService: BlogService) {
        this.blogService.posts$.subscribe(p => this.posts = p);
    }

    openPost(post: any) {
        this.currentPost = post;
        this.showModal = true;
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    closeModal() {
        this.showModal = false;
        this.currentPost = null;
        document.body.style.overflow = ''; // Restore scrolling
    }
}
