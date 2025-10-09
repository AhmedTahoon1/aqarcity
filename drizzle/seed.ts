import { db } from '../db.js';
import { users, developers, agents, properties, favorites, inquiries, chatMessages, reviews, jobs } from '../shared/schema.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data in correct order (foreign key dependencies)
    await db.delete(reviews);
    await db.delete(chatMessages);
    await db.delete(inquiries);
    await db.delete(favorites);
    await db.delete(properties);
    await db.delete(agents);
    await db.delete(developers);
    await db.delete(users);
    await db.delete(jobs);
    
    console.log('✅ Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123!', 12);
    const adminUser = await db.insert(users).values({
      email: 'admin@aqarcity.ae',
      name: 'Admin User',
      phone: '+971501234567',
      password: hashedPassword,
      role: 'super_admin',
      languagePreference: 'en'
    }).returning();

    console.log('✅ Admin user created');

    // Create sample developer
    const developer = await db.insert(developers).values({
      nameEn: 'Emaar Properties',
      nameAr: 'إعمار العقارية',
      descriptionEn: 'Leading real estate developer in UAE',
      descriptionAr: 'شركة رائدة في التطوير العقاري في دولة الإمارات',
      projectsCount: 50,
      website: 'https://www.emaar.com'
    }).returning();

    console.log('✅ Sample developer created');

    // Create sample agent
    const agent = await db.insert(agents).values({
      userId: adminUser[0].id,
      bioEn: 'Experienced real estate agent specializing in Dubai properties',
      bioAr: 'وكيل عقاري ذو خبرة متخصص في عقارات دبي',
      licenseNumber: 'RERA-12345',
      verified: true,
      rating: '4.8',
      languages: ['English', 'Arabic'],
      phone: '+971501234567',
      whatsapp: '+971501234567',
      email: 'agent@aqarcity.ae'
    }).returning();

    console.log('✅ Sample agents created');

    // Create additional agents
    const agent2 = await db.insert(agents).values({
      userId: adminUser[0].id,
      bioEn: 'Specialist in luxury properties and investment opportunities',
      bioAr: 'متخصص في العقارات الفاخرة والفرص الاستثمارية',
      licenseNumber: 'RERA-67890',
      verified: true,
      rating: '4.9',
      languages: ['English', 'Arabic', 'French'],
      phone: '+971502345678',
      whatsapp: '+971502345678',
      email: 'agent2@aqarcity.ae'
    }).returning();

    // Create sample properties
    const sampleProperties = [
      {
        referenceNumber: 'AC-VL-001',
        titleEn: 'Luxury Villa Dubai Hills',
        titleAr: 'فيلا فاخرة دبي هيلز',
        descriptionEn: 'Stunning 5-bedroom villa with private pool and garden',
        descriptionAr: 'فيلا مذهلة من 5 غرف نوم مع مسبح خاص وحديقة',
        location: 'Dubai Hills Estate',
        city: 'Dubai',
        areaName: 'Dubai Hills',
        coordinates: { lat: 25.0657, lng: 55.2708 },
        price: '4500000',
        status: 'sale' as const,
        propertyType: 'villa' as const,
        bedrooms: 5,
        bathrooms: 6,
        areaSqft: 4500,
        yearBuilt: 2023,
        features: ['Private Pool', 'Garden', 'Maid Room', 'Garage', 'Smart Home'],
        images: ['/sample.svg', '/sample.svg', '/sample.svg'],
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        completionStatus: 'completed' as const,
        handoverStatus: 'ready' as const,
        masterPlanImage: '/sample.svg',
        paymentPlans: [
          {type: 'cash', description: 'Full Cash Payment', discount: '5% Discount'},
          {type: 'installment', description: '3 Years Plan', monthlyPayment: '125,000 AED', years: 3},
          {type: 'installment', description: '5 Years Plan', monthlyPayment: '75,000 AED', years: 5},
          {type: 'installment', description: '7 Years Plan', monthlyPayment: '53,571 AED', years: 7}
        ],
        propertyDescription: 'Stunning luxury villa in the heart of Dubai Hills Estate with premium finishes and modern amenities.',
        agentId: agent[0].id,
        developerId: developer[0].id,
        isFeatured: true
      },
      {
        referenceNumber: 'AC-AP-002',
        titleEn: 'Modern Apt Downtown Dubai',
        titleAr: 'شقة عصرية وسط دبي',
        descriptionEn: 'Elegant 2-bedroom apartment with Burj Khalifa view',
        descriptionAr: 'شقة أنيقة من غرفتي نوم مع إطلالة على برج خليفة',
        location: 'Downtown Dubai',
        city: 'Dubai',
        areaName: 'Downtown',
        coordinates: { lat: 25.1972, lng: 55.2744 },
        price: '2800000',
        status: 'sale' as const,
        propertyType: 'apartment' as const,
        bedrooms: 2,
        bathrooms: 3,
        areaSqft: 1200,
        yearBuilt: 2022,
        features: ['Burj Khalifa View', 'Gym', 'Pool', 'Concierge', 'Valet Parking'],
        images: ['/sample.svg', '/sample.svg'],
        completionStatus: 'completed' as const,
        handoverStatus: 'ready' as const,
        masterPlanImage: '/sample.svg',
        paymentPlans: [
          {type: 'cash', description: 'Full Cash Payment'},
          {type: 'installment', description: '2 Years Plan', monthlyPayment: '116,667 AED', years: 2},
          {type: 'installment', description: '3 Years Plan', monthlyPayment: '77,778 AED', years: 3},
          {type: 'installment', description: '5 Years Plan', monthlyPayment: '46,667 AED', years: 5}
        ],
        propertyDescription: 'Elegant apartment with breathtaking Burj Khalifa views in the prestigious Downtown Dubai.',
        agentId: agent2[0].id,
        developerId: developer[0].id,
        isFeatured: true
      },
      {
        referenceNumber: 'AC-TH-003',
        titleEn: 'Spacious Townhouse Arabian',
        titleAr: 'تاون هاوس واسع المراعي',
        descriptionEn: '3-bedroom townhouse in family-friendly community',
        descriptionAr: 'تاون هاوس من 3 غرف نوم في مجتمع مناسب للعائلات',
        location: 'Arabian Ranches',
        city: 'Dubai',
        areaName: 'Arabian Ranches',
        coordinates: { lat: 25.0521, lng: 55.2096 },
        price: '3200000',
        status: 'sale' as const,
        propertyType: 'townhouse' as const,
        bedrooms: 3,
        bathrooms: 4,
        areaSqft: 2200,
        yearBuilt: 2021,
        features: ['Community Pool', 'Playground', 'Golf Course View', 'BBQ Area'],
        images: ['/sample.svg'],
        completionStatus: 'under_construction' as const,
        handoverStatus: 'future' as const,
        handoverDate: 'Q4 2024',
        masterPlanImage: '/sample.svg',
        paymentPlans: [
          {type: 'installment', description: '2 Years Plan', monthlyPayment: '133,333 AED', years: 2},
          {type: 'installment', description: '4 Years Plan', monthlyPayment: '66,667 AED', years: 4},
          {type: 'installment', description: '6 Years Plan', monthlyPayment: '44,444 AED', years: 6}
        ],
        propertyDescription: 'Family-friendly townhouse in Arabian Ranches with golf course views and community amenities.',
        agentId: agent[0].id,
        isFeatured: false
      },
      {
        referenceNumber: 'AC-PH-004',
        titleEn: 'Penthouse Marina Walk',
        titleAr: 'بنتهاوس مارينا ووك',
        descriptionEn: 'Exclusive penthouse with panoramic marina views',
        descriptionAr: 'بنتهاوس حصري مع إطلالات بانورامية على المارينا',
        location: 'Dubai Marina',
        city: 'Dubai',
        areaName: 'Marina',
        coordinates: { lat: 25.0772, lng: 55.1392 },
        price: '8500000',
        status: 'sale' as const,
        propertyType: 'penthouse' as const,
        bedrooms: 4,
        bathrooms: 5,
        areaSqft: 3500,
        yearBuilt: 2024,
        features: ['Marina View', 'Private Terrace', 'Jacuzzi', 'Wine Cellar'],
        images: ['/sample.svg', '/sample.svg', '/sample.svg', '/sample.svg'],
        completionStatus: 'under_construction' as const,
        handoverStatus: 'future' as const,
        handoverDate: 'Q2 2025',
        masterPlanImage: '/sample.svg',
        paymentPlans: [
          {type: 'cash', description: 'Cash Payment', discount: '5% Discount'},
          {type: 'installment', description: '3 Years Plan', monthlyPayment: '236,111 AED', years: 3},
          {type: 'installment', description: '5 Years Plan', monthlyPayment: '141,667 AED', years: 5},
          {type: 'installment', description: '7 Years Plan', monthlyPayment: '101,190 AED', years: 7},
          {type: 'installment', description: '10 Years Plan', monthlyPayment: '70,833 AED', years: 10}
        ],
        propertyDescription: 'Exclusive penthouse with panoramic marina views and luxury amenities in Dubai Marina.',
        agentId: agent2[0].id,
        developerId: developer[0].id,
        isFeatured: true
      },
      {
        referenceNumber: 'AC-ST-005',
        titleEn: 'Studio Apartment JLT',
        titleAr: 'شقة استوديو الجميرا',
        descriptionEn: 'Fully furnished studio with lake view',
        descriptionAr: 'استوديو مفروش بالكامل مع إطلالة على البحيرة',
        location: 'Jumeirah Lake Towers',
        city: 'Dubai',
        areaName: 'JLT',
        coordinates: { lat: 25.0693, lng: 55.1416 },
        price: '65000',
        status: 'rent' as const,
        propertyType: 'apartment' as const,
        bedrooms: 0,
        bathrooms: 1,
        areaSqft: 450,
        yearBuilt: 2020,
        features: ['Furnished', 'Lake View', 'Metro Access', 'Gym'],
        images: ['/sample.svg', '/sample.svg'],
        completionStatus: 'completed' as const,
        handoverStatus: 'ready' as const,
        masterPlanImage: '/sample.svg',
        paymentPlans: [
          {type: 'cash', description: 'Annual Cash Payment'},
          {type: 'installment', description: 'Monthly Payment', monthlyPayment: '5,417 AED', years: 1}
        ],
        propertyDescription: 'Fully furnished studio with lake views and metro access in JLT.',
        agentId: agent[0].id,
        isFeatured: false
      },
      {
        referenceNumber: 'AC-VL-006',
        titleEn: 'Family Villa Jumeirah',
        titleAr: 'فيلا عائلية الجميرا',
        descriptionEn: '4-bedroom villa near the beach',
        descriptionAr: 'فيلا من 4 غرف نوم بالقرب من الشاطئ',
        location: 'Jumeirah 1',
        city: 'Dubai',
        areaName: 'Jumeirah',
        coordinates: { lat: 25.2285, lng: 55.2593 },
        price: '180000',
        status: 'rent' as const,
        propertyType: 'villa' as const,
        bedrooms: 4,
        bathrooms: 5,
        areaSqft: 3200,
        yearBuilt: 2019,
        features: ['Beach Access', 'Private Garden', 'Maid Room', 'Study Room'],
        images: ['/sample.svg', '/sample.svg', '/sample.svg'],
        completionStatus: 'completed' as const,
        handoverStatus: 'ready' as const,
        masterPlanImage: '/sample.svg',
        paymentPlans: [
          {type: 'cash', description: 'Annual Cash Payment'},
          {type: 'installment', description: 'Quarterly Payment', monthlyPayment: '15,000 AED', years: 1}
        ],
        propertyDescription: 'Beachfront family villa with private garden and beach access in Jumeirah.',
        agentId: agent2[0].id,
        isFeatured: true
      }
    ];

    await db.insert(properties).values(sampleProperties);
    console.log('✅ Sample properties created');

    // Create sample jobs
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

    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });