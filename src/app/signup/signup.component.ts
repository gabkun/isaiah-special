import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  role = 'user';

  async onSubmit(event: Event) {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:4500/api/auth/register', {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
      });

      console.log('Registration successful:', response.data);
      alert('User registered successfully!');
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Registration failed');
    }
  }
}
