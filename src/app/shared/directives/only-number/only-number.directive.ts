// Restricts input fields to only accept numeric values. This can be very useful for forms with phone numbers, credit cards, or any numerical input.
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    if (
      !allowedKeys.includes(event.key) &&
      (isNaN(Number(event.key)) || event.key === ' ')
    ) {
      event.preventDefault();
    }
  }
}
