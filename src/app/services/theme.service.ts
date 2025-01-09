import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(this.loadThemePreference());

  constructor() {
    this.isDarkMode.subscribe((isDark) => {
      document.body.classList.toggle('dark-mode', isDark);
      localStorage.setItem('darkMode', JSON.stringify(isDark));
    });
  }

  private loadThemePreference(): boolean {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  }

  toggleTheme() {
    this.isDarkMode.next(!this.isDarkMode.value);
  }

  isDarkMode$ = this.isDarkMode.asObservable();
}
