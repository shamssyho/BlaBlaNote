import { useEffect, useState } from 'react';
import { blogApi } from '../api/blog.api';
import { BlogPost } from '../types/blog.types';
import { Link } from '../router/router';

interface BlogDetailPageProps {
  slug: string;
}

export function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    blogApi
      .getPostBySlug(slug)
      .then(setPost)
      .catch((err: { message?: string }) => setError(err.message ?? 'Failed to load post'))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <Link to="/blog" className="text-sm text-slate-600 underline">
        Back to blog
      </Link>
      <h1 className="text-3xl font-bold text-slate-900">{post.title}</h1>
      <p className="text-sm text-slate-500">{new Date(post.createdAt).toLocaleString()}</p>
      {post.coverImage ? <img src={post.coverImage} alt={post.title} className="w-full rounded-xl" /> : null}
      <p className="text-base text-slate-700 whitespace-pre-wrap">{post.content}</p>
    </article>
  );
}
