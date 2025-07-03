import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent implements OnInit {
  code: string[] = ["", "", "", ""];
  message = "";
  codeFields = Array(4).fill(0);

  @ViewChildren('boxRefs') boxRefs!: QueryList<ElementRef>;

  constructor(private authService: AuthService, private router: Router) {
  }

  onKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this.code[index] && index > 0) {
      this.boxRefs.get(index - 1)?.nativeElement.focus();
    }
  }

  onDigitInput(index: number, event: any) {
    const value = event.target.value;
    if (/^\d$/.test(value)) {
      this.code[index] = value;
      if (index < 3) {
        this.boxRefs.get(index + 1)?.nativeElement.focus();
      }
    } else {
      this.code[index] = '';
    }
  }


  ngOnInit() {
    const email = localStorage.getItem('resetEmail');
    console.log(email);
    if (!email || email.trim() === '') {
      this.router.navigate(['/homepage']); // redirect wherever makes sense
    }
  }

  isCodeComplete(): boolean {
    return this.code.every(d => d !== '');
  }


  verifyCode() {
    let email = localStorage.getItem('resetEmail');
    this.authService.verifyCode({email: email, code: this.code.join('')})
      .subscribe({
        next: response => {
          this.router.navigate(['/auth/reset-password']);
        },
        error: error => {
          this.message = error.error?.message;
          console.error(error);
        }
      });
  }
}
