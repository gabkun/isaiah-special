import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import axios from 'axios';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  async onLogin(event: Event) {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:4500/api/auth/login', {
        email: this.email,
        password: this.password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      alert('Login successful!');


      if (user.role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/user-dashboard';
      }
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      this.errorMessage = error.response?.data?.error || 'Login failed';
    }
  }
}
