import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import * as actions from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;

  cargando: boolean = false;

  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {

  }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ["", Validators.required ],
      correo: ["", [ Validators.required, Validators.email ] ],
      password: ["", Validators.required ]
    });

    this.uiSubscription = this.store.select("ui").subscribe(ui => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario() {
    // Swal.fire({
    //   title: "En ejecucion",
    //   html: "Espera...",
    //   timerProgressBar: true,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // })

    this.store.dispatch(actions.isLoading());

    setTimeout(() => this.delayCrearUsuario(), 5000);
  }

  delayCrearUsuario() {
    if (this.registroForm.invalid) {
      return;
    }

    this.authService.crearUsuario(
      this.registroForm.value["nombre"],
      this.registroForm.value["correo"],
      this.registroForm.value["password"]
    )
    .then(credenciales => {
      console.log(credenciales);
      // Swal.close()
      this.store.dispatch(actions.stopLoading());
      this.router.navigate(["/"]);
    })
    .catch(err => {
      // Swal.close()
      this.store.dispatch(actions.stopLoading());
      Swal.fire({
        title: 'Oops...',
        text: err.message,
        icon: 'error'
      });
    });
  }
}
