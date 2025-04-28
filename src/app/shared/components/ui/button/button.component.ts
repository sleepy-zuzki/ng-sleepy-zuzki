import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [class]="variant === 'primary' ? 'btn-primary' : 'btn-secondary'"
      [disabled]="disabled"
      [type]="type"
      (click)="emitCallback($event)"
      [attr.aria-label]="ariaLabel">
      <span><ng-content></ng-content></span>
    </button>
  `,
  styles: [`
    .btn-primary {
      @apply rounded-md font-medium transition-colors px-4 py-2 select-none w-full;
      /* Colores primarios */
      @apply bg-sleepy-accent text-sleepy-light-text-onAccent;
      @apply hover:bg-sleepy-accent-hover disabled:opacity-70;
      @apply dark:text-sleepy-dark-text-onAccent;
    }

    .btn-secondary {
      @apply rounded-md font-medium transition-colors px-4 py-2 select-none w-full;
      /* Colores secundarios */
      @apply bg-sleepy-light-bg-surface text-sleepy-light-text-secondary;
      @apply hover:bg-sleepy-light-border disabled:opacity-70;
      @apply dark:bg-sleepy-dark-bg-surface dark:text-sleepy-dark-text-secondary;
      @apply dark:hover:bg-sleepy-dark-border;
    }
  `],
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() ariaLabel: string = '';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Output() callback: EventEmitter<unknown> = new EventEmitter<unknown>();

  emitCallback(event: Event): void {
    this.callback.emit(event);
  }
}
