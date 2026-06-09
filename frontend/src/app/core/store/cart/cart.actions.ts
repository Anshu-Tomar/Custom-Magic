// cart.actions.ts
import { createAction, props } from '@ngrx/store';
import { CartItem } from '../../models';

export const setCart = createAction('[Cart] Set', props<{ items: CartItem[] }>());
export const clearCart = createAction('[Cart] Clear');

// cart.reducer.ts
import { createReducer, on } from '@ngrx/store';

export interface CartState { items: CartItem[]; }

const initial: CartState = {
  items: (() => { try { const d = localStorage.getItem('cart_items'); return d ? JSON.parse(d) : []; } catch { return []; } })()
};

import * as CartActions from './cart.actions';

export const cartReducer = createReducer(
  initial,
  on(CartActions.setCart, (_, { items }) => ({ items })),
  on(CartActions.clearCart, () => ({ items: [] }))
);

// cart.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';

const selectCartState = createFeatureSelector<CartState>('cart');
export const selectCartItems = createSelector(selectCartState, s => s.items);
export const selectCartCount = createSelector(selectCartState, s => s.items.reduce((sum, i) => sum + i.quantity, 0));
export const selectCartTotal = createSelector(selectCartState, s => s.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0));
