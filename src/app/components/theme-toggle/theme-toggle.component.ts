import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  @Output() themeChanged = new EventEmitter<boolean>();
  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeChanged.emit(this.isDarkMode);
  }
}
