import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCode } from '@awesome.me/kit-15d5a6a4b5/icons/duotone/solid';
import { ButtonComponent } from '@components/ui/button/button.component';
import { ThemeToggleComponent } from '@components/ui/button/theme-toggle.component';
import { LinkComponent } from '@components/ui/link/link.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FaIconComponent,
    ButtonComponent,
    ThemeToggleComponent,
    LinkComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  faCode = faCode;
}
