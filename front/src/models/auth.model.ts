export interface AuthUser extends LoginRequestEmail{
    name:string;
    defaultLang:string;
}

export interface LoginRequestEmail{
    email:string;
}

export interface LoginRequest extends LoginRequestEmail{
    password:string;
}

export interface LoginResponse{
    user:AuthUser,
    accessToken:string;
    refreshToken?:string;
    tokenType:string;
    defaultLanguage:string;

}


export interface User{
    user:AuthUser,
    accessToken:string;
    isAuthenticated:boolean;
}
