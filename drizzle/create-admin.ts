import { db } from '../db';
import { users } from '../shared/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    
    const adminEmail = 'admin@aqarcity.ae';
    const adminPassword = 'admin123!';
    
    // Check if admin already exists
    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
    
    if (existingAdmin.length > 0) {
      console.log('⚠️ Admin user already exists');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Create admin user
    const newAdmin = await db.insert(users).values({
      email: adminEmail,
      name: 'مدير النظام',
      password: hashedPassword,
      role: 'super_admin',
      phone: '+971501234567'
    }).returning();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role: super_admin');
    console.log('🆔 ID:', newAdmin[0].id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();