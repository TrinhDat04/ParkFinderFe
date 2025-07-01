// This directive prevents accidental multiple clicks by adding a debounce delay. It’s helpful for buttons like "Submit" to avoid sending multiple requests.
import { Directive, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { timer } from 'rxjs';

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective {
  @Input() debounceTime = 500;
  @Output() debounceClick = new EventEmitter();
  private timeout:any;

  @HostListener('click', ['$event'])
  clickEvent(event: MouseEvent) {
    event.preventDefault();
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.debounceClick.emit(event), this.debounceTime);
  }
}
