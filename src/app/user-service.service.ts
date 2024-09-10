import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
interface User {
  firstname: string;
  lastname: string;
  gender: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  // Expose the observable
  user$: Observable<User | null> = this.userSubject.asObservable();
  constructor() { }
  setUser(user:User){
    this.userSubject.next(user)

  }
  getUser(){
    return this.user$
  }
  
}
