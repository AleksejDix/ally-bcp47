/**
 * Performance tests for ally-bcp-47
 * 
 * This script tests the performance of the library's core functions
 * with various inputs to benchmark their execution time.
 * 
 * Run with: node performance-tests.js
 */

import { 
  isValid, 
  isWellFormed, 
  validateLanguageTag, 
  parseTag, 
  canonicalizeTag 
} from './dist/index.js';

const testCases = {
  simple: [
    'en', 'en-US', 'fr-FR', 'de-DE', 'es-ES', 'it-IT', 
    'ja-JP', 'ko-KR', 'zh-CN', 'ru-RU'
  ],
  complex: [
    'zh-Hans-CN', 'sr-Cyrl-RS', 'uz-Latn-UZ', 'zh-Hant-TW',
    'mn-Cyrl-MN', 'pa-Guru-IN', 'sd-Arab-PK', 'hi-Deva-IN'
  ],
  withExtensions: [
    'en-US-u-ca-gregory', 'fr-FR-u-nu-latn', 'ar-EG-u-nu-arab',
    'zh-CN-u-ca-chinese-nu-hans', 'ja-JP-u-ca-japanese', 
    'th-TH-u-nu-thai-ca-buddhist'
  ],
  withPrivateUse: [
    'en-US-x-private', 'fr-FR-x-custom', 'de-DE-x-internal',
    'en-GB-x-screening-reader', 'es-MX-x-dialect-northern'
  ],
  invalid: [
    'en--US', 'a', '123', 'en-123-US', 'en_US', 'EN_us',
    'xx-YY', 'aaa-ZZ', 'en-Abcd'
  ]
};

// Create array with all test cases
const allTestCases = Object.values(testCases).flat();

// Create a large array for bulk testing
const bulkTestCases = Array(1000).fill().map(() => {
  return allTestCases[Math.floor(Math.random() * allTestCases.length)];
});

/**
 * Run a performance test on a function
 */
function runTest(name, fn, input, iterations = 1000) {
  // Warm-up run
  for (let i = 0; i < 100; i++) {
    if (Array.isArray(input)) {
      input.forEach(item => fn(item));
    } else {
      fn(input);
    }
  }
  
  console.log(`Running test: ${name}`);
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    if (Array.isArray(input)) {
      input.forEach(item => fn(item));
    } else {
      fn(input);
    }
  }
  
  const end = performance.now();
  const total = end - start;
  const average = total / iterations;
  
  console.log(`  Total time: ${total.toFixed(2)}ms`);
  console.log(`  Average time: ${average.toFixed(5)}ms per iteration`);
  
  if (Array.isArray(input)) {
    const perTag = total / (iterations * input.length);
    console.log(`  Per tag: ${perTag.toFixed(5)}ms`);
  }
  
  return { total, average };
}

console.log('=== ally-bcp-47 Performance Tests ===');
console.log(`Version: ${process.env.npm_package_version || 'local development'}`);
console.log('');

// Test individual functions with different complexity inputs
console.log('--- Testing isValid ---');
runTest('Simple tags', isValid, testCases.simple);
runTest('Complex tags', isValid, testCases.complex);
runTest('Tags with extensions', isValid, testCases.withExtensions);
runTest('Tags with private use', isValid, testCases.withPrivateUse);
runTest('Invalid tags', isValid, testCases.invalid);
console.log('');

console.log('--- Testing isWellFormed ---');
runTest('Simple tags', isWellFormed, testCases.simple);
runTest('Complex tags', isWellFormed, testCases.complex);
runTest('Tags with extensions', isWellFormed, testCases.withExtensions);
runTest('Tags with private use', isWellFormed, testCases.withPrivateUse);
runTest('Invalid tags', isWellFormed, testCases.invalid);
console.log('');

console.log('--- Testing validateLanguageTag ---');
runTest('Simple tags', validateLanguageTag, testCases.simple);
runTest('Complex tags', validateLanguageTag, testCases.complex);
runTest('Tags with extensions', validateLanguageTag, testCases.withExtensions);
runTest('Tags with private use', validateLanguageTag, testCases.withPrivateUse);
runTest('Invalid tags', tag => {
  try { validateLanguageTag(tag); } catch {}
}, testCases.invalid);
console.log('');

console.log('--- Testing parseTag ---');
runTest('Simple tags', parseTag, testCases.simple);
runTest('Complex tags', parseTag, testCases.complex);
runTest('Tags with extensions', parseTag, testCases.withExtensions);
runTest('Tags with private use', parseTag, testCases.withPrivateUse);
console.log('');

console.log('--- Testing canonicalizeTag ---');
runTest('Simple tags', canonicalizeTag, testCases.simple);
runTest('Complex tags', canonicalizeTag, testCases.complex);
runTest('Tags with extensions', canonicalizeTag, testCases.withExtensions);
runTest('Tags with private use', canonicalizeTag, testCases.withPrivateUse);
console.log('');

// Bulk tests to simulate real-world usage with many tags
console.log('--- Bulk Testing (1000 random tags) ---');
runTest('isValid - bulk', isValid, bulkTestCases, 10);
runTest('isWellFormed - bulk', isWellFormed, bulkTestCases, 10);
runTest('validateLanguageTag - bulk', validateLanguageTag, bulkTestCases, 10);
runTest('parseTag - bulk', parseTag, bulkTestCases.filter(tag => isWellFormed(tag)), 10);
runTest('canonicalizeTag - bulk', canonicalizeTag, bulkTestCases.filter(tag => isWellFormed(tag)), 10);
console.log('');

console.log('=== Performance Tests Complete ==='); 