declare global {
  type post_status = "draft" | "published" | "archived";

  type taxonomy_type = "category" | "tag";

  type PostData = {
    title: string;
    content: string;
    status?: post_status; // default: "draft"
    url?: string;              // URL personalizzato, se non fornito viene generato da slugify
    description?: string;      // Descrizione del post, se non fornita viene gener
    featured?: boolean;
    author_id: number;
    category?: number[];         // ID categoria (taxonomy_type = category)
    tag?: number[];            // array di ID tag (taxonomy_type = tag)
  };

  interface ArticleFormData {
    title: string;
    content: string;
    status: "draft" | "published" | "archived";
    featured: boolean;
    url?: string;
    description?: string;
  }

  interface FormDataToSubmit extends ArticleFormData {
    author_id: number;
    category?: number[];
    tags?: number[];
    image?: string;
  }

  interface ArticleFormProps {
    userId: string;
    initialValues?: Partial<ArticleFormData>;
    onSubmit: (values: FormDataToSubmit) => Promise<void>;
    submitLabel?: string;
    defaultSelectedCategories?: number[];
    defaultSelectedTags?: number[];
  }

  interface UserData {
    id?: string;
    name: string;
    email: string;
  };

  interface ArticleData {
    id: number;
    title: string;
    content: string;
    status: post_status;
    url?: string;
    description?: string;
    featured: boolean;
    author_id: number;
    category?: number[]; // ID categoria (taxonomy_type = category)
    tag?: number[]; // array di ID tag (taxonomy_type = tag)
    created_at: string;
  }

  interface PageData {
    id: number;
    title: string;
    content: string;
    url: string;
    status: post_status;
    description?: string;
  }

  interface TaxonomyData {
    id: number;
    name: string;
    slug: string;
    type: taxonomy_type;
    description?: string;
  }

  interface User extends UserData {
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  type MediaData = {
    user_id: number;
    file_name: string;
    file_type: string;
    file_path: string;
    size: number;
    created_at: Date;
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

export { }
