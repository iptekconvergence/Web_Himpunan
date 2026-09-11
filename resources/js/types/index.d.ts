export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface FooterLinkGroup {
    id: number;
    key: string;
    label: string;
    description?: string;
    order: number;
    links_count?: number;
    links?: FooterLink[];
    created_at?: string;
    updated_at?: string;
}

export interface FooterLink {
    id: number;
    footer_link_group_id: number;
    label: string;
    url: string;
    order: number;
    is_active: boolean;
    group?: FooterLinkGroup;
    created_at?: string;
    updated_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        message?: string;
        success?: string;
        error?: string;
    };
    global_divisions?: Array<{ name: string; slug: string }>;
    global_settings?: Record<string, string>;
    global_footer_links?: FooterLinkGroup[];
};
