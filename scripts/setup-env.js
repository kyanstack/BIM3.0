#!/usr/bin/env node

/**
 * Environment Setup Script
 * Helps users create their .env file from the template
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const envTemplatePath = path.join(projectRoot, 'env.template');
const envPath = path.join(projectRoot, '.env');

console.log('🔐 Setting up environment variables...\n');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('   If you want to recreate it, delete the existing .env file first.\n');
  process.exit(0);
}

// Check if template exists
if (!fs.existsSync(envTemplatePath)) {
  console.log('❌ env.template file not found!');
  console.log('   Please make sure env.template exists in the project root.\n');
  process.exit(1);
}

try {
  // Copy template to .env
  const templateContent = fs.readFileSync(envTemplatePath, 'utf8');
  fs.writeFileSync(envPath, templateContent);
  
  console.log('✅ .env file created successfully!');
  console.log('📝 Please edit .env with your actual values:');
  console.log('   - SUPABASE_ACCESS_TOKEN: Your Supabase access token');
  console.log('   - SUPABASE_PROJECT_REF: Your Supabase project reference');
  console.log('\n🔗 Get your Supabase credentials from:');
  console.log('   https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api');
  console.log('\n⚠️  Remember: Never commit .env files to version control!');
  console.log('   The .env file is already added to .gitignore.\n');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
} 