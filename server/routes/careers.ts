import express from 'express';
import { db } from '../../db.js';
import { jobs, jobApplications } from '../../shared/schema.js';
import { eq, desc } from 'drizzle-orm';

const router = express.Router();

// Get all careers
router.get('/', async (req, res) => {
  try {
    const allCareers = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
    res.json(allCareers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
});

// Get single career
router.get('/:id', async (req, res) => {
  try {
    const career = await db.select().from(jobs).where(eq(jobs.id, req.params.id));
    if (!career.length) {
      return res.status(404).json({ error: 'Career not found' });
    }
    res.json(career[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch career' });
  }
});

// Apply for career
router.post('/:id/apply', async (req, res) => {
  try {
    const { name, email, phone, coverLetter } = req.body;
    const application = await db.insert(jobApplications).values({
      jobId: req.params.id,
      name,
      email,
      phone,
      cvUrl: '/temp-cv.pdf',
      coverLetter,
    }).returning();
    res.status(201).json(application[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

export default router;