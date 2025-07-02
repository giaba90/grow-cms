declare global {
  type post_status = "draft" | "published" | "archived";

  type taxonomy_type = "category" | "tag";

  type PostData = {
    id?: number;
    title: string;
    content: string;
    status: post_status; // default: "draft"
    url?: string;              // URL personalizzato, se non fornito viene generato da slugify
    description?: string;      // Descrizione del post, se non fornita viene gener
    featured?: boolean;
    created_at: string;         // Data di creazione, se non fornita viene impostata automaticamente
    author_id: number;
    category?: number[];         // ID categoria (taxonomy_type = category)
    tag?: number[];            // array di ID tag (taxonomy_type = tag)
  };
  type PageData = { id: number; title: string; url: string; status: string };
  type TaxonomyData = { id: number; name: string; slug: string; type: string };

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
    id: number;
    name: string;
    surname: string;
    email: string;
    role: string;
  };

  interface User extends UserData {
    password: string;
    lastlogin?: Date;
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
