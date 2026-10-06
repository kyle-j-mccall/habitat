import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';

export type AuthInput = {
  email: string;
  password: string;
};

export async function signIn({ email, password }: AuthInput) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signUp({ email, password }: AuthInput) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
  return await signOut(auth);
}
