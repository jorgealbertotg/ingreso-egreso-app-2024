import { Component, OnDestroy, OnInit } from '@angular/core';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: ``
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[];

  ingresosSubs: Subscription;

  constructor(private store: Store<AppStateWithIngreso>, private ingresoEgresoService: IngresoEgresoService) {

  }

  ngOnInit(): void {
    this.ingresosSubs = this.store.select("ingresosEgresos").subscribe((ingresosEgresos: any) => {
      this.ingresosEgresos = ingresosEgresos.items;
    });
  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }

  borrar(uid: string) {
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
      .then(() =>{
        Swal.fire("Borrado", "Item borrado", "success");
      })
      .catch(err =>{
        Swal.fire("Error", err.message, "error");
      });
  }
}
