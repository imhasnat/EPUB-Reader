import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BOOKS } from '../../data/books';
import { Book } from '../../models/book.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-library',
  imports: [CommonModule],
  templateUrl: './book-library.component.html',
  styleUrl: './book-library.component.css',
})
export class BookLibraryComponent {
  books: Book[] = BOOKS;

  constructor(private router: Router) {}

  openBook(book: Book) {
    this.router.navigate(['/reader', book.id]);
  }
}
