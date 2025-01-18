export const APP_PATHS = {
    auth: {
        login: "/login",
        signup: "/signup",
        forgot: "/forgot-password",
    },
    dashboard: {
        root: "/dashboard",
        articles: "/dashboard/articles",
        pages: "/dashboard/pages",
        media: "/dashboard/media",
        users: "/dashboard/users",
        taxonomy: "/dashboard/taxonomy",
    },
} as const; 