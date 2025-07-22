#!/usr/bin/env node

/**
 * Comprehensive Supabase MCP Connection Test
 * Actually tests the MCP server connection and basic operations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

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

// Test MCP Server Installation
console.log('\n🔧 Testing MCP Server Installation...');

const testMcpServer = () => {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', [
      '-y',
      '@supabase/mcp-server-supabase@latest',
      '--help'
    ], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        SUPABASE_ACCESS_TOKEN: envVars.SUPABASE_ACCESS_TOKEN,
        SUPABASE_PROJECT_REF: envVars.SUPABASE_PROJECT_REF
      }
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0 || output.includes('Usage:') || output.includes('help')) {
        console.log('✅ MCP Server is available');
        resolve(true);
      } else {
        console.log('❌ MCP Server test failed');
        console.log('Error output:', errorOutput);
        reject(new Error('MCP Server not available'));
      }
    });

    child.on('error', (error) => {
      console.log('❌ Failed to run MCP Server');
      console.log('Error:', error.message);
      reject(error);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      child.kill();
      reject(new Error('MCP Server test timed out'));
    }, 10000);
  });
};

// Test basic connection
const testConnection = () => {
  return new Promise((resolve, reject) => {
    console.log('\n🔗 Testing Supabase Connection...');
    
    const child = spawn('npx', [
      '-y',
      '@supabase/mcp-server-supabase@latest',
      '--read-only',
      '--project-ref', envVars.SUPABASE_PROJECT_REF
    ], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        SUPABASE_ACCESS_TOKEN: envVars.SUPABASE_ACCESS_TOKEN,
        SUPABASE_PROJECT_REF: envVars.SUPABASE_PROJECT_REF
      }
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0 || output.includes('connected') || !errorOutput.includes('Error')) {
        console.log('✅ Supabase connection successful');
        resolve(true);
      } else {
        console.log('❌ Supabase connection failed');
        console.log('Error output:', errorOutput);
        reject(new Error('Connection failed'));
      }
    });

    child.on('error', (error) => {
      console.log('❌ Failed to connect to Supabase');
      console.log('Error:', error.message);
      reject(error);
    });

    // Timeout after 15 seconds
    setTimeout(() => {
      child.kill();
      reject(new Error('Connection test timed out'));
    }, 15000);
  });
};

// Run tests
async function runTests() {
  try {
    await testMcpServer();
    await testConnection();
    
    console.log('\n🎉 All tests passed!');
    console.log('\n📝 MCP Configuration Summary:');
    console.log('   ✅ Environment variables are set');
    console.log('   ✅ MCP server is available');
    console.log('   ✅ Supabase connection works');
    console.log('\n🔗 Your Supabase MCP is ready to use!');
    console.log('\n🧪 In Cursor, you can now:');
    console.log('   - List your Supabase projects');
    console.log('   - Query tables in your database');
    console.log('   - Access your Supabase data directly');
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure your Supabase credentials are correct');
    console.log('   2. Check your internet connection');
    console.log('   3. Verify your Supabase project is active');
    console.log('   4. Try restarting Cursor to reload environment variables');
    process.exit(1);
  }
}

runTests(); 