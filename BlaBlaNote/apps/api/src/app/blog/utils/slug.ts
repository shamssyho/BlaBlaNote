export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function buildUniqueSlug(
  baseValue: string,
  slugExists: (slug: string) => Promise<boolean>,
  excludedSlug?: string
): Promise<string> {
  const baseSlug = slugify(baseValue);

  if (!baseSlug) {
    return Date.now().toString();
  }

  if (excludedSlug === baseSlug) {
    return baseSlug;
  }

  const exists = await slugExists(baseSlug);
  if (!exists) {
    return baseSlug;
  }

  let index = 2;
  let candidate = `${baseSlug}-${index}`;

  while (candidate !== excludedSlug && (await slugExists(candidate))) {
    index += 1;
    candidate = `${baseSlug}-${index}`;
  }

  return candidate;
}
