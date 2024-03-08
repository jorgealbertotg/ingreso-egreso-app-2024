import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: ``
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;

  tipo: string = "ingreso";

  cargando: boolean = false;

  cargandoSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {

  }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ["", Validators.required],
      monto: ["", Validators.required]
    });

    this.cargandoSubscription = this.store.select("ui").subscribe(ui => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.cargandoSubscription.unsubscribe();
  }

  guardar() {
    this.store.dispatch(actions.isLoading());

    console.log(this.ingresoForm.value);

    if (this.ingresoForm.invalid) {
      return;
    }

    const ingresoEgreso = {
      descripcion: this.ingresoForm.value["descripcion"],
      monto: this.ingresoForm.value["monto"],
      tipo: this.tipo
    };

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        Swal.fire("Registro creado", this.ingresoForm.value["descripcion"], "success");
        this.ingresoForm.reset();
        this.store.dispatch(actions.stopLoading());
      })
      .catch((err) => {
        console.error(err)
        Swal.fire("Error", err.message, "error");
        this.store.dispatch(actions.stopLoading());
      });
  }
}
