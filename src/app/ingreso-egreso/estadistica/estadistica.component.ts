import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: ``
})
export class EstadisticaComponent implements OnInit {

  ingresos: number = 0;

  egresos: number = 0;

  TotalEgresos: number = 0;

  TotalIngresos: number = 0;

  public doughnutChartLabels: string[] = [
    'Ingresos',
    'Egresos'
  ];

  public doughnutChartType: ChartType = 'doughnut';

  public doughnutChartData: ChartData<'doughnut'>;

  constructor(private store: Store<AppStateWithIngreso>) {}

  ngOnInit(): void {
    this.store.select("ingresosEgresos").subscribe((ingresosEgresos: any) => {
      this.generarEstadistica(ingresosEgresos.items);
    });
  }

  generarEstadistica(items: IngresoEgreso[]) {
    this.TotalEgresos = 0;
    this.TotalIngresos = 0;
    this.ingresos = 0;
    this.egresos = 0;

    for (const item of items) {
      if (item.tipo === "ingreso") {
        this.TotalIngresos += item.monto;
        this.ingresos ++;
      } else {
        this.TotalEgresos += item.monto;
        this.egresos ++;
      }
    }

    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        { data: [ this.TotalIngresos, this.TotalEgresos ] }
      ]
    };
  }
}
