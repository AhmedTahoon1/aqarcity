import express from 'express';
import { db } from '../../db.js';
import { agentTeams, agentTeamMembers, agents, users } from '../../shared/schema.js';
import { eq, desc, and, count } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all agent teams
router.get('/', async (req, res) => {
  try {
    const { active = 'true', limit = 20, offset = 0 } = req.query;
    
    const conditions = [];
    if (active === 'true') {
      conditions.push(eq(agentTeams.isActive, true));
    }

    const teams = await db.select({
      team: agentTeams,
      leadAgent: agents,
      leadUser: users,
      memberCount: count(agentTeamMembers.id)
    })
    .from(agentTeams)
    .innerJoin(agents, eq(agentTeams.leadAgentId, agents.id))
    .innerJoin(users, eq(agents.userId, users.id))
    .leftJoin(agentTeamMembers, and(
      eq(agentTeamMembers.teamId, agentTeams.id),
      eq(agentTeamMembers.isActive, true)
    ))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(agentTeams.id, agents.id, users.id)
    .orderBy(desc(agentTeams.createdAt))
    .limit(parseInt(limit as string))
    .offset(parseInt(offset as string));

    res.json(teams);
  } catch (error) {
    console.error('Teams fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Get single team with members
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const team = await db.select({
      team: agentTeams,
      leadAgent: agents,
      leadUser: users
    })
    .from(agentTeams)
    .innerJoin(agents, eq(agentTeams.leadAgentId, agents.id))
    .innerJoin(users, eq(agents.userId, users.id))
    .where(eq(agentTeams.id, id))
    .limit(1);

    if (!team.length) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Get team members
    const members = await db.select({
      member: agentTeamMembers,
      agent: agents,
      user: users
    })
    .from(agentTeamMembers)
    .innerJoin(agents, eq(agentTeamMembers.agentId, agents.id))
    .innerJoin(users, eq(agents.userId, users.id))
    .where(and(
      eq(agentTeamMembers.teamId, id),
      eq(agentTeamMembers.isActive, true)
    ))
    .orderBy(agentTeamMembers.joinedAt);

    res.json({
      ...team[0],
      members
    });
  } catch (error) {
    console.error('Team fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Create new team (team leaders only)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, description, companyName } = req.body;
    
    // Check if user is an agent and has appropriate level
    const userAgent = await db.select()
      .from(agents)
      .where(eq(agents.userId, req.user!.id))
      .limit(1);

    if (!userAgent.length) {
      return res.status(403).json({ error: 'Only agents can create teams' });
    }

    const agent = userAgent[0];
    if (!['team_leader', 'manager', 'director'].includes(agent.agentLevel)) {
      return res.status(403).json({ error: 'Insufficient permissions to create team' });
    }

    const newTeam = await db.insert(agentTeams).values({
      name,
      description,
      leadAgentId: agent.id,
      companyName,
      isActive: true
    }).returning();

    // Add team leader as first member
    await db.insert(agentTeamMembers).values({
      teamId: newTeam[0].id,
      agentId: agent.id,
      role: 'team_leader',
      isActive: true
    });

    res.status(201).json({
      message: 'Team created successfully',
      team: newTeam[0]
    });
  } catch (error) {
    console.error('Team creation error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Add member to team
router.post('/:id/members', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { agentId, role = 'member' } = req.body;
    
    // Check if user is team leader
    const team = await db.select()
      .from(agentTeams)
      .innerJoin(agents, eq(agentTeams.leadAgentId, agents.id))
      .where(and(
        eq(agentTeams.id, id),
        eq(agents.userId, req.user!.id)
      ))
      .limit(1);

    if (!team.length) {
      return res.status(403).json({ error: 'Only team leaders can add members' });
    }

    // Check if agent exists and is not already a member
    const existingMember = await db.select()
      .from(agentTeamMembers)
      .where(and(
        eq(agentTeamMembers.teamId, id),
        eq(agentTeamMembers.agentId, agentId),
        eq(agentTeamMembers.isActive, true)
      ))
      .limit(1);

    if (existingMember.length) {
      return res.status(400).json({ error: 'Agent is already a team member' });
    }

    const newMember = await db.insert(agentTeamMembers).values({
      teamId: id,
      agentId,
      role,
      isActive: true
    }).returning();

    res.status(201).json({
      message: 'Member added successfully',
      member: newMember[0]
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Remove member from team
router.delete('/:id/members/:memberId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id, memberId } = req.params;
    
    // Check if user is team leader
    const team = await db.select()
      .from(agentTeams)
      .innerJoin(agents, eq(agentTeams.leadAgentId, agents.id))
      .where(and(
        eq(agentTeams.id, id),
        eq(agents.userId, req.user!.id)
      ))
      .limit(1);

    if (!team.length) {
      return res.status(403).json({ error: 'Only team leaders can remove members' });
    }

    await db.update(agentTeamMembers)
      .set({ isActive: false })
      .where(and(
        eq(agentTeamMembers.teamId, id),
        eq(agentTeamMembers.id, memberId)
      ));

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// Update team
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, description, companyName } = req.body;
    
    // Check if user is team leader
    const team = await db.select()
      .from(agentTeams)
      .innerJoin(agents, eq(agentTeams.leadAgentId, agents.id))
      .where(and(
        eq(agentTeams.id, id),
        eq(agents.userId, req.user!.id)
      ))
      .limit(1);

    if (!team.length) {
      return res.status(403).json({ error: 'Only team leaders can update team' });
    }

    const updatedTeam = await db.update(agentTeams)
      .set({
        name,
        description,
        companyName,
        updatedAt: new Date()
      })
      .where(eq(agentTeams.id, id))
      .returning();

    res.json({
      message: 'Team updated successfully',
      team: updatedTeam[0]
    });
  } catch (error) {
    console.error('Team update error:', error);
    res.status(500).json({ error: 'Failed to update team' });
  }
});

export default router;