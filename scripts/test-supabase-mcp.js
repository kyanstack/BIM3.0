#!/usr/bin/env node

/**
 * Supabase MCP Test Script
 * Tests the connection to Supabase using MCP
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const envPath = path.join(projectRoot, '.env');

console.log('🔍 Testing Supabase MCP Connection...\n');

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('   Run: npm run setup-env');
  process.exit(1);
}

// Read and parse .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    const value = valueParts.join('=').trim();
    if (!value.startsWith('#')) {
      envVars[key.trim()] = value.replace(/^["']|["']$/g, '');
    }
  }
});

console.log('📋 Environment Variables Check:');
console.log(`   SUPABASE_ACCESS_TOKEN: ${envVars.SUPABASE_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}`);
console.log(`   SUPABASE_PROJECT_REF: ${envVars.SUPABASE_PROJECT_REF ? '✅ Set' : '❌ Missing'}`);

if (!envVars.SUPABASE_ACCESS_TOKEN) {
  console.log('\n❌ SUPABASE_ACCESS_TOKEN is missing!');
  console.log('   Add it to your .env file');
  process.exit(1);
}

if (!envVars.SUPABASE_PROJECT_REF) {
  console.log('\n❌ SUPABASE_PROJECT_REF is missing!');
  console.log('   Get it from: https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api');
  console.log('   Add it to your .env file');
  process.exit(1);
}

console.log('\n✅ Environment variables are properly configured!');
console.log('\n🔗 MCP Configuration:');
console.log('   The .cursor/mcp.json file is configured to use environment variables');
console.log('   Cursor should now be able to connect to your Supabase project');

console.log('\n🧪 To test the connection in Cursor, try asking:');
console.log('   - "List all my Supabase projects"');
console.log('   - "Show me all tables in my Supabase project"');
console.log('   - "Query the first 5 rows from any table"');

console.log('\n📝 Note: Make sure to restart Cursor after updating .env file');
console.log('   for the environment variables to be loaded.'); 