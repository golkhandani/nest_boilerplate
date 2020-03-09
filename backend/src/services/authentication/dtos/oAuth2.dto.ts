import { ApiProperty } from '@nestjs/swagger';

export class OAuth2Dto {
    @ApiProperty()
    refreshToken: string;
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    tokenType: string;
}
