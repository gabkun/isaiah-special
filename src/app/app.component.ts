import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent], // ✅ Include NavComponent here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // ✅ Fix typo: styleUrls (array)
})
export class AppComponent {
  title = 'isaiah-special';
}
