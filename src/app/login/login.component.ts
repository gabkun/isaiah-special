import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import axios from 'axios';
import { Router } from '@angular/router';

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
  user: any; // Variable to hold user data

  constructor(private router: Router) {}

  async onLogin(event: Event) {
    event.preventDefault();

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    try {
      const response = await axios.post('http://localhost:4500/api/auth/login', {
        email: this.email,
        password: this.password,
      });

      const { token, user } = response.data;

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Check if the token is in the correct format before decoding it
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      alert('Login successful!');

      // Fetch user data after login
      await this.fetchUserData(user.id); // Call to fetch user details using the ID

      // Handle role-based routing
      if (user.role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      this.errorMessage = error.response?.data?.error || 'Login failed';
    }
  }

  // Method to fetch user data using the user ID from the token
  async fetchUserData(userId: string) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`http://localhost:4500/api/auth/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Attach token to the request header
        },
      });

      this.user = response.data.user; // Store user data from the response
      console.log('Fetched user data:', this.user);
    } catch (error: any) {
      console.error('Error fetching user data:', error.response?.data || error.message);
      this.errorMessage = error.response?.data?.error || 'Failed to fetch user data';
    }
  }
}
