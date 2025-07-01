declare global {
  type post_status = "draft" | "published" | "archived";

  type taxonomy_type = "category" | "tag";

  type PostData = {
    title: string;
    content: string;
    status?: "draft" | "published" | "archived";
    url?: string;              // URL personalizzato, se non fornito viene generato da slugify
    description?: string;      // Descrizione del post, se non fornita viene gener
    featured?: boolean;
    author_id: number;
    category?: number[];         // ID categoria (taxonomy_type = category)
    tag?: number[];            // array di ID tag (taxonomy_type = tag)
  };

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
