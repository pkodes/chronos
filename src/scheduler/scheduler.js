const prisma = require('../db/client');
const { Queue } = require('bullmq');
const redis = require('../config/redis');

// Create Redis queue
const jobQueue = new Queue('jobQueue', { 
  connection: redis 
});

class Scheduler {
  constructor() {
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️  Scheduler already running');
      return;
    }

    this.isRunning = true;
    console.log('🕐 Scheduler started...');

    // Run every 30 seconds
    this.interval = setInterval(() => {
      this.checkDueJobs();
    }, 30000);

    // Run immediately on startup
    this.checkDueJobs();
  }

  async checkDueJobs() {
    try {
      console.log('🔍 Checking for due jobs...');
      
      // For testing: create a test job if none exist
      const jobCount = await prisma.job.count();
      if (jobCount === 0) {
        console.log('📝 No jobs found. Creating test job...');
        await this.createTestJob();
      }

      // Find jobs that are due to run (nextRunAt <= now)
      const dueJobs = await prisma.job.findMany({
        where: {
          enabled: true,
          nextRunAt: {
            lte: new Date()
          }
        }
      });

      console.log(`📦 Found ${dueJobs.length} due jobs`);

      // Add each due job to the queue
      for (const job of dueJobs) {
        await this.scheduleJobExecution(job);
      }

    } catch (error) {
      console.error('❌ Error in scheduler:', error);
    }
  }

  async createTestJob() {
    // Create a test job that's due immediately
    await prisma.job.create({
      data: {
        name: 'Test Webhook Job',
        type: 'WEBHOOK',
        schedule: 'every 1 minute',
        enabled: true,
        nextRunAt: new Date(), // Due immediately
        payload: {
          url: 'https://httpbin.org/get',
          method: 'GET'
        }
      }
    });
    console.log('✅ Test job created');
  }

  async scheduleJobExecution(job) {
    try {
      // Add job to Redis queue
      await jobQueue.add('execute-job', {
        jobId: job.id,
        type: job.type,
        payload: job.payload
      }, {
        jobId: `${job.id}-${Date.now()}`, // Unique job ID
        removeOnComplete: true
      });

      console.log(`✅ Scheduled job: ${job.name}`);

      // Update nextRunAt (set to 1 minute from now for testing)
      const nextRun = new Date(Date.now() + 60000); // 1 minute later
      await prisma.job.update({
        where: { id: job.id },
        data: { 
          nextRunAt: nextRun
        }
      });

      console.log(`⏰ Next run scheduled for: ${nextRun.toISOString()}`);

    } catch (error) {
      console.error(`❌ Failed to schedule job ${job.name}:`, error);
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.isRunning = false;
      console.log('🛑 Scheduler stopped');
    }
  }
}

// Start the scheduler if this file is run directly
if (require.main === module) {
  const scheduler = new Scheduler();
  scheduler.start();
}

module.exports = Scheduler;