declare global {
  type post_status = "draft" | "published" | "archived";

  type taxonomy_type = "category" | "tag";

  interface UserData {
    id: string;
    name: string;
    email: string;
  };

  interface ArticleData {
    id?: number;
    title: string;
    content: string;
    url?: string;
    description?: string;
    status: post_status;
    featured?: boolean;
    created_at?: string;
    author_id?: string;
    category?: number[]; // ID categoria (taxonomy_type = category)
    tag?: number[]; // array di ID tag (taxonomy_type = tag)
    taxonomies?: Array<{
      taxonomy: {
        id: number;
        title: string;
        type: taxonomy_type;
        description?: string;
      };
    }>;
  }

  interface PageData {
    id?: number;
    title: string;
    content: string;
    url: string;
    status: post_status;
    description?: string;
  }

  interface TaxonomyData {
    id: number;
    title: string;
    type: taxonomy_type;
    description?: string;
  }

  interface User extends UserData {
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }


}

export { }
