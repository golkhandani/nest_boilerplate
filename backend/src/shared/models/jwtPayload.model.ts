import { User } from '@shared/models';
export interface JwtPayload extends User {
    sub: string;
    scopes: string[];
    iat?: number;
    exp?: number;
    jti?: string;
    iss?: string;
    aud?: string;
}

