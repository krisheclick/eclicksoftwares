"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Parentstyles from "../style.module.css";
import Styles from "./style.module.css";

type Props = {
  categories: {
    blog_category_slug: string;
    blog_category_title: string;
  }[];
};

const Blogcategory = ({ categories }: Props) => {
  const pathname = usePathname();
  const blogLink = process.env.NEXT_PUBLIC_ENV_URL;

  return (
    <div className={`${Parentstyles.widget} ${Styles.category_widget}`}>
      <div className={Parentstyles.widget_title}>Categories</div>

      <ul className="noList">
        <li
          className={`${Styles.catLinkParent} ${
            pathname === "/blog" ? Styles.active : ""
          }`}
        >
          <Link href={`${blogLink}/blog`} className={Styles.catLink}>
            All Categories
          </Link>
        </li>

        {categories.map((cat) => (
          <li
            key={cat.blog_category_slug}
            className={`${Styles.catLinkParent} ${
              pathname === `/blog/${cat.blog_category_slug}` ? Styles.active : ""
            }`}
          >
            <Link
              href={`${blogLink}/blog/${cat.blog_category_slug}`}
              className={Styles.catLink}
            >
              {cat.blog_category_title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogcategory;
