import express from 'express';
import { db } from '../../db.js';
import { jobs, jobApplications } from '../../shared/schema.js';
import { eq, desc } from 'drizzle-orm';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

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

// Admin: Create job
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { titleEn, titleAr, descriptionEn, descriptionAr, requirements, location, salary, jobType, status } = req.body;
    const newJob = await db.insert(jobs).values({
      titleEn,
      titleAr,
      descriptionEn,
      descriptionAr,
      requirements,
      location,
      salary,
      jobType,
      status,
    }).returning();
    res.json(newJob[0]);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Admin: Update job
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { titleEn, titleAr, descriptionEn, descriptionAr, requirements, location, salary, jobType, status } = req.body;
    const updated = await db.update(jobs)
      .set({
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        requirements,
        location,
        salary,
        jobType,
        status,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, req.params.id))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Admin: Delete job
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.delete(jobs).where(eq(jobs.id, req.params.id));
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;