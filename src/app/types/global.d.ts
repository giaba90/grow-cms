declare global {
  type post_status = "draft" | "published" | "archived";

  type taxonomy_type = "category" | "tag";


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
