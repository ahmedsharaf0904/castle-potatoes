import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    const client = postgres(process.env.DATABASE_URL);
    db = drizzle(client, { schema });
  } catch (error) {
    console.error('[v0] Failed to initialize database:', error);
  }
} else {
  console.warn('[v0] DATABASE_URL is not set. Database operations will fail.');
}

export { db };
