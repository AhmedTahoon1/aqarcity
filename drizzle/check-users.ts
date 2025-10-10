import { db } from '../db';
import { users } from '../shared/schema';

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...');
    
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt
    }).from(users);
    
    console.log(`📊 Total users: ${allUsers.length}`);
    
    if (allUsers.length > 0) {
      console.log('\n👥 Users list:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
    } else {
      console.log('❌ No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    process.exit(0);
  }
}

checkUsers();