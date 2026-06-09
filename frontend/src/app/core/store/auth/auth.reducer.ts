import { createReducer, on } from '@ngrx/store';
import { User } from '../../models';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initial: AuthState = {
  user: (() => { try { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; } catch { return null; } })(),
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('user')
};

export const authReducer = createReducer(
  initial,
  on(AuthActions.loginSuccess, (state, { user, accessToken }) => ({ ...state, user, accessToken, isAuthenticated: true })),
  on(AuthActions.logout, () => ({ user: null, accessToken: null, isAuthenticated: false })),
  on(AuthActions.updateUser, (state, { user }) => ({ ...state, user: state.user ? { ...state.user, ...user } : null }))
);
