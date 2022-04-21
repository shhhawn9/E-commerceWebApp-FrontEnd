import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import * as e from 'express';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string;

  //Reference to web browser's session storage
  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    )
  }

  // check if the user is authenticated, if ture, retreive user
  getUserDetails() {
    if (this.isAuthenticated) {
      // Fetch the logged in user details (user's claims)

      //user full name is exposed as a property name
      this.oktaAuthService.getUser().then(
        res => {
          this.userFullName = res.name;
          // retrieve the user's email from authentication response
          const theEmail = res.email;

          // store the email in browser storage
          this.storage.setItem('userEmail', JSON.stringify(theEmail));
        }
      );
    }
  }

  logout() {
    // Terminates the session with Okta and removes cureent tokens
    this.oktaAuthService.signOut();
  }

}
