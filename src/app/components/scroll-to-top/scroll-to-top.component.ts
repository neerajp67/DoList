import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.scss'
})
export class ScrollToTopComponent {
  showScrollButton = signal(false);
  
  // Threshold in pixels before the button appears
  private scrollThreshold = 300; 

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton.set(window.scrollY > this.scrollThreshold);
  }

  scrollToTop(): void {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
}