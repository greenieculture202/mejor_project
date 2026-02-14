import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    date: string;
}

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private posts: BlogPost[] = [
        {
            id: 1,
            title: 'Top 5 Air Purifying Plants',
            excerpt: 'Discover which plants can help you breathe easier and improve your indoor air quality.',
            content: 'In today’s world, indoor air quality is a major concern. Fortunately, nature has a solution. Here are the top 5 plants that act as natural air purifiers:\n\n1. **Snake Plant (Sansevieria)**: Known for filtering out formaldehyde and nitrogen oxide.\n2. **Spider Plant**: Great for battling benzene, formaldehyde, carbon monoxide, and xylene.\n3. **Peace Lily**: Breaks down toxic gases like carbon monoxide and formaldehyde.\n4. **Aloe Vera**: Clears formaldehyde and benzene, which can be a byproduct of chemical-based cleaners.\n5. **Rubber Plant**: Effective at removing toxins and absorbing carbon monoxide.\n\nAdding these to your home not only beautifies the space but also helps you breathe cleaner air.',
            image: 'assets/bg2.avif',
            category: 'Health',
            date: 'Jan 24, 2026'
        },
        {
            id: 2,
            title: 'A Beginner’s Guide to Succulents',
            excerpt: 'Succulents are low maintenance and beautiful. Here is how to keep them thriving.',
            content: 'Succulents are perfect for those who want greenery without the high maintenance. Here is how to keep them happy:\n\n*   **Light**: They love bright, indirect sunlight. A south-facing window is ideal.\n*   **Water**: The biggest killer of succulents is overwatering. wait until the soil is completely dry before watering again. soak them thoroughly, then let them drain.\n*   **Soil**: Use a well-draining cactus or succulent mix.\n*   **Temperature**: They prefer warm temperatures and cannot tolerate frost.\n\nWith just a little attention, your succulents will thrive for years.',
            image: 'assets/bg1.jpg',
            category: 'Guide',
            date: 'Jan 20, 2026'
        },
        {
            id: 3,
            title: 'Designing Your Home with Greenery',
            excerpt: 'Learn how to style your living room with large statement plants and small accents.',
            content: 'Plants can transform a house into a home. Here are some design tips:\n\n*   **Create Levels**: Use plant stands or hang plants from the ceiling to draw the eye up.\n*   **Mix Textures**: Combine broad-leaf plants like Monsteras with fine-textured ferns.\n*   **Group Plants**: Odd numbers (groups of 3 or 5) tend to look more aesthetic.\n*   **Statement Pieces**: A large Fiddle Leaf Fig or Bird of Paradise can act as a living sculpture in a corner.\n\nDon\'t be afraid to experiment and find what works for your space!',
            image: 'assets/bg3.jpg',
            category: 'Design',
            date: 'Jan 15, 2026'
        }
    ];

    private postsSubject = new BehaviorSubject<BlogPost[]>(this.posts);
    posts$ = this.postsSubject.asObservable();

    constructor() {
        // Try to load from localStorage if available
        try {
            const saved = localStorage.getItem('greenie.blogPosts');
            if (saved) {
                this.posts = JSON.parse(saved);
                this.postsSubject.next(this.posts);
            }
        } catch (e) { console.error('Error loading blogs', e); }
    }

    getPosts(): Observable<BlogPost[]> {
        return this.posts$;
    }

    addPost(post: Partial<BlogPost>) {
        const newPost: BlogPost = {
            id: Date.now(),
            title: post.title || 'Untitled',
            excerpt: post.excerpt || '',
            content: post.content || '',
            image: post.image || 'assets/bg1.jpg',
            category: post.category || 'General',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        this.posts.unshift(newPost);
        this.save();
    }

    deletePost(id: number) {
        this.posts = this.posts.filter(p => p.id !== id);
        this.save();
    }

    updatePost(updatedPost: BlogPost) {
        const index = this.posts.findIndex(p => p.id === updatedPost.id);
        if (index !== -1) {
            this.posts[index] = { ...updatedPost };
            this.save();
        }
    }

    private save() {
        this.postsSubject.next([...this.posts]);
        try {
            localStorage.setItem('greenie.blogPosts', JSON.stringify(this.posts));
        } catch (e) {
            console.error('Error saving blogs', e);
        }
    }
}
