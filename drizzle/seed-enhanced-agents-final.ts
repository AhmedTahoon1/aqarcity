import { db } from '../db.js';
import { agents, agentTeams, agentTeamMembers, agentMetrics, users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function seedEnhancedAgentsFinal() {
  console.log('🌱 Seeding enhanced agents with full data...');

  try {
    const hashedPassword = await bcrypt.hash('agent123', 10);

    // Create enhanced agent users
    const agentUsers = [
      {
        email: 'khalid.luxury@aqarcity.ae',
        name: 'Khalid Al Mansouri',
        phone: '+971 50 111 2233',
        role: 'agent' as const,
        languagePreference: 'ar' as const
      },
      {
        email: 'emma.international@aqarcity.ae',
        name: 'Emma Williams',
        phone: '+971 50 222 3344',
        role: 'agent' as const,
        languagePreference: 'en' as const
      },
      {
        email: 'omar.investment@aqarcity.ae',
        name: 'Omar Hassan',
        phone: '+971 50 333 4455',
        role: 'agent' as const,
        languagePreference: 'ar' as const
      },
      {
        email: 'sophia.multilingual@aqarcity.ae',
        name: 'Sophia Chen',
        phone: '+971 50 444 5566',
        role: 'agent' as const,
        languagePreference: 'en' as const
      },
      {
        email: 'ahmed.senior@aqarcity.ae',
        name: 'Ahmed Al Kaabi',
        phone: '+971 50 555 6677',
        role: 'agent' as const,
        languagePreference: 'ar' as const
      }
    ];

    const createdUsers = await db.insert(users).values(
      agentUsers.map(user => ({ ...user, password: hashedPassword }))
    ).returning();

    // Create enhanced agent profiles
    const agentProfiles = createdUsers.map((user, i) => ({
      userId: user.id,
      bioEn: [
        'Luxury property specialist with 8+ years experience in Dubai Marina and Palm Jumeirah.',
        'International real estate expert focusing on high-end residential and commercial properties.',
        'Investment property consultant with proven track record in off-plan developments.',
        'Multilingual agent specializing in Downtown Dubai and Business Bay premium properties.',
        'Senior property advisor with expertise in villa sales and luxury apartment rentals.'
      ][i],
      bioAr: [
        'متخصص في العقارات الفاخرة مع خبرة 8+ سنوات في دبي مارينا ونخلة جميرا.',
        'خبير عقاري دولي متخصص في العقارات السكنية والتجارية الراقية.',
        'مستشار عقارات استثمارية مع سجل حافل في المشاريع قيد الإنشاء.',
        'وكيل متعدد اللغات متخصص في وسط دبي وبيزنس باي للعقارات المميزة.',
        'مستشار عقاري أول خبير في مبيعات الفلل وإيجار الشقق الفاخرة.'
      ][i],
      licenseNumber: `DLD-${2024}${String(i + 1).padStart(4, '0')}`,
      licenseExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      verified: true,
      verifiedAt: new Date(),
      status: 'active' as const,
      reviewsCount: Math.floor(Math.random() * 40) + 15,
      activeListings: Math.floor(Math.random() * 25) + 10,
      totalSalesValue: (Math.random() * 15000000 + 5000000).toFixed(2),
      averageDealValue: (Math.random() * 3000000 + 1000000).toFixed(2),
      responseTime: Math.floor(Math.random() * 8) + 1,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      languages: i % 2 === 0 ? ['Arabic', 'English'] : ['English', 'Hindi', 'Arabic'],
      specializations: [
        ['luxury_properties', 'residential_sale'],
        ['commercial_sale', 'investment'],
        ['off_plan', 'investment'],
        ['residential_rent', 'luxury_properties'],
        ['residential_sale', 'commercial_rent']
      ][i],
      preferredAreas: [
        ['Dubai Marina', 'Palm Jumeirah', 'JBR'],
        ['Downtown Dubai', 'DIFC', 'Business Bay'],
        ['Dubai Hills', 'Arabian Ranches', 'JVC'],
        ['City Walk', 'Al Barsha', 'Motor City'],
        ['Jumeirah', 'Umm Suqeim', 'Al Safa']
      ][i],
      experienceYears: Math.floor(Math.random() * 10) + 3,
      agentLevel: ['manager', 'senior', 'team_leader', 'senior', 'junior'][i] as any,
      companyName: i < 2 ? 'Elite Properties UAE' : i < 4 ? 'Premium Real Estate' : 'Independent Agent',
      companyType: i < 2 ? 'medium_company' : i < 4 ? 'small_team' : 'individual' as any,
      teamSize: i < 2 ? 8 : i < 4 ? 3 : 1,
      officeAddress: [
        'Marina Plaza, Dubai Marina, Dubai',
        'Burj Khalifa Boulevard, Downtown Dubai',
        'Dubai Hills Business Park, Dubai Hills',
        'The Opus Tower, Business Bay, Dubai',
        'Jumeirah Beach Road, Jumeirah, Dubai'
      ][i],
      website: `https://${user.name.toLowerCase().replace(' ', '')}.aqarcity.ae`,
      socialMedia: {
        linkedin: `https://linkedin.com/in/${user.name.toLowerCase().replace(' ', '-')}`,
        instagram: `@${user.name.toLowerCase().replace(' ', '_')}_properties`,
        facebook: `${user.name.replace(' ', '')}Properties`
      },
      workingHours: {
        monday: { start: '09:00', end: '18:00', available: true },
        tuesday: { start: '09:00', end: '18:00', available: true },
        wednesday: { start: '09:00', end: '18:00', available: true },
        thursday: { start: '09:00', end: '18:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '10:00', end: '16:00', available: true },
        sunday: { start: '10:00', end: '16:00', available: i < 3 }
      },
      achievements: [
        ['Top Performer 2023', 'Luxury Sales Expert', 'Customer Excellence Award'],
        ['International Sales Champion', 'Commercial Property Specialist'],
        ['Off-Plan Development Expert', 'Investment Advisor Certified'],
        ['Multilingual Service Award', 'Premium Properties Specialist'],
        ['Rising Star 2023', 'Customer Satisfaction Leader']
      ][i],
      certifications: [
        {
          name: 'Real Estate Broker License',
          issuer: 'Dubai Land Department',
          dateObtained: '2020-01-15',
          expiryDate: '2025-01-15'
        },
        {
          name: 'Property Management Certification',
          issuer: 'RERA',
          dateObtained: '2021-06-01'
        }
      ],
      phone: user.phone,
      whatsapp: user.phone,
      email: user.email,
      isAvailable: true,
      lastActiveAt: new Date(),
      joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      propertiesCount: Math.floor(Math.random() * 30) + 15,
      dealsClosed: Math.floor(Math.random() * 20) + 8
    }));

    const createdAgents = await db.insert(agents).values(agentProfiles).returning();

    // Create teams
    const team1 = await db.insert(agentTeams).values({
      name: 'Elite Luxury Team',
      description: 'Specialized team for luxury properties in prime Dubai locations',
      leadAgentId: createdAgents[0].id,
      companyName: 'Elite Properties UAE'
    }).returning();

    const team2 = await db.insert(agentTeams).values({
      name: 'Investment Specialists',
      description: 'Expert team for investment and off-plan properties',
      leadAgentId: createdAgents[2].id,
      companyName: 'Premium Real Estate'
    }).returning();

    // Add team members
    await db.insert(agentTeamMembers).values([
      { teamId: team1[0].id, agentId: createdAgents[0].id, role: 'team_leader' },
      { teamId: team1[0].id, agentId: createdAgents[1].id, role: 'member' },
      { teamId: team2[0].id, agentId: createdAgents[2].id, role: 'team_leader' },
      { teamId: team2[0].id, agentId: createdAgents[3].id, role: 'member' }
    ]);

    // Create performance metrics
    const metricsData = [];
    for (const agent of createdAgents) {
      for (let month = 1; month <= 6; month++) {
        metricsData.push({
          agentId: agent.id,
          month,
          year: 2024,
          propertiesListed: Math.floor(Math.random() * 12) + 3,
          propertiesSold: Math.floor(Math.random() * 6) + 1,
          propertiesRented: Math.floor(Math.random() * 8) + 2,
          totalCommission: (Math.random() * 400000 + 100000).toFixed(2),
          leadsGenerated: Math.floor(Math.random() * 40) + 15,
          leadsConverted: Math.floor(Math.random() * 12) + 3,
          viewingsArranged: Math.floor(Math.random() * 25) + 8,
          clientMeetings: Math.floor(Math.random() * 20) + 5,
          averageResponseTime: Math.floor(Math.random() * 90) + 30,
          customerSatisfactionScore: (Math.random() * 1.5 + 3.5).toFixed(1),
          repeatClientRate: (Math.random() * 8 + 2).toFixed(2)
        });
      }
    }

    await db.insert(agentMetrics).values(metricsData);

    console.log('✅ Enhanced agents seeding completed!');
    console.log(`- Created ${createdUsers.length} agent users`);
    console.log(`- Created ${createdAgents.length} enhanced agent profiles`);
    console.log(`- Created 2 agent teams`);
    console.log(`- Added ${metricsData.length} performance metrics`);

  } catch (error) {
    console.error('❌ Error seeding enhanced agents:', error);
    throw error;
  }
}

seedEnhancedAgentsFinal()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });