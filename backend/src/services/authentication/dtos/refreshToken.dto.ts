import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({ description: 'refresh token', example: '12341234123412341234' })
    @IsNotEmpty()
    @IsDefined()
    readonly refreshToken: string;
}
