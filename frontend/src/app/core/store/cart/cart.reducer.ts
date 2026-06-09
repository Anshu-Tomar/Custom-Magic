import { createReducer, on } from '@ngrx/store';
import { CartItem } from '../../models';
import * as CartActions from './cart.actions';

export interface CartState { items: CartItem[]; }

const initial: CartState = {
  items: (() => { try { const d = localStorage.getItem('cart_items'); return d ? JSON.parse(d) : []; } catch { return []; } })()
};

export const cartReducer = createReducer(
  initial,
  on(CartActions.setCart, (_, { items }) => ({ items })),
  on(CartActions.clearCart, () => ({ items: [] }))
);
