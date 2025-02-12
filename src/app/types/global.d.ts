declare global {
  type post_status = "draft" | "published" | "archived";

  type PostData = {
    title: string;
    content: string;
    url?: string | null;
    description?: string | null;
    status?: post_status | null | undefined;
    featured?: boolean | null;
    author_id: string | null | undefined;
  };

  type PageData = {
    title: string;
    content: string;
    url: string;
    status: post_status | null | undefined;
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
