import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

import myAppConfig from 'src/app/config/my-app-config';
var OktaSignIn = require('@okta/okta-signin-widget');
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  oktaSignIn: any;
  constructor(private oktaAuthService: OktaAuthService) {
    this.oktaSignIn = new OktaSignIn(
      {
        logo: 'assets/images/logo.png',
        features: {
          registration: true,
        },
        baseUrl: myAppConfig.oidc.issuer.split('./oauth2')[0],
        clientId: myAppConfig.oidc.clientId,
        redirectUri: myAppConfig.oidc.redirectUrl,
        authParams: {
          pkce: true,
          issuer: myAppConfig.oidc.issuer,
          scopes: myAppConfig.oidc.scopes
        }
      }
    );
  }

  ngOnInit(): void {
    this.oktaSignIn.remove();

    this.oktaSignIn.renderEl({
      el: '#okta-sign-in-widget' // this name should be same as div tag id in login.component.html
    },
      (response: any) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuthService.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }
}
