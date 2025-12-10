// test.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log('Connected'))
  .finally(() => prisma.$disconnect());
