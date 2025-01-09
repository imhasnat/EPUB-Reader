import { Routes } from '@angular/router';
import { EpubReaderComponent } from './components/epub-reader/epub-reader.component';
import { BookLibraryComponent } from './components/book-library/book-library.component';

export const routes: Routes = [
  { path: '', component: BookLibraryComponent },
  { path: 'reader/:id', component: EpubReaderComponent },
  { path: '**', redirectTo: '' },
];
