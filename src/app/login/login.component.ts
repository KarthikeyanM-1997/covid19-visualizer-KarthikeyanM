import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  firstName: string;
  lastName: string;
  email: string;
  password: string;

  message: string = "Click Register to create an account.";

  ngOnInit(): void {
  }

  constructor(private http: HttpClient, private router: Router) {

  }

  register() {
    let body = {
      "firstName": this.firstName,
      "lastName": this.lastName,
      "email": this.email,
      "password": this.password
    };

    this.http.post("https://zen-user-api.herokuapp.com/users/register", body).subscribe((data) => {

      this.message = "Registration Successful !";

      this.router.navigate(["/tracker"]);

    }, (error) => {
      this.message = "Check Registration Info !";
    });
  }

  toLogin(){
    this.router.navigate(["/login"]);
  }

}
