type Props = {
  slug: string[];
}

const BlogDetails = ({ slug }: Props) => {
  const blogSlug = slug[1];

  return (
    <div>
      <h1 className="heading text-center">{blogSlug}</h1>
    </div>
  );
};

export default BlogDetails;
