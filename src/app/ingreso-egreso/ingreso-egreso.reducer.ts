import { createReducer, on } from '@ngrx/store';
import { setItems, unsetItems } from './ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

export interface State {
  items: IngresoEgreso[]; 
}

export const initialState: State = {
  items: [],
}

const _ingresoEgresoReducer = createReducer(initialState,
  on(setItems, (state, props) => ({ ...state, items: [ ...props.items ] })),
  on(unsetItems, state => ({...state, items: []}))
);

export function ingresoEgresoReducer(state, action) {
  return _ingresoEgresoReducer(state, action);
}
