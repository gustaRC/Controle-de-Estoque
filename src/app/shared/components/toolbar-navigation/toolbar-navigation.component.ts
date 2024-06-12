import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html'
})
export class ToolbarNavigationComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  sairApp() {
    this.cookieService.delete('USER_TOKEN');
    this.router.navigate(['/home']);
  }

}
