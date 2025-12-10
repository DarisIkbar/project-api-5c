// prisma.config.js
require('dotenv').config(); // memuat environment variables dari .env
const path = require('path');

module.exports = {
  // Lokasi schema Prisma
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),

  // Generator client
  generator: {
    provider: '@prisma/client',
    output: path.join(__dirname, 'node_modules', '@prisma', 'client'),
  },
};
