import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '../db.js';
import pool from '../db.js';

async function main() {
  console.log('🔄 Running migrations...');
  
  try {
    await migrate(db, { migrationsFolder: './drizzle/migrations' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();