import { User } from '@shared/models/users.model';
import { ApiProperty } from '@nestjs/swagger';
import { OAuth2Dto } from '.';
export class UserWithTokenDto {
    @ApiProperty({
        type: () => User,
    })
    user: User;
    @ApiProperty({
        type: () => OAuth2Dto,
    })
    oAuth2: OAuth2Dto;
}
