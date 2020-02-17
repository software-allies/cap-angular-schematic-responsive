export interface Schema {
    project: string
    logo: string;
    removeAppComponentHtml: boolean;
    auth: boolean;
    installAuth: boolean;
    name?: string;
    title?: string;
    path?: string;
    module?: any;
}