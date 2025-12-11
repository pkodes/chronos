const { Worker } = require('bullmq');
const redis = require('../config/redis');
const prisma = require('../db/client');

console.log('👷 Worker starting...');

const worker = new Worker('jobQueue', async (job) => {
  const { jobId, type, payload } = job.data;
  
  console.log(`🏃 Executing job: ${job.name} (ID: ${jobId})`);
  
  try {
    // Create execution record
    const execution = await prisma.jobExecution.create({
      data: {
        jobId,
        status: 'RUNNING',
        scheduledAt: new Date(),
        startedAt: new Date()
      }
    });

    // Execute based on job type
    let result;
    if (type === 'WEBHOOK') {
      result = await executeWebhook(payload);
    } else {
      result = { message: 'Unknown job type' };
    }

    // Update execution as success
    await prisma.jobExecution.update({
      where: { id: execution.id },
      data: {
        status: 'SUCCESS',
        completedAt: new Date(),
        output: JSON.stringify(result)
      }
    });

    console.log(`✅ Job ${jobId} completed successfully`);
    return result;

  } catch (error) {
    // Update execution as failed
    await prisma.jobExecution.update({
      where: { id: execution.id },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
        error: error.message
      }
    });
    
    console.error(`❌ Job ${jobId} failed:`, error);
    throw error;
  }
}, { connection: redis });

// Webhook execution function
async function executeWebhook(payload) {
  const { url, method = 'GET', headers = {}, body } = payload;
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  return {
    status: response.status,
    statusText: response.statusText,
    data: await response.text()
  };
}

worker.on('completed', (job) => {
  console.log(`🎉 ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`💥 ${job.id} has failed with ${err.message}`);
});

console.log('✅ Worker started and listening for jobs...');