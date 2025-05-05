import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'isaiah-special';
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    // Check if the app is running in the browser and set the login state
    if (typeof window !== 'undefined') {
      this.isLoggedIn = !!localStorage.getItem('token');
    }
  }
}
