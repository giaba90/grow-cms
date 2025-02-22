declare global {
  type post_status = "draft" | "published" | "archived";

  type taxonomy_type = "category" | "tag";

  type PostData = {
    title: string;
    content: string;
    url?: string | "";
    description?: string | "";
    status?: post_status | null | undefined;
    featured?: boolean | null;
    author_id: string | null | undefined;
  };

  type PageData = {
    title: string;
    content: string;
    url?: string | "";
    description?: string | "";
    status: post_status | null | undefined;
  };

  type TaxonomyData = {
    name: string;
    slug: string;
    type: taxonomy_type;
    description: string;
  };

  type UserData = {
    name: string;
    surname: string;
    email: string;
    password: string;
    // Optional properties
    role?: string | null | undefined;
    lastlogin?: Date;
  };

  type Article = {
    id: string;
    title: string;
    content: string;
  };

  interface SignupState {
    errors?: {
      name?: string;
      email?: string;
      password?: string[];
    };
    message?: string;
  }
}

export {};
