import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string = "";

  userSubs: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  logout() {
    this.authService.logout()
    .then(() =>
      this.router.navigate(["/login"])
    );
  }

  ngOnInit(): void {
    this.userSubs = this.store.select("auth")
      .pipe(
        filter((auth: any) => !!auth.user )
      )
      .subscribe(auth => {
        this.nombre = auth.user.nombre;
      });
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }
}
