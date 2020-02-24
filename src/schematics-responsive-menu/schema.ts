export interface Schema {
    title: string
    logo: string;
    removeAppComponentHtml: boolean;
    auth: boolean;
    installAuth: boolean;
    project?: string;
    name?: string;
    path?: string;
    module?: any;
}