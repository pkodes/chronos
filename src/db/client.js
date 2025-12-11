const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Try a simple query
    const jobCount = await prisma.job.count();
    console.log(`📊 Total jobs in database: ${jobCount}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();

module.exports = prisma;