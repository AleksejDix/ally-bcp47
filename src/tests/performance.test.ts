/**
 * Performance tests for ally-bcp-47 using Vitest
 */
import { describe, it, expect } from 'vitest';
import { 
  isValid, 
  isWellFormed, 
  validateLanguageTag, 
  parseTag, 
  canonicalizeTag 
} from '../index.js';

// Type definitions for performance results
interface PerformanceResult {
  name: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  tagsProcessed: number;
  timePerTag: number;
}

// Test cases by category
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

// Helper function to run performance test
function runPerformanceTest(
  name: string, 
  fn: Function, 
  inputs: string[], 
  iterations: number = 100
): PerformanceResult {
  // Warm-up phase
  for (let i = 0; i < 10; i++) {
    inputs.forEach(input => {
      try {
        fn(input);
      } catch (e) {
        // Ignore errors during warm-up
      }
    });
  }
  
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    inputs.forEach(input => {
      try {
        fn(input);
      } catch (e) {
        // Ignore errors during benchmark
      }
    });
  }
  
  const end = performance.now();
  const totalTime = end - start;
  const tagsProcessed = inputs.length * iterations;
  
  return {
    name,
    iterations,
    totalTime,
    averageTime: totalTime / iterations,
    tagsProcessed,
    timePerTag: totalTime / tagsProcessed
  };
}

describe('Performance Tests', () => {
  const allTags = Object.values(testCases).flat();
  const validTags = allTags.filter(tag => isWellFormed(tag));
  
  describe('isValid Performance', () => {
    it('should validate simple tags efficiently', () => {
      const result = runPerformanceTest('isValid - simple', isValid, testCases.simple);
      expect(result.timePerTag).toBeLessThan(1); // Less than 1ms per tag
      console.log(`isValid - simple: ${result.timePerTag.toFixed(5)}ms per tag`);
    });
    
    it('should validate complex tags efficiently', () => {
      const result = runPerformanceTest('isValid - complex', isValid, testCases.complex);
      expect(result.timePerTag).toBeLessThan(1);
      console.log(`isValid - complex: ${result.timePerTag.toFixed(5)}ms per tag`);
    });
    
    it('should handle bulk validation efficiently', () => {
      const result = runPerformanceTest('isValid - bulk', isValid, allTags, 20);
      expect(result.timePerTag).toBeLessThan(1);
      console.log(`isValid - bulk (${result.tagsProcessed} tags): ${result.timePerTag.toFixed(5)}ms per tag`);
    });
  });
  
  describe('validateLanguageTag Performance', () => {
    it('should provide detailed validation efficiently', () => {
      const result = runPerformanceTest('validateLanguageTag', validateLanguageTag, validTags);
      expect(result.timePerTag).toBeLessThan(5); // More complex, so allow more time
      console.log(`validateLanguageTag: ${result.timePerTag.toFixed(5)}ms per tag`);
    });
  });
  
  describe('parseTag Performance', () => {
    it('should parse tags efficiently', () => {
      const result = runPerformanceTest('parseTag', parseTag, validTags);
      expect(result.timePerTag).toBeLessThan(2);
      console.log(`parseTag: ${result.timePerTag.toFixed(5)}ms per tag`);
    });
  });
  
  describe('canonicalizeTag Performance', () => {
    it('should canonicalize tags efficiently', () => {
      const result = runPerformanceTest('canonicalizeTag', canonicalizeTag, validTags);
      expect(result.timePerTag).toBeLessThan(2);
      console.log(`canonicalizeTag: ${result.timePerTag.toFixed(5)}ms per tag`);
    });
  });
  
  describe('Combined Operations Performance', () => {
    it('should handle typical workflow efficiently', () => {
      const testFn = (tag: string) => {
        if (isWellFormed(tag)) {
          const parsed = parseTag(tag);
          return canonicalizeTag(tag);
        }
        return null;
      };
      
      const result = runPerformanceTest('Typical workflow', testFn, allTags, 10);
      expect(result.timePerTag).toBeLessThan(5);
      console.log(`Typical workflow: ${result.timePerTag.toFixed(5)}ms per tag`);
    });
  });
}); 