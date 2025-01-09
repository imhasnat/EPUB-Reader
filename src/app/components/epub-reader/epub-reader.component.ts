import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BOOKS } from '../../data/books';
import ePub from 'epubjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-epub-reader',
  imports: [CommonModule],
  templateUrl: './epub-reader.component.html',
  styleUrl: './epub-reader.component.css',
})
export class EpubReaderComponent {
  @ViewChild('viewerContainer') viewerContainer!: ElementRef;

  isDarkMode$: any;
  book: any = null;
  rendition: any = null;
  toc: any[] = [];
  progress: number = 0;
  isDarkMode: boolean = false;
  currentScale: number = 100;
  tocVisible: boolean = true;
  isSmallScreen: boolean = window.innerWidth <= 768;

  constructor(
    private route: ActivatedRoute,
    private themeService: ThemeService
  ) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const bookId = params['id'];
      const book = BOOKS.find((b) => b.id === +bookId);
      if (book) {
        this.loadBook(book.filePath);
      }
    });
  }

  toggleToc(tocVisible: boolean) {
    this.tocVisible = tocVisible;
  }

  async loadBook(filePath: string) {
    try {
      const response = await fetch(filePath);
      const bookBlob = await response.blob();

      // Convert Blob to ArrayBuffer
      const bookData = await bookBlob.arrayBuffer();

      // Pass the ArrayBuffer to ePub
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
        flow: 'paginated',
        width: '100%',
        spread: 'always',
      });

      this.applyTheme();
      await this.rendition.display();
      await this.book.locations.generate();

      this.rendition.on('relocated', (location: any) => {
        this.progress = Math.floor((location.start.percentage || 0) * 100);
      });
    } catch (error) {
      console.error('Error initializing reader:', error);
      alert('Error initializing reader. Please try again.');
    }
  }

  navigateToChapter(event: Event) {
    const select = event.target as HTMLSelectElement;
    const href = select.value;
    if (href && this.rendition) {
      this.rendition.display(href);
    }
  }

  nextPage() {
    if (this.rendition) {
      this.rendition.next();
    }
  }

  previousPage() {
    if (this.rendition) {
      this.rendition.prev();
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

  onThemeChange(isDark: boolean) {
    this.isDarkMode = isDark;
    this.applyTheme();
  }

  private applyTheme() {
    if (!this.rendition) return;

    this.isDarkMode$.subscribe((isDark: boolean) => {
      const theme = isDark
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
    });
  }

  private applyZoom() {
    if (this.rendition) {
      this.rendition.themes.fontSize(`${this.currentScale}%`);
    }
  }
}
