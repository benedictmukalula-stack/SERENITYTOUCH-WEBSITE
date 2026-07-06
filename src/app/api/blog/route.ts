import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');
    const category = request.nextUrl.searchParams.get('category');

    // Single post by slug
    if (slug) {
      const post = await db.blogPost.findUnique({
        where: { slug, published: true },
      });

      if (!post) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404, headers: CORS_HEADERS }
        );
      }

      return NextResponse.json(
        {
          success: true,
          post: {
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            image: post.image,
            author: post.author,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    // Posts filtered by category
    if (category) {
      const posts = await db.blogPost.findMany({
        where: { published: true, category },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
          image: true,
          author: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          posts: posts.map((p) => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          })),
        },
        { headers: CORS_HEADERS }
      );
    }

    // All published posts
    const posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        image: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        posts: posts.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        })),
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Blog GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}