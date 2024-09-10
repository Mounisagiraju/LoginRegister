import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,16}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      alert('Password has been reset successfully.');
      this.router.navigate(['/login']);
    }
  }

  onBack() {
    this.router.navigate(['/login']);
  }
}
