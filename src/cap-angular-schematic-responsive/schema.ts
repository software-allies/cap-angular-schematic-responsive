export interface Schema {
    logo: string;
    removeAppComponentHtml: boolean;
    auth: boolean;
    installAuth: boolean;
    sfcore: boolean;
    authService: string;
    project?: string;
    name?: string;
    path?: string;
    module?: any;
}