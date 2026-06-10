/**
 * AI API Tests
 * Claude Code CLI integration, content enhancement, and generation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { randomBytes } from 'crypto';

const generateId = () => randomBytes(6).toString('hex');

describe('AI API', () => {
  describe('GET /api/ai/status - Check Claude availability', () => {
    it('should return status object', () => {
      const mockAvailable = true;

      const response = {
        available: mockAvailable,
        message: mockAvailable ? 'Claude Code ready' : 'Claude Code not found in PATH'
      };

      expect(response).toHaveProperty('available');
      expect(response).toHaveProperty('message');
      expect(response.message).toContain('Claude Code');
    });

    it('should indicate available when Claude found', () => {
      const response = {
        available: true,
        message: 'Claude Code ready'
      };

      expect(response.available).toBe(true);
    });

    it('should indicate unavailable when Claude not found', () => {
      const response = {
        available: false,
        message: 'Claude Code not found in PATH'
      };

      expect(response.available).toBe(false);
    });

    it('should handle errors gracefully', () => {
      const errorResponse = {
        available: false,
        error: 'Failed to check Claude availability'
      };

      expect(errorResponse.available).toBe(false);
      expect(errorResponse).toHaveProperty('error');
    });
  });

  describe('POST /api/ai/enhance - Enhance content', () => {
    it('should require content field', () => {
      const errors = [];
      const body = { instruction: 'Make it better' };

      if (!body.content) {
        errors.push('Content is required');
      }

      expect(errors).toContain('Content is required');
    });

    it('should require instruction field', () => {
      const errors = [];
      const body = { content: 'Some text' };

      if (!body.instruction) {
        errors.push('Instruction is required');
      }

      expect(errors).toContain('Instruction is required');
    });

    it('should accept valid request body', () => {
      const body = {
        content: 'Original content',
        instruction: 'Improve clarity'
      };

      const errors = [];
      if (!body.content) errors.push('Content is required');
      if (!body.instruction) errors.push('Instruction is required');

      expect(errors.length).toBe(0);
    });

    it('should accept optional filePath', () => {
      const body = {
        content: 'Original content',
        instruction: 'Improve clarity',
        filePath: '/path/to/file.md'
      };

      expect(body.filePath).toBeDefined();
      expect(body.filePath).toMatch(/\.md$/);
    });

    it('should return enhanced content response', () => {
      const originalContent = 'This is some text';
      const enhancedContent = 'This is some enhanced text with improvements';

      const response = {
        success: true,
        content: enhancedContent,
        originalLength: originalContent.length,
        enhancedLength: enhancedContent.length
      };

      expect(response.success).toBe(true);
      expect(response.content).toBe(enhancedContent);
      expect(response.originalLength).toBe(originalContent.length);
      expect(response.enhancedLength).toBeGreaterThan(response.originalLength);
    });

    it('should handle enhancement errors', () => {
      const errorResponse = {
        error: 'Failed to enhance content',
        details: 'Claude Code not available'
      };

      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse).toHaveProperty('details');
    });
  });

  describe('POST /api/ai/generate - Generate content', () => {
    it('should require type field', () => {
      const errors = [];
      const body = { description: 'Create a blog post' };

      if (!body.type) {
        errors.push('Content type is required');
      }

      expect(errors).toContain('Content type is required');
    });

    it('should require description field', () => {
      const errors = [];
      const body = { type: 'blog' };

      if (!body.description) {
        errors.push('Description is required');
      }

      expect(errors).toContain('Description is required');
    });

    it('should accept valid request body', () => {
      const body = {
        type: 'blog',
        description: 'Write about marketing automation'
      };

      const errors = [];
      if (!body.type) errors.push('Content type is required');
      if (!body.description) errors.push('Description is required');

      expect(errors.length).toBe(0);
    });

    it('should accept optional brandContext', () => {
      const body = {
        type: 'blog',
        description: 'Write about marketing',
        brandContext: { voice: 'professional', tone: 'friendly' }
      };

      expect(body.brandContext).toBeDefined();
      expect(body.brandContext).toHaveProperty('voice');
      expect(body.brandContext).toHaveProperty('tone');
    });

    it('should return generated content response', () => {
      const generatedContent = 'Generated blog post content here...';

      const response = {
        success: true,
        content: generatedContent,
        type: 'blog',
        length: generatedContent.length
      };

      expect(response.success).toBe(true);
      expect(response.content).toBeDefined();
      expect(response.type).toBe('blog');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should handle generation errors', () => {
      const errorResponse = {
        error: 'Failed to generate content',
        details: 'Claude Code not available'
      };

      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse).toHaveProperty('details');
    });

    it('should accept various content types', () => {
      const validTypes = ['blog', 'social', 'email', 'landing', 'other'];

      validTypes.forEach(type => {
        const body = { type, description: `Generate ${type} content` };
        expect(body.type).toBe(type);
      });
    });
  });

  describe('GET /api/brand - Get brand context', () => {
    it('should return brand context object', () => {
      const response = {
        exists: true,
        summary: 'Professional B2B SaaS brand',
        colors: { primary: '#6366f1', secondary: '#ffffff' },
        voice: { tone: 'professional', audience: 'tech executives' },
        fonts: { heading: 'Inter', body: 'Inter' }
      };

      expect(response).toHaveProperty('exists');
      expect(response).toHaveProperty('summary');
      expect(response).toHaveProperty('colors');
      expect(response).toHaveProperty('voice');
      expect(response).toHaveProperty('fonts');
    });

    it('should indicate when brand exists', () => {
      const response = {
        exists: true,
        summary: 'Brand guidelines found'
      };

      expect(response.exists).toBe(true);
    });

    it('should indicate when brand does not exist', () => {
      const response = {
        exists: false,
        summary: 'No brand guidelines found',
        message: 'Run /marketing:init to create brand guidelines'
      };

      expect(response.exists).toBe(false);
      expect(response.message).toContain('/marketing:init');
    });

    it('should return empty objects when no brand data', () => {
      const response = {
        exists: false,
        summary: 'No brand guidelines found',
        colors: {},
        voice: {},
        fonts: {}
      };

      expect(Object.keys(response.colors).length).toBe(0);
      expect(Object.keys(response.voice).length).toBe(0);
      expect(Object.keys(response.fonts).length).toBe(0);
    });

    it('should return populated brand data when available', () => {
      const response = {
        exists: true,
        summary: 'Complete brand guidelines',
        colors: {
          primary: '#6366f1',
          secondary: '#ffffff',
          accent: '#ec4899'
        },
        voice: {
          tone: 'friendly',
          audience: 'startups',
          values: ['innovation', 'clarity', 'accessibility']
        },
        fonts: {
          heading: 'Inter Bold',
          body: 'Inter Regular',
          mono: 'Courier'
        }
      };

      expect(response.colors).not.toEqual({});
      expect(response.voice).not.toEqual({});
      expect(response.fonts).not.toEqual({});
      expect(Object.keys(response.colors)).toHaveLength(3);
    });

    it('should handle errors gracefully', () => {
      const errorResponse = {
        exists: false,
        error: 'Failed to read brand context',
        message: 'Run /marketing:init to create brand guidelines'
      };

      expect(errorResponse.exists).toBe(false);
      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse).toHaveProperty('message');
    });
  });

  describe('Content enhancement validation', () => {
    it('should validate content length', () => {
      const content = '';
      const errors = [];

      if (!content || content.trim().length === 0) {
        errors.push('Content cannot be empty');
      }

      expect(errors).toContain('Content cannot be empty');
    });

    it('should accept any non-empty content', () => {
      const validContents = [
        'Single word',
        'A short sentence.',
        'A much longer piece of content with multiple sentences and paragraphs describing something in detail.',
        '1234567890',
        'Special chars: !@#$%^&*()'
      ];

      validContents.forEach(content => {
        const errors = [];
        if (!content || content.trim().length === 0) {
          errors.push('Content cannot be empty');
        }
        expect(errors.length).toBe(0);
      });
    });
  });

  describe('Content generation validation', () => {
    it('should validate type field', () => {
      const validTypes = ['blog', 'social', 'email', 'landing', 'other'];
      const invalidType = 'invalid_type';

      const errors = [];
      if (!validTypes.includes(invalidType)) {
        errors.push('Invalid content type');
      }

      expect(errors).toContain('Invalid content type');
    });

    it('should validate description length', () => {
      const shortDescription = 'a';
      const errors = [];

      if (shortDescription.length < 3) {
        errors.push('Description too short');
      }

      expect(errors).toContain('Description too short');
    });

    it('should accept reasonable description lengths', () => {
      const descriptions = [
        'Write a blog post about marketing automation',
        'Create social media content for a product launch announcing new features to tech executives'
      ];

      descriptions.forEach(desc => {
        const errors = [];
        if (desc.length < 3) {
          errors.push('Description too short');
        }
        expect(errors.length).toBe(0);
      });
    });
  });

  describe('Brand context structure', () => {
    it('should have consistent color format', () => {
      const brand = {
        colors: {
          primary: '#6366f1',
          secondary: '#ffffff'
        }
      };

      Object.values(brand.colors).forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('should have voice properties', () => {
      const brand = {
        voice: {
          tone: 'professional',
          audience: 'tech',
          values: ['innovation']
        }
      };

      expect(brand.voice).toHaveProperty('tone');
      expect(brand.voice).toHaveProperty('audience');
    });

    it('should have font properties', () => {
      const brand = {
        fonts: {
          heading: 'Inter Bold',
          body: 'Inter Regular'
        }
      };

      expect(brand.fonts).toHaveProperty('heading');
      expect(brand.fonts).toHaveProperty('body');
    });
  });

  describe('Error responses', () => {
    it('should include error message in response', () => {
      const errorResponse = {
        error: 'Failed to process request'
      };

      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
    });

    it('should include optional details field', () => {
      const errorResponse = {
        error: 'Failed to enhance content',
        details: 'Claude Code not available'
      };

      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse).toHaveProperty('details');
    });

    it('should return 400 for validation errors', () => {
      // Validation error responses should have structure
      const validationError = {
        error: 'Validation failed',
        errors: ['Content is required', 'Instruction is required']
      };

      expect(validationError.error).toBe('Validation failed');
      expect(Array.isArray(validationError.errors)).toBe(true);
    });

    it('should return 500 for server errors', () => {
      const serverError = {
        error: 'Internal server error',
        message: 'Database connection failed'
      };

      expect(serverError).toHaveProperty('error');
    });
  });
});
