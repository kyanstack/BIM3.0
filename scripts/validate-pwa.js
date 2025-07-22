#!/usr/bin/env node

/**
 * PWA Validation Script
 * Checks if the BIM Viewer meets PWA requirements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');

// PWA Requirements Checklist
const requirements = [
  {
    name: 'Web App Manifest',
    file: 'public/manifest.json',
    required: true,
    check: (content) => {
      try {
        const manifest = JSON.parse(content);
        const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
        const missingFields = requiredFields.filter(field => !manifest[field]);
        
        if (missingFields.length > 0) {
          return `Missing required fields: ${missingFields.join(', ')}`;
        }
        
        if (!manifest.icons || manifest.icons.length === 0) {
          return 'No icons defined in manifest';
        }
        
        const has192Icon = manifest.icons.some(icon => icon.sizes === '192x192');
        const has512Icon = manifest.icons.some(icon => icon.sizes === '512x512');
        
        if (!has192Icon || !has512Icon) {
          return 'Missing required icon sizes (192x192 and 512x512)';
        }
        
        return null; // No errors
      } catch (error) {
        return `Invalid JSON: ${error.message}`;
      }
    }
  },
  {
    name: 'Service Worker',
    file: 'public/sw.js',
    required: true,
    check: (content) => {
      if (!content.includes('addEventListener')) {
        return 'Service worker missing event listeners';
      }
      if (!content.includes('caches')) {
        return 'Service worker missing caching functionality';
      }
      return null;
    }
  },
  {
    name: 'HTTPS/SSL',
    file: 'vite.config.ts',
    required: false, // Only required for production
    check: (content) => {
      if (content.includes('https')) {
        return null;
      }
      return 'HTTPS not configured (required for production PWA)';
    }
  },
  {
    name: 'Icons Directory',
    file: 'public/icons',
    required: true,
    check: () => {
      const iconsDir = path.join(projectRoot, 'public/icons');
      if (!fs.existsSync(iconsDir)) {
        return 'Icons directory does not exist';
      }
      
      const files = fs.readdirSync(iconsDir);
      if (files.length === 0) {
        return 'No icon files found';
      }
      
      const requiredSizes = ['192x192', '512x512'];
      const missingSizes = requiredSizes.filter(size => 
        !files.some(file => file.includes(size))
      );
      
      if (missingSizes.length > 0) {
        return `Missing required icon sizes: ${missingSizes.join(', ')}`;
      }
      
      return null;
    }
  },
  {
    name: 'PWA Meta Tags',
    file: 'index.html',
    required: true,
    check: (content) => {
      const requiredTags = [
        'theme-color',
        'apple-mobile-web-app-capable',
        'viewport'
      ];
      
      const missingTags = requiredTags.filter(tag => 
        !content.includes(tag)
      );
      
      if (missingTags.length > 0) {
        return `Missing meta tags: ${missingTags.join(', ')}`;
      }
      
      if (!content.includes('manifest.json')) {
        return 'Manifest not linked in HTML';
      }
      
      return null;
    }
  }
];

// Run validation
console.log('🔍 Validating PWA Requirements...\n');

let passed = 0;
let failed = 0;
let warnings = 0;

requirements.forEach(requirement => {
  const filePath = path.join(projectRoot, requirement.file);
  
  try {
    let content = '';
    let error = null;
    
    if (requirement.file === 'public/icons') {
      // Directory check
      error = requirement.check();
    } else if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf8');
      error = requirement.check(content);
    } else {
      error = `File not found: ${requirement.file}`;
    }
    
    if (error) {
      if (requirement.required) {
        console.log(`❌ ${requirement.name}: ${error}`);
        failed++;
      } else {
        console.log(`⚠️  ${requirement.name}: ${error} (warning)`);
        warnings++;
      }
    } else {
      console.log(`✅ ${requirement.name}: Passed`);
      passed++;
    }
  } catch (err) {
    console.log(`❌ ${requirement.name}: Error checking file - ${err.message}`);
    failed++;
  }
});

console.log('\n📊 Validation Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⚠️  Warnings: ${warnings}`);

if (failed === 0) {
  console.log('\n🎉 PWA validation passed! Your app meets the basic PWA requirements.');
  if (warnings > 0) {
    console.log('⚠️  Consider addressing the warnings for better PWA experience.');
  }
} else {
  console.log('\n🔧 Please fix the failed requirements before deploying as a PWA.');
  process.exit(1);
} 