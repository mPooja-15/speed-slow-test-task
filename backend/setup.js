#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Speedy Sell Flow Backend Setup');
console.log('==================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/speedy-db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Security
BCRYPT_ROUNDS=12

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('⚠️  Please update the JWT_SECRET and MONGODB_URI in .env file\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  console.log('Run: npm install\n');
} else {
  console.log('✅ Dependencies already installed\n');
}

console.log('📋 Next Steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Start MongoDB (local or cloud)');
console.log('3. Update .env file with your configuration');
console.log('4. Seed the database: npm run seed');
console.log('5. Start the server: npm run dev');
console.log('\n🎯 The server will be available at: http://localhost:5000');
console.log('📚 API documentation: http://localhost:5000/api');
console.log('🏥 Health check: http://localhost:5000/health');

console.log('\n📖 Sample users after seeding:');
console.log('Admin - Email: admin@speedysell.com, Password: admin123');
console.log('User - Email: john@example.com, Password: password123');

console.log('\n✨ Happy coding!'); 