import { FormEvent, useEffect, useState } from 'react';
import { blogApi } from '../../api/blog.api';
import { BlogCategory } from '../../types/blog.types';

export function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    blogApi
      .getCategories()
      .then(setCategories)
      .catch((err: { message?: string }) => setError(err.message ?? 'Failed to load categories'));
  }

  useEffect(() => {
    load();
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    const action = editingId
      ? blogApi.adminUpdateCategory(editingId, { name })
      : blogApi.adminCreateCategory({ name });

    action
      .then(() => {
        setName('');
        setEditingId(null);
        load();
      })
      .catch((err: { message?: string }) => setError(err.message ?? 'Failed to save category'));
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Blog Categories</h1>
      {error ? <p className="text-red-600">{error}</p> : null}
      <form onSubmit={onSubmit} className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} required className="rounded border border-slate-300 px-3 py-2" placeholder="Category name" />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">{editingId ? 'Update' : 'Create'}</button>
      </form>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
            <div>
              <p className="font-medium text-slate-900">{category.name}</p>
              <p className="text-xs text-slate-500">/{category.slug}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="rounded border border-slate-300 px-3 py-1 text-sm" onClick={() => { setEditingId(category.id); setName(category.name); }}>
                Edit
              </button>
              <button
                type="button"
                className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"
                onClick={() =>
                  blogApi
                    .adminDeleteCategory(category.id)
                    .then(load)
                    .catch((err: { message?: string }) => setError(err.message ?? 'Failed to delete category'))
                }
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
