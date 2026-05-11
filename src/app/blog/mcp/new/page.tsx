import { BlogForm } from "../_components/blog-form";

export default function NewBlogPostPage() {
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
      <BlogForm />
    </div>
  );
}
