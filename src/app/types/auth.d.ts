declare global {
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

export { }; 