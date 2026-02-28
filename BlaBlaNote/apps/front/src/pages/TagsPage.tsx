import { FormEvent, useState } from 'react';
import { tagsApi } from '../api/tags.api';
import { useTags } from '../hooks/useTags';

export function TagsPage() {
  const { tags, refetch } = useTags();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#64748B');

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    await tagsApi.create({ name, color });
    setName('');
    await refetch();
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Tags</h1>
      <form className="flex gap-2" onSubmit={onCreate}>
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} required />
        <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white">Create</button>
      </form>
      <div className="grid gap-2">
        {tags.map((tag) => (
          <article key={tag.id} className="rounded-lg border border-slate-200 p-3">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color ?? '#94a3b8' }} />
              {tag.name}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
