import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { stricterEmailValidator } from '../validators/stricter-email-validator';

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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  usersList: User[] = []; 

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: [''],
      gender: [''],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email, stricterEmailValidator]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,16}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.loadUsersList();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else if (field === 'confirmPassword') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  onSubmit() {
    let isExist=false
    if (this.registerForm.valid && !this.registerForm.errors?.['mismatch']) {
     for(let user of this.usersList){
      if(user.email===this.registerForm.value.email){
       
        isExist=true
      }
     }
     if(isExist){
      alert("user already exist")
     }
     else{
      const newUser: User = this.registerForm.value;
      this.usersList.push(newUser);
      localStorage.setItem('Users', JSON.stringify(this.usersList));
    
      alert("You've successfully registered");
      this.router.navigate(['/']);
     }
     
    } else {
      if (this.registerForm.invalid) {
        alert("Please fill the required details");
      }
      if (this.registerForm.errors?.['mismatch']) {
        alert("Passwords do not match");
      }
      if (this.registerForm.get('email')?.errors?.['invalidEmail']) {
        alert("Please enter a valid email address.");
      }
    }
  }

  private loadUsersList() {
    const storedUsers = localStorage.getItem('Users');
    this.usersList = storedUsers ? JSON.parse(storedUsers) : [];
  }
}
