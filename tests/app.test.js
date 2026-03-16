import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let tempRoot;

beforeEach(async () => {
  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ppttohtml-test-'));
  process.env.DATA_DIR = path.join(tempRoot, 'data');
  process.env.UPLOAD_DIR = path.join(tempRoot, 'uploads');
  process.env.CONVERTED_DIR = path.join(tempRoot, 'converted');
  process.env.ADMIN_TOKEN = 'test-token';

  vi.resetModules();
});

describe('presentation app', () => {
  it('returns health status', async () => {
    const { createApp } = await import('../src/app.js');
    const app = createApp();

    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it('blocks admin endpoint without token', async () => {
    const { createApp } = await import('../src/app.js');
    const app = createApp();

    const response = await request(app).get('/api/admin/settings');

    expect(response.statusCode).toBe(401);
  });

  it('updates autoplay settings with valid token', async () => {
    const { createApp } = await import('../src/app.js');
    const app = createApp();

    const response = await request(app)
      .post('/api/admin/settings')
      .set('x-admin-token', 'test-token')
      .send({ autoplayEnabled: true, autoplaySeconds: 17 });

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.autoplayEnabled).toBe(true);
    expect(response.body.autoplaySeconds).toBe(17);
  });

  it('rejects invalid autoplay duration', async () => {
    const { createApp } = await import('../src/app.js');
    const app = createApp();

    const response = await request(app)
      .post('/api/admin/settings')
      .set('x-admin-token', 'test-token')
      .send({ autoplayEnabled: true, autoplaySeconds: 0 });

    expect(response.statusCode).toBe(400);
  });
});
