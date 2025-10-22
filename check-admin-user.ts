import { db } from './db';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';

async function checkAdminUser() {
  try {
    console.log('🔍 Checking admin user...');
    
    const adminUser = await db.select()
      .from(users)
      .where(eq(users.email, 'admin@aqarcity.ae'))
      .limit(1);
    
    if (adminUser.length > 0) {
      console.log('✅ Admin user exists');
      console.log('📋 Admin details:', {
        id: adminUser[0].id,
        name: adminUser[0].name,
        email: adminUser[0].email,
        role: adminUser[0].role
      });
    } else {
      console.log('❌ Admin user not found');
      console.log('💡 Run: npm run create:admin');
    }
    
  } catch (error) {
    console.error('❌ Error checking admin user:', error);
  }
}

checkAdminUser();