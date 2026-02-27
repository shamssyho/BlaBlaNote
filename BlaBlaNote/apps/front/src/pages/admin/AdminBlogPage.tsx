import { FormEvent, useEffect, useState } from 'react';
import { blogApi } from '../../api/blog.api';
import { BlogCategory, BlogPost } from '../../types/blog.types';

const initialForm = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  categoryId: '',
  published: false,
};

export function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    Promise.all([
      blogApi.getPosts({ page: 1, pageSize: 100 }),
      blogApi.getCategories(),
    ])
      .then(([postsData, categoriesData]) => {
        setItems(postsData.items);
        setCategories(categoriesData);
      })
      .catch((err: { message?: string }) => setError(err.message ?? 'Failed to load admin blog data'));
  }

  useEffect(() => {
    load();
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage || undefined,
      categoryId: form.categoryId || undefined,
      published: form.published,
    };

    const action = editingId
      ? blogApi.adminUpdatePost(editingId, payload)
      : blogApi.adminCreatePost(payload);

    action
      .then(() => {
        setForm(initialForm);
        setEditingId(null);
        load();
      })
      .catch((err: { message?: string }) => setError(err.message ?? 'Failed to save post'));
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Blog Posts</h1>
      {error ? <p className="text-red-600">{error}</p> : null}

      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded border border-slate-300 px-3 py-2" required />
        <input value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} placeholder="Excerpt" className="rounded border border-slate-300 px-3 py-2" required />
        <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder="Content" className="min-h-40 rounded border border-slate-300 px-3 py-2" required />
        <input value={form.coverImage} onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))} placeholder="Cover image URL" className="rounded border border-slate-300 px-3 py-2" />
        <select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} className="rounded border border-slate-300 px-3 py-2">
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))} />
          Published
        </label>
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">{editingId ? 'Update post' : 'Create post'}</button>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">{item.title}</h2>
                <p className="text-sm text-slate-600">{item.excerpt}</p>
                <p className="text-xs text-slate-500">{item.published ? 'Published' : 'Draft'}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded border border-slate-300 px-3 py-1 text-sm"
                  onClick={() => {
                    setEditingId(item.id);
                    setForm({
                      title: item.title,
                      excerpt: item.excerpt,
                      content: item.content,
                      coverImage: item.coverImage ?? '',
                      categoryId: item.category?.id ?? '',
                      published: item.published,
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"
                  onClick={() =>
                    blogApi
                      .adminDeletePost(item.id)
                      .then(load)
                      .catch((err: { message?: string }) => setError(err.message ?? 'Failed to delete post'))
                  }
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="rounded border border-slate-300 px-3 py-1 text-sm"
                  onClick={() =>
                    blogApi
                      .adminUpdatePost(item.id, { published: !item.published })
                      .then(load)
                      .catch((err: { message?: string }) => setError(err.message ?? 'Failed to update publish state'))
                  }
                >
                  {item.published ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
