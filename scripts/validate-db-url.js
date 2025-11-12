#!/usr/bin/env node

/**
 * Validation script for DATABASE_URL
 * Ensures the connection string is properly formatted for Cloudflare Pages (serverless)
 * 
 * Usage:
 *   node scripts/validate-db-url.js
 *   DATABASE_URL="postgres://..." node scripts/validate-db-url.js
 */

const databaseUrl = process.env.DATABASE_URL;

console.log('🔍 Validating DATABASE_URL for Cloudflare Pages compatibility...\n');

if (!databaseUrl) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  console.log('\n💡 Set it with: export DATABASE_URL="your-connection-string"');
  process.exit(1);
}

// Parse the connection string
let parsedUrl;
try {
  parsedUrl = new URL(databaseUrl.replace('postgres://', 'http://').replace('postgresql://', 'http://'));
} catch (error) {
  console.error('❌ ERROR: Invalid DATABASE_URL format');
  console.error('   Must be a valid PostgreSQL connection string');
  process.exit(1);
}

const warnings = [];
const errors = [];
const recommendations = [];

// Extract components
const protocol = databaseUrl.split('://')[0];
const hostname = parsedUrl.hostname;
const port = parsedUrl.port || '5432';
const pathname = parsedUrl.pathname;
const searchParams = new URLSearchParams(parsedUrl.search);

console.log('📋 Connection String Analysis:');
console.log('   Protocol:', protocol);
console.log('   Hostname:', hostname);
console.log('   Port:', port);
console.log('   Database:', pathname);
console.log('   Parameters:', Array.from(searchParams.entries()).map(([k, v]) => `${k}=${v}`).join(', ') || 'none');
console.log('');

// Check 1: Protocol
if (protocol !== 'postgresql' && protocol !== 'postgres') {
  errors.push('Protocol must be "postgresql://" or "postgres://"');
}

// Check 2: Hostname - should use connection pooler for serverless
if (hostname.includes('.supabase.co')) {
  if (hostname.startsWith('db.')) {
    errors.push('Using DIRECT connection (db.*.supabase.co) - will cause connection pool exhaustion in serverless!');
    recommendations.push('Switch to connection pooler: aws-0-[region].pooler.supabase.com');
  } else if (hostname.includes('.pooler.supabase.com')) {
    console.log('✅ Using Supabase connection pooler (good for serverless)');
  }
} else if (hostname === 'localhost' || hostname === '127.0.0.1') {
  warnings.push('Using localhost - this is fine for development but not for production');
} else {
  console.log('ℹ️  Using custom database host:', hostname);
}

// Check 3: Required parameters for PgBouncer
const hasPgBouncer = searchParams.has('pgbouncer');
const pgBouncerValue = searchParams.get('pgbouncer');

if (!hasPgBouncer) {
  errors.push('Missing "pgbouncer=true" parameter - REQUIRED for connection pooling!');
  recommendations.push('Add ?pgbouncer=true to your connection string');
} else if (pgBouncerValue !== 'true') {
  warnings.push(`pgbouncer parameter is "${pgBouncerValue}" but should be "true"`);
}

// Check 4: SSL mode
const sslMode = searchParams.get('sslmode');

if (!sslMode) {
  warnings.push('Missing "sslmode" parameter - recommended for security');
  recommendations.push('Add &sslmode=require to enforce SSL/TLS encryption');
} else if (sslMode === 'require') {
  console.log('✅ SSL encryption required (sslmode=require)');
} else if (sslMode === 'disable') {
  errors.push('SSL is disabled (sslmode=disable) - INSECURE!');
} else {
  console.log('ℹ️  SSL mode:', sslMode);
}

// Check 5: Port
if (port !== '5432') {
  warnings.push(`Non-standard port: ${port} (PostgreSQL default is 5432)`);
}

// Check 6: Contains password
const password = parsedUrl.password;
if (!password || password.length < 8) {
  warnings.push('Password appears weak or missing');
}

// Check 7: Supabase specific checks
if (hostname.includes('supabase')) {
  const hasProjectRef = hostname.split('.')[0];
  if (hasProjectRef.length < 10) {
    warnings.push('Hostname format looks unusual for Supabase');
  }
}

// Print results
console.log('');
console.log('═'.repeat(60));
console.log('');

if (errors.length > 0) {
  console.log('❌ ERRORS (must fix):');
  errors.forEach((error, i) => {
    console.log(`   ${i + 1}. ${error}`);
  });
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS (recommended to fix):');
  warnings.forEach((warning, i) => {
    console.log(`   ${i + 1}. ${warning}`);
  });
  console.log('');
}

if (recommendations.length > 0) {
  console.log('💡 RECOMMENDATIONS:');
  recommendations.forEach((rec, i) => {
    console.log(`   ${i + 1}. ${rec}`);
  });
  console.log('');
}

// Generate corrected URL if using Supabase direct connection
if (hostname.startsWith('db.') && hostname.includes('.supabase.co')) {
  console.log('🔧 Suggested Fix:');
  
  // Extract region from hostname (e.g., db.abcdefgh.supabase.co -> us-west-1)
  const projectRef = hostname.split('.')[1];
  
  // Common Supabase regions
  const region = 'us-west-1'; // Default, user should check their actual region
  
  const fixedUrl = databaseUrl
    .replace(/db\.[^.]+\.supabase\.co/, `aws-0-${region}.pooler.supabase.com`)
    .replace(/\?.*$/, '') + '?pgbouncer=true&sslmode=require';
  
  console.log('   Replace your DATABASE_URL with:');
  console.log('');
  console.log(`   ${fixedUrl.replace(password, '***')}`);
  console.log('');
  console.log('   Note: Verify your region in Supabase dashboard');
  console.log('   Common regions: us-west-1, us-east-1, eu-west-1, ap-southeast-1');
  console.log('');
}

// Final verdict
console.log('═'.repeat(60));
console.log('');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ DATABASE_URL is properly configured for Cloudflare Pages!');
  console.log('');
  process.exit(0);
} else if (errors.length === 0) {
  console.log('⚠️  DATABASE_URL has warnings but should work');
  console.log('   Consider addressing warnings for production use');
  console.log('');
  process.exit(0);
} else {
  console.log('❌ DATABASE_URL has errors and must be fixed before deployment');
  console.log('   Please address the errors listed above');
  console.log('');
  console.log('📚 For more info, see: docs/supabase-setup.md');
  console.log('');
  process.exit(1);
}

