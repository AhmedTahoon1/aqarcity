import { db } from '../db.js';
import { sql } from 'drizzle-orm';

async function createTable() {
  try {
    console.log('🔄 Creating statistics table...');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS statistics (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        number varchar(50) NOT NULL,
        title_en varchar(255) NOT NULL,
        title_ar varchar(255) NOT NULL,
        icon varchar(100) NOT NULL,
        is_visible boolean DEFAULT true NOT NULL,
        display_order integer DEFAULT 0 NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS statistics_visible_idx ON statistics(is_visible);
      CREATE INDEX IF NOT EXISTS statistics_order_idx ON statistics(display_order);
    `);

    console.log('✅ Table created');

    // Insert default statistics
    await db.execute(sql`
      INSERT INTO statistics (number, title_en, title_ar, icon, display_order)
      VALUES 
        ('1000+', 'Properties Listed', 'عقار مدرج', 'Building2', 1),
        ('500+', 'Happy Clients', 'عميل سعيد', 'Users', 2),
        ('50+', 'Expert Agents', 'وكيل خبير', 'Award', 3),
        ('100%', 'Satisfaction Rate', 'معدل الرضا', 'ThumbsUp', 4)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Default statistics inserted');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTable();
