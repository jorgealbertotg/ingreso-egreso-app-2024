import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore, Unsubscribe, doc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userUnsubscribe: Unsubscribe;

  private _user: Usuario;

  constructor(private auth: Auth, private fireStore: Firestore, private store: Store<AppState>) { }

  get user() {
    return { ...this._user };
  }

  initAuthListener() {
    authState(this.auth).subscribe(fuser =>{
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);

      if (fuser) {
        this.userUnsubscribe = onSnapshot(
          doc(this.fireStore, fuser.uid, "usuario"),
          (userDoc) => {
            let firebaseUser = userDoc.data();
            const user = Usuario.fromFirebase(firebaseUser);
            this._user = user;

            this.store.dispatch(authActions.setUser({ user }));
          },
          (err) => { console.error(err); }
        );
      } else {
        if (this.userUnsubscribe) {
          this._user = null;
          this.userUnsubscribe();
        }

        this.store.dispatch(authActions.unsetUser());

        this.store.dispatch(ingresoEgresoActions.unsetItems());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(fbUser => {
        const newUser = new Usuario(
          fbUser.user.uid,
          nombre,
          fbUser.user.email
        );

        return setDoc(doc(this.fireStore, fbUser.user.uid, "usuario"), { ...newUser });
      });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isAuth() {
    return authState(this.auth).pipe(
      map(fbuser => fbuser != null)
    );
  }
}
