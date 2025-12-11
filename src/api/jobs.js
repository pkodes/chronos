const express = require('express');
const prisma = require('../db/client');
const { Queue } = require('bullmq');
const redis = require('../config/redis');

const router = express.Router();

// CREATE a new job
router.post('/', async (req, res) => {
  try {
    const { name, schedule, type = 'WEBHOOK', payload } = req.body;

    if (!name || !schedule) {
      return res.status(400).json({ 
        error: 'Name and schedule are required' 
      });
    }

    let nextRunAt = new Date();
    if (schedule.includes('minute')) {
      nextRunAt = new Date(Date.now() + 60000);
    }

    const job = await prisma.job.create({
      data: {
        name,
        schedule,
        type,
        payload,
        enabled: true,
        nextRunAt: nextRunAt
      }
    });

    res.status(201).json({
      message: 'Job created successfully!',
      job
    });

  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        executions: {
          orderBy: { scheduledAt: 'desc' },
          take: 5
        }
      }
    });

    res.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: {
        executions: {
          orderBy: { scheduledAt: 'desc' }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE job
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const job = await prisma.job.update({
      where: { id },
      data: updates
    });
    
    res.json({ message: 'Job updated', job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE job
router.delete('/:id', async (req, res) => {
  try {
    await prisma.job.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MANUAL EXECUTE job
router.post('/:id/run', async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id }
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const queue = new Queue('jobQueue', { connection: redis });
    
    await queue.add('execute-job', {
      jobId: job.id,
      type: job.type,
      payload: job.payload
    }, {
      jobId: `${job.id}-manual-${Date.now()}`,
      removeOnComplete: true
    });
    
    res.json({ message: 'Job queued for immediate execution' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET job executions
router.get('/:id/executions', async (req, res) => {
  try {
    const executions = await prisma.jobExecution.findMany({
      where: { jobId: req.params.id },
      orderBy: { scheduledAt: 'desc' }
    });
    
    res.json({ executions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;