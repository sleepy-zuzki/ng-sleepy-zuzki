import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="input-wrapper">
      <label *ngIf="label" class="input-label">{{ label }}</label>
      <input
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [(ngModel)]="value"
        (ngModelChange)="onValueChange($event)"
        class="input-field" />
    </div>
  `,
  styles: [`
    .input-wrapper {
      @apply flex flex-col gap-1;
    }

    .input-label {
      @apply text-sm text-sleepy-light-text-secondary;
      @apply dark:text-sleepy-dark-text-secondary;
    }

    .input-field {
      @apply bg-white text-sleepy-light-text-primary;
      @apply border border-sleepy-light-border rounded-md px-3;
      @apply py-2 focus:outline-none focus:ring-1;
      @apply focus:ring-sleepy-accent;
      @apply transition-colors duration-200;

      /* Dark mode */
      @apply dark:bg-sleepy-dark-bg-input dark:text-sleepy-dark-text-primary;
      @apply dark:border-sleepy-dark-border-input;
      @apply dark:focus:ring-sleepy-accent;
    }

    .input-field:disabled {
      @apply bg-sleepy-light-bg-surface text-sleepy-light-text-secondary;
      @apply opacity-70 cursor-not-allowed;
      @apply dark:bg-sleepy-dark-bg-surface dark:text-sleepy-dark-text-secondary;
    }
  `]
})
export class InputComponent {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() label = '';
  @Input() disabled = false;
  @Input() value: string = '';
  @Input() onChange: (value: string) => void = () => {};

  onValueChange(value: string): void {
    this.onChange(value);
  }
}
