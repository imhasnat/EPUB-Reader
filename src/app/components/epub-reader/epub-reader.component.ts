import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BOOKS } from '../../data/books';
import ePub from 'epubjs';
import { ThemeService } from '../../services/theme.service';
import { TocSidebarComponent } from '../toc-sidebar/toc-sidebar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-epub-reader',
  imports: [CommonModule, TocSidebarComponent],
  templateUrl: './epub-reader.component.html',
  styleUrl: './epub-reader.component.css',
})
export class EpubReaderComponent implements OnDestroy {
  @ViewChild('viewerContainer') viewerContainer!: ElementRef;

  isDarkMode$: any;
  book: any = null;
  rendition: any = null;
  toc: any[] = [];
  progress: number | null = null;
  isDarkMode: boolean = false;
  currentScale: number = 100;
  bookId: number = 0;
  isLocationsGenerated: boolean = false;
  progressLoading: boolean = true;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private themeService: ThemeService
  ) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.bookId = +params['id'];
      const book = BOOKS.find((b) => b.id === this.bookId);
      if (book) {
        this.loadBook(book.filePath);
      }
    });

    this.subscriptions.add(
      this.isDarkMode$.subscribe((isDark: boolean) => {
        this.isDarkMode = isDark;
        this.applyTheme();
      })
    );
  }

  ngAfterViewInit() {
    const epubContainer =
      this.viewerContainer.nativeElement.querySelector('.epub-container');
    if (epubContainer) {
      epubContainer.style.overflow = 'hidden';
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  async loadBook(filePath: string) {
    try {
      const response = await fetch(filePath);
      const bookBlob = await response.blob();
      const bookData = await bookBlob.arrayBuffer();
      this.book = ePub(bookData);

      await this.initializeReader();
    } catch (error) {
      console.error('Error loading EPUB:', error);
      alert('Error loading book. Please try again.');
    }
  }

  async initializeReader() {
    try {
      const navigation = await this.book.loaded.navigation;
      this.toc = navigation.toc;

      this.rendition = this.book.renderTo(this.viewerContainer.nativeElement, {
        allowScriptedContent: true,
        width: '100%',
        flow: 'scrolled-doc',
      });

      this.applyTheme();

      // Generate locations
      await this.book.locations.generate();
      this.isLocationsGenerated = true;

      const savedLocation = localStorage.getItem(
        `book_${this.bookId}_location`
      );

      if (savedLocation) {
        await this.rendition.display(savedLocation);
      } else {
        await this.rendition.display();
      }

      this.updateProgress();
      this.rendition.on('relocated', () => {
        this.updateProgress();
      });
    } catch (error) {
      console.error('Error initializing reader:', error);
      alert('Error initializing reader. Please try again.');
    }
  }

  private async generateLocations() {
    try {
      await this.book.locations.generate();
      this.updateProgress();
    } catch (error) {
      console.error('Error generating locations:', error);
    }
  }

  private updateProgress() {
    if (!this.rendition || !this.isLocationsGenerated) return;

    const currentLocation = this.rendition.currentLocation();
    if (currentLocation && currentLocation.start) {
      this.progress = Math.floor((currentLocation.start.percentage || 0) * 100);
      const cfi = currentLocation.start.cfi;

      localStorage.setItem(
        `book_${this.bookId}_progress`,
        this.progress.toString()
      );
      localStorage.setItem(`book_${this.bookId}_location`, cfi);
    }

    this.progressLoading = false; // Stop showing the loading indicator.
  }

  navigateToChapter(href: string) {
    if (this.rendition) {
      this.rendition.display(href);
    }
  }

  async nextPage() {
    if (this.rendition) {
      await this.rendition.next();
    }
  }

  async previousPage() {
    if (this.rendition) {
      await this.rendition.prev();
    }
  }

  zoomIn() {
    this.currentScale = Math.min(this.currentScale + 10, 200);
    this.applyZoom();
  }

  zoomOut() {
    this.currentScale = Math.max(this.currentScale - 10, 50);
    this.applyZoom();
  }

  private applyTheme() {
    if (!this.rendition) return;

    const theme = this.isDarkMode
      ? {
          body: {
            background: '#1a1a1a',
            color: '#fff',
          },
        }
      : {
          body: {
            background: '#fff',
            color: '#000',
          },
        };

    this.rendition.themes.register('theme', theme);
    this.rendition.themes.select('theme');
  }

  private applyZoom() {
    if (this.rendition) {
      this.rendition.themes.fontSize(`${this.currentScale}%`);
    }
  }
}
