import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from "@ngrx/store";
import Swal from "sweetalert2";
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import * as actions from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;

  cargando: boolean = false;

  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [ "", [ Validators.required, Validators.email ] ],
      password: ["", Validators.required ]
    });

    this.uiSubscription = this.store.select("ui").subscribe((ui) => {
      this.cargando = ui.isLoading;
      console.log("Cargando subs");
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  login() {
    // Swal.fire({
    //   title: "En ejecucion",
    //   html: "Espera...",
    //   timerProgressBar: true,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // })
    
    this.store.dispatch(actions.isLoading());

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
      // Swal.close();
      this.store.dispatch(actions.stopLoading());
      this.router.navigate(["/"]);
    })
    .catch(err => {
      // Swal.close();
      
      this.store.dispatch(actions.stopLoading());
      Swal.fire({
        title: 'Oops...',
        text: err.message,
        icon: 'error'
      });
    });
  }
}
