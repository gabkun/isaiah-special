import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [NgIf, FormsModule, CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  user: any = null;
  token: string = '';
  userId: string = '';

  // Memos state variables
  textMemos: any[] = [];
  memoFetchError: string = '';

  memo = {
    title: '',
    memoType: '1', // 1 = text, 2 = voice
    description: '',
    additionalNotes: ''
  };
  selectedFiles: File[] = [];
  memoMessage = '';
  memoError = '';

  // Modal state variables
  isCreateMemoModalOpen: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Fetch token from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('token') || '';
    }

    // Redirect to login if no token
    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    // Decode token and get user ID
    const decodedToken = this.decodeToken(this.token);
    if (decodedToken && decodedToken._id) {
      this.userId = decodedToken._id;
      this.fetchUserInfo();
    } else {
      console.error('Invalid token or missing user ID');
      this.router.navigate(['/login']);
    }
  }

  decodeToken(token: string): any {
    // Decode base64 payload of JWT
    if (!token || token.split('.').length !== 3) {
      console.error('Invalid token format');
      return {};
    }

    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  }

  fetchUserInfo(): void {
    axios.get(`http://localhost:4500/api/auth/${this.userId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
    .then(response => {
      this.user = response.data.user;
      this.fetchUserMemos(); // Fetch the memos after user info is loaded
    })
    .catch((error) => {
      console.error('Error fetching user data', error);
    });
  }

  fetchUserMemos(): void {
    // Make GET request to backend to get memos
    axios.get(`http://localhost:4500/api/memo/${this.userId}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    })
    .then(response => {
      this.textMemos = response.data.memos; // Set response to textMemos
    })
    .catch(error => {
      console.error('Error fetching memos:', error);
      this.memoFetchError = error.response?.data?.message || 'Failed to fetch memos.';
    });
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files);
  }

  // Method to open the memo creation modal
  openCreateMemoModal(): void {
    this.isCreateMemoModalOpen = true;
  }

  // Method to close the memo creation modal
  closeCreateMemoModal(): void {
    this.isCreateMemoModalOpen = false;
  }

  async createMemo(event: Event) {
    event.preventDefault();
    this.memoMessage = '';
    this.memoError = '';

    const formData = new FormData();
    formData.append('userId', this.user.id); // Uses fetched user ID
    formData.append('title', this.memo.title);
    formData.append('memoType', this.memo.memoType);
    formData.append('additionalNotes', this.memo.additionalNotes || '');

    if (this.memo.memoType === '1') {
      if (!this.memo.description) {
        this.memoError = 'Description is required for text memo.';
        return;
      }
      formData.append('description', this.memo.description);
      this.selectedFiles.forEach(file => {
        formData.append('files', file);
      });
    } else if (this.memo.memoType === '2') {
      if (this.selectedFiles.length === 0) {
        this.memoError = 'Voice memo requires an audio file.';
        return;
      }
      formData.append('files', this.selectedFiles[0]);
    }

    try {
      const response = await axios.post('http://localhost:4500/api/memo/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.token}`
        }
      });

      this.memoMessage = response.data.message;
      this.memo = { title: '', memoType: '1', description: '', additionalNotes: '' };
      this.selectedFiles = [];
      this.closeCreateMemoModal(); // Close modal after memo creation
    } catch (error: any) {
      console.error('Memo creation failed:', error);
      this.memoError = error.response?.data?.message || 'Memo creation failed.';
    }
  }
}
