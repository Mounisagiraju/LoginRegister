import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../user-service.service';

interface User {
  firstname: string;
  lastname: string;
  gender: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  usersList: User[] = [];
  showPassword = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserServiceService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,16}$/)]]
    });

    this.loadUsersList();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    let isUserExist = false;

    if (this.loginForm.get('username')?.valid && this.loginForm.get('password')?.valid) {
      for (let user of this.usersList) {
        if (user.email === this.loginForm.value.username) {
          isUserExist = true;
          this.userService.setUser(user);
          
          if (user.password === this.loginForm.value.password) {
            this.router.navigate(['/dashboard']);
            console.log(user);
          } else {
            alert('Wrong password');
          }
          break;
        }
      }
      
      if (!isUserExist) {
        alert('User does not exist. Please register.');
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onForgotEmail() {
    alert('Forgot Email? functionality is not yet implemented.');
  }

  onForgotPassword() {
    this.router.navigate(['/reset-password']);
  }

  onCreateAccount() {
    this.router.navigate(['/register']);
  }

  private loadUsersList() {
    const storedUsers = localStorage.getItem('Users');
    this.usersList = storedUsers ? JSON.parse(storedUsers) : [];
  }
}
