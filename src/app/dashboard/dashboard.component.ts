import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription, filter, switchMap } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as actions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {

  }

  ngOnInit(): void {
    this.userSubs = this.store.select("auth")
      .pipe(
        filter((auth: any) => auth.user !== null),
        switchMap((auth: any) =>
          this.ingresoEgresoService.initiIngresosEgresosListener(auth.user.uid)        
        )
      )
      .subscribe((items: IngresoEgreso[]) => {
          console.log(items);
          this.store.dispatch(actions.setItems({ items }));
      });
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }
}
