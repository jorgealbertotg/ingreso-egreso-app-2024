import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ["", Validators.required ],
      correo: ["", [ Validators.required, Validators.email ] ],
      password: ["", Validators.required ]
    });
  }

  crearUsuario() {
    Swal.fire({
      title: "En ejecucion",
      html: "Espera...",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    })

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
      Swal.close()
      this.router.navigate(["/"]);
    })
    .catch(err => {
      Swal.close()
      Swal.fire({
        title: 'Oops...',
        text: err.message,
        icon: 'error'
      });
    });
  }
}
