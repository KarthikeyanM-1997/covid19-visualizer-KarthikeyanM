import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  email: string;
  password: string;

  message: string = "Click Login to authenticate.";

  ngOnInit(): void {
  }

  constructor(private http: HttpClient, private router: Router) {

  }

  login() {
    let body = {
      "email": this.email,
      "password": this.password
    };

    this.http.post("https://zen-user-api.herokuapp.com/users/authenticate", body).subscribe((data) => {

      this.message = "Login Successful !";

      console.log(data);
      
      localStorage.setItem('currentUser', data['token']);
      
      this.router.navigate(["/tracker"]);

    }, (error) => {
      this.message = "Check Login Info !";
    });
  }

  toRegister(){
    this.router.navigate(["/register"]);
  }

}
