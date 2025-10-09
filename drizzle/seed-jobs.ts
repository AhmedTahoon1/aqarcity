import { db } from '../db.js';
import { jobs } from '../shared/schema.js';

async function seedJobs() {
  console.log('🌱 Seeding jobs...');

  try {
    const sampleJobs = [
      {
        titleEn: 'Real Estate Agent',
        titleAr: 'وكيل عقاري',
        descriptionEn: 'Join our team as a real estate agent in Dubai. Help clients buy, sell, and rent properties.',
        descriptionAr: 'انضم إلى فريقنا كوكيل عقاري في دبي. ساعد العملاء في شراء وبيع وتأجير العقارات.',
        requirements: ['RERA License', '2+ years experience', 'English & Arabic fluency'],
        location: 'Dubai',
        salary: '8,000 - 15,000 AED',
        jobType: 'Full-time',
        status: 'active' as const
      },
      {
        titleEn: 'Property Manager',
        titleAr: 'مدير عقارات',
        descriptionEn: 'Manage residential and commercial properties. Oversee maintenance, tenant relations, and operations.',
        descriptionAr: 'إدارة العقارات السكنية والتجارية. الإشراف على الصيانة وعلاقات المستأجرين والعمليات.',
        requirements: ['Property management experience', 'Strong communication skills', 'UAE driving license'],
        location: 'Abu Dhabi',
        salary: '10,000 - 18,000 AED',
        jobType: 'Full-time',
        status: 'active' as const
      },
      {
        titleEn: 'Marketing Specialist',
        titleAr: 'أخصائي تسويق',
        descriptionEn: 'Create marketing campaigns for real estate projects. Handle digital marketing and social media.',
        descriptionAr: 'إنشاء حملات تسويقية للمشاريع العقارية. التعامل مع التسويق الرقمي ووسائل التواصل الاجتماعي.',
        requirements: ['Marketing degree', 'Digital marketing experience', 'Creative skills'],
        location: 'Dubai',
        salary: '7,000 - 12,000 AED',
        jobType: 'Full-time',
        status: 'active' as const
      }
    ];

    await db.insert(jobs).values(sampleJobs);
    console.log('✅ Sample jobs created');
    
  } catch (error) {
    console.error('❌ Jobs seeding failed:', error);
    throw error;
  }
}

seedJobs()
  .then(() => {
    console.log('✅ Jobs seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Jobs seeding failed:', error);
    process.exit(1);
  });