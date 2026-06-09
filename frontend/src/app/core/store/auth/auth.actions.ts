// store/auth/auth.actions.ts
import { createAction, props } from '@ngrx/store';
import { User } from '../../models';

export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User; accessToken: string }>());
export const logout = createAction('[Auth] Logout');
export const updateUser = createAction('[Auth] Update User', props<{ user: Partial<User> }>());
