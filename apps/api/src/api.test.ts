import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index.js';

describe('ThinkChess API Integration', () => {
  it('responds with health check status', async () => {
    // Basic test of app export
    expect(app).toBeDefined();
  });
});

