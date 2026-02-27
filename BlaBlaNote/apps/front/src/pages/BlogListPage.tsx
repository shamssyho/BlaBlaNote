import { FormEvent, useEffect, useState } from 'react';
import { blogApi } from '../api/blog.api';
import { BlogCategory, BlogPost } from '../types/blog.types';
import { Link, useNavigate } from '../router/router';

export function BlogListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    blogApi.getCategories().then(setCategories).catch(() => undefined);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    blogApi
      .getPosts({
        page,
        pageSize,
        search: search || undefined,
        categorySlug: categorySlug || undefined,
      })
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      })
      .catch((err: { message?: string }) => {
        setError(err.message ?? 'Failed to load blog posts');
      })
      .finally(() => setIsLoading(false));
  }, [page, search, categorySlug]);

  function onSearchSubmit(event: FormEvent) {
    event.preventDefault();
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Blog</h1>
        <p className="text-slate-600">Insights, product updates, and writing workflows.</p>
      </header>

      <form onSubmit={onSearchSubmit} className="grid gap-3 md:grid-cols-[1fr_240px_auto]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search posts"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <select
          value={categorySlug}
          onChange={(event) => {
            setCategorySlug(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-white">
          Apply
        </button>
      </form>

      {isLoading ? <p>Loading...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((post) => (
          <article key={post.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">{post.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
            <div className="mt-3">
              <Link to={`/blog/${post.slug}`} className="text-sm font-semibold text-slate-900 underline">
                Read more
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!isLoading && items.length === 0 ? <p className="text-slate-600">No blog posts found.</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-sm text-slate-600">
          Page {page} of {totalPages}
        </p>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
        >
          Next
        </button>
        <button type="button" onClick={() => navigate('/blog')} className="ml-auto text-sm text-slate-500">
          Refresh route
        </button>
      </div>
    </section>
  );
}
