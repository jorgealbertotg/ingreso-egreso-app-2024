import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDoc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private fireStore: Firestore, private authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.authService.user.uid;

    const documentoUsuario = collection(this.fireStore, `${uid}`);
    const documentoIngresoEgreso = doc(documentoUsuario, "ingreso-egreso");
    const coleccionItems = collection(documentoIngresoEgreso, "items");
    const documentoItems = doc(coleccionItems);

    return setDoc(documentoItems, { ...ingresoEgreso });
  }

  initiIngresosEgresosListener(uid: string) {
    const documentoUsuario = collection(this.fireStore, `${uid}`);
    const documentoIngresoEgreso = doc(documentoUsuario, "ingreso-egreso");
    const coleccionItems = collection(documentoIngresoEgreso, "items");

    return new Observable(subscriber => {
      const snapshot = onSnapshot(
        coleccionItems,
        (itemsDoc) => {
          const items = itemsDoc.docs.map(doc =>
            ({
              ...(doc.data()),
              uid: doc.id
            })
          );
          console.log(uid, items);
          subscriber.next(items)
          // let firebaseUser = userDoc.data();
          // const user = Usuario.fromFirebase(firebaseUser);
          // this._user = user;
          // this.store.dispatch(authActions.setUser({ user }));
        },
        (err) => {
          console.error(err);
          subscriber.error(err);
        }
      );

      return function unsubscribe() {
        snapshot();
      };
    });
  }

  borrarIngresoEgreso(uidItem: string) {
    const uid = this.authService.user.uid;

    const documentoUsuario = collection(this.fireStore, `${uid}`);
    const documentoIngresoEgreso = doc(documentoUsuario, "ingreso-egreso");
    const coleccionItems = collection(documentoIngresoEgreso, "items");
    const documentoItems = doc(coleccionItems, `${uidItem}`);

    return deleteDoc(documentoItems);
  }
}
