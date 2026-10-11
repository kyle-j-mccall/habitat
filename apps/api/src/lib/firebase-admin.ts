import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import '../config/env.js';

const app = initializeApp({ credential: applicationDefault() });

export const adminAuth = getAuth(app);
