import { buildUniqueSlug, slugify } from './slug';

describe('slug utils', () => {
  it('slugify normalizes text', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('  déjà vu  ')).toBe('deja-vu');
  });

  it('buildUniqueSlug appends index when slug exists', async () => {
    const existing = new Set(['hello-world', 'hello-world-1']);

    const slug = await buildUniqueSlug('Hello World', async (candidate) => existing.has(candidate));

    expect(slug).toBe('hello-world-2');
  });
});
