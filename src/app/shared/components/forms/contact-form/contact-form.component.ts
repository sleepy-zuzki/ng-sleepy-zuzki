import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, InputComponent, TextareaComponent } from '@components/ui';
import { faCircleExclamation } from '@awesome.me/kit-15d5a6a4b5/icons/duotone/solid';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-contact-form',
  imports: [
    ButtonComponent,
    FormsModule,
    InputComponent,
    ReactiveFormsModule,
    TextareaComponent,
    FaIconComponent
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {
  faCircleExclamation: IconDefinition = faCircleExclamation;

  @Output() onSubmit: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  contact = {
    name: '',
    email: '',
    message: ''
  };

  contactForm: FormGroup = new FormGroup({
    name: new FormControl(this.contact.name, [Validators.minLength(3)]),
    email: new FormControl(this.contact.email, [Validators.required]),
    message: new FormControl(this.contact.message, [Validators.required])
  });

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }

  onSubmitForm(): void {
    if (this.contactForm.invalid) {
      console.error('Formulario Invalido');
      return;
    }

    this.onSubmit.emit(this.contactForm);
    this.contactForm.reset();
    this.contactForm.setValue({
      name: '',
      email: '',
      message: ''
    })
  }
}
