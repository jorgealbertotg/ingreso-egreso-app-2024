import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private fireStore: Firestore) { }

  initAuthListener() {
    authState(this.auth).subscribe(fuser =>{
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
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

        return setDoc(doc(this.fireStore, fbUser.user.uid, "usuario"), {...newUser});
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
