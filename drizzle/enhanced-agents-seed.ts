import { db } from '../db.js';
import { agents, agentTeams, agentTeamMembers, agentMetrics, users } from '../shared/schema';
import { eq } from 'drizzle-orm';

export async function seedEnhancedAgents() {
  console.log('🌱 Seeding enhanced agents data...');

  try {
    // Get existing agents to update
    const existingAgents = await db.select().from(agents).limit(5);
    
    if (existingAgents.length === 0) {
      console.log('No existing agents found. Please run basic agent seed first.');
      return;
    }

    // Update existing agents with enhanced data
    for (let i = 0; i < existingAgents.length; i++) {
      const agent = existingAgents[i];
      
      await db.update(agents)
        .set({
          status: 'active',
          licenseExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          verifiedAt: new Date(),
          reviewsCount: Math.floor(Math.random() * 50) + 10,
          activeListings: Math.floor(Math.random() * 20) + 5,
          totalSalesValue: (Math.random() * 10000000 + 1000000).toFixed(2),
          averageDealValue: (Math.random() * 2000000 + 500000).toFixed(2),
          responseTime: Math.floor(Math.random() * 12) + 1,
          website: `https://agent${i + 1}.aqarcity.ae`,
          socialMedia: {
            linkedin: `https://linkedin.com/in/agent${i + 1}`,
            instagram: `@agent${i + 1}_properties`,
            facebook: `Agent${i + 1}Properties`
          },
          specializations: [
            'residential_sale',
            i % 2 === 0 ? 'luxury_properties' : 'off_plan',
            'investment'
          ],
          preferredAreas: [
            'Dubai Marina',
            'Downtown Dubai',
            i % 2 === 0 ? 'Palm Jumeirah' : 'Business Bay'
          ],
          experienceYears: Math.floor(Math.random() * 15) + 2,
          agentLevel: i === 0 ? 'manager' : i === 1 ? 'senior' : 'junior',
          companyName: i < 2 ? 'Elite Properties UAE' : `Agent ${i + 1} Real Estate`,
          companyType: i < 2 ? 'medium_company' : 'individual',
          teamSize: i < 2 ? Math.floor(Math.random() * 10) + 5 : 1,
          officeAddress: `Office ${i + 1}, Business Bay, Dubai, UAE`,
          workingHours: {
            monday: { start: '09:00', end: '18:00', available: true },
            tuesday: { start: '09:00', end: '18:00', available: true },
            wednesday: { start: '09:00', end: '18:00', available: true },
            thursday: { start: '09:00', end: '18:00', available: true },
            friday: { start: '09:00', end: '17:00', available: true },
            saturday: { start: '10:00', end: '16:00', available: true },
            sunday: { start: '10:00', end: '16:00', available: false }
          },
          achievements: [
            'Top Performer 2023',
            'Customer Excellence Award',
            i % 2 === 0 ? 'Luxury Properties Specialist' : 'Off-Plan Expert'
          ],
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
          lastActiveAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(agents.id, agent.id));
    }

    // Create agent teams
    const team1 = await db.insert(agentTeams).values({
      name: 'Elite Properties Team',
      description: 'Specialized in luxury and high-end properties across Dubai',
      leadAgentId: existingAgents[0].id,
      companyName: 'Elite Properties UAE',
      isActive: true
    }).returning();

    const team2 = await db.insert(agentTeams).values({
      name: 'Investment Specialists',
      description: 'Expert team focusing on investment properties and off-plan developments',
      leadAgentId: existingAgents[1].id,
      companyName: 'Elite Properties UAE',
      isActive: true
    }).returning();

    // Add team members
    if (existingAgents.length >= 3) {
      await db.insert(agentTeamMembers).values([
        {
          teamId: team1[0].id,
          agentId: existingAgents[0].id,
          role: 'team_leader',
          isActive: true
        },
        {
          teamId: team1[0].id,
          agentId: existingAgents[2].id,
          role: 'member',
          isActive: true
        },
        {
          teamId: team2[0].id,
          agentId: existingAgents[1].id,
          role: 'team_leader',
          isActive: true
        }
      ]);

      if (existingAgents.length >= 4) {
        await db.insert(agentTeamMembers).values({
          teamId: team2[0].id,
          agentId: existingAgents[3].id,
          role: 'member',
          isActive: true
        });
      }
    }

    // Create performance metrics for the last 6 months
    const currentDate = new Date();
    const metricsData = [];

    for (const agent of existingAgents) {
      for (let monthsBack = 0; monthsBack < 6; monthsBack++) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - monthsBack);
        
        metricsData.push({
          agentId: agent.id,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          propertiesListed: Math.floor(Math.random() * 15) + 5,
          propertiesSold: Math.floor(Math.random() * 8) + 1,
          propertiesRented: Math.floor(Math.random() * 12) + 2,
          totalCommission: (Math.random() * 500000 + 50000).toFixed(2),
          leadsGenerated: Math.floor(Math.random() * 50) + 20,
          leadsConverted: Math.floor(Math.random() * 15) + 5,
          viewingsArranged: Math.floor(Math.random() * 30) + 10,
          clientMeetings: Math.floor(Math.random() * 25) + 8,
          averageResponseTime: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
          customerSatisfactionScore: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
          repeatClientRate: (Math.random() * 30 + 10).toFixed(2) // 10-40%
        });
      }
    }

    await db.insert(agentMetrics).values(metricsData);

    console.log('✅ Enhanced agents data seeded successfully!');
    console.log(`- Updated ${existingAgents.length} agents with enhanced data`);
    console.log(`- Created ${team1.length + team2.length} agent teams`);
    console.log(`- Added ${metricsData.length} performance metrics records`);

  } catch (error) {
    console.error('❌ Error seeding enhanced agents data:', error);
    throw error;
  }
}

// Run if called directly
seedEnhancedAgents()
  .then(() => {
    console.log('Enhanced agents seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Enhanced agents seeding failed:', error);
    process.exit(1);
  });