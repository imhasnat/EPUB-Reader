import { Book } from '../models/book.model';

export const BOOKS: Book[] = [
  {
    id: 1,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    cover: 'assets/images/austen-pride-and-prejudice.jpg',
    filePath: 'assets/books/austen-pride-and-prejudice-illustrations.epub',
  },
  {
    id: 2,
    title: 'Brave New World',
    author: 'Aldous Huxley',
    cover: 'assets/images/brave-new-world-9a1ead.jpg',
    filePath: 'assets/books/chesterton-eugenics-and-other-evils.epub',
  },
  {
    id: 3,
    title: 'Hawthorne House of the Seven Gables',
    author: 'Nathaniel Hawthorne',
    cover: 'assets/images/hawthorne-house-of-the-seven-gables.jpg',
    filePath: 'assets/books/hawthorne-house-of-the-seven-gables.epub',
  },
  {
    id: 4,
    title: 'The Daughter of Time',
    author: 'Josephine Tey',
    cover: 'assets/images/the-daughter-of-time-c7bdea.jpg',
    filePath: 'assets/books/tey-daughter-of-time.epub',
  },
  {
    id: 5,
    title: 'The Saving Clause',
    author: 'Herman Cyril McNeile',
    cover: 'assets/images/the-saving-clause-52d111.jpg',
    filePath: 'assets/books/mcneile-saving-clause.epub',
  },
];
