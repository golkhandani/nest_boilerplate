import { ApiProperty } from '@nestjs/swagger';
import { UserWithTokenDto } from '@services/authentication/dtos';

export class UserWithTokenApi {
    @ApiProperty({
        type: () => UserWithTokenDto,
    })
    data: UserWithTokenDto;
    @ApiProperty({
        required: false,
    })
    message?: string;
}
