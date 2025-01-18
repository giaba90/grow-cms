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

  type Article = {
    id: string;
    title: string;
    content: string;
  };

  interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
    path: string;
    expires?: Date;
    domain?: string;
  }

  interface Cookie {
    name: string;
    options: CookieOptions;
    duration: number;
  }

  interface LoginFormData {
    email: string;
    password: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: "ADMIN" | "USER";
  }

  interface Session {
    userId: string;
    expiresAt: Date;
  }
}

export {};
