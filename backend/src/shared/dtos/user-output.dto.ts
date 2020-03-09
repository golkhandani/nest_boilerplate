export class UserOutputDto {
    user_id: string;
    username: string;
    verified: boolean;
    name: string;
    picture: {
        prefix: string,
        suffix: string,
    };
    address: string;
}