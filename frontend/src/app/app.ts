import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';
import { CategoryNavComponent } from './category-nav/category-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CategoryNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
