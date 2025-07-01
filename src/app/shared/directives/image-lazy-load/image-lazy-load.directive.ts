// Delays image loading until the image is visible in the viewport, improving performance, especially on pages with many images.
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
})
export class LazyLoadDirective {
  @Input() appLazyLoad?: string;

  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      this.loadImage();
    }
  }

  private loadImage() {
    const imgElement: HTMLImageElement = this.el.nativeElement;
    imgElement.src = this.appLazyLoad ?? '';
  }
}
