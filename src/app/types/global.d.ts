declare global {
  type post_status = "draft" | "published" | "archived";

  type taxonomy_type = "category" | "tag";

  interface BaseData {
    title: string;
    content: string;
    url?: string;
    description?: string;
    status: post_status;
  }


  interface PostData extends BaseData {
    featured?: boolean;
    author_id: number;
    category: string;
    tag: string;
  }

  interface PageData extends BaseData { }

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

  type MediaData = {
    user_id: number;
    file_name: string;
    file_type: string;
    file_path: string;
    size: number;
    created_at: Date;
  };

  interface Article extends BaseData {
    id: number;
  }

  interface SignupState {
    errors?: {
      name?: string;
      email?: string;
      password?: string[];
    };
    message?: string;
  }

  export interface Category {
    id: number;
    name: string;
    type: string;
    slug: string;
  }

  export interface Tag {
    id: number
    name: string
    type: string
    slug: string
  }

  interface CategorySelectProps {
    initialValue?: string;
    onValueChange?: (value: string) => void;
  }

  interface TagSelectProps {
    initialValue?: string
    onValueChange?: (value: string) => void
  }
}

export { }
