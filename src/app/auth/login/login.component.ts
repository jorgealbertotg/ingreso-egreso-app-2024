import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from "sweetalert2";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [ "", [ Validators.required, Validators.email ] ],
      password: ["", Validators.required ]
    });
  }

  login() {
    Swal.fire({
      title: "En ejecucion",
      html: "Espera...",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    setTimeout(() => this.delayLogin(), 5000);
  }

  delayLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(
      this.loginForm.value["email"],
      this.loginForm.value["password"]
    )
    .then(userData => {
      console.log(userData);
      Swal.close();
      this.router.navigate(["/"]);
    })
    .catch(err => {
      Swal.close();
      Swal.fire({
        title: 'Oops...',
        text: err.message,
        icon: 'error'
      });
    });
  }
}
