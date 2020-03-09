import { IsPhoneNumber, NotEquals, Validate, IsDefined, IsNotEmpty } from 'class-validator';

import { UserAlreadyExist } from '../validators';
import { ApiProperty } from '@nestjs/swagger';

export class SignByPhoneCodeDto {
    @ApiProperty({ description: 'must be real phone number', example: '989121234567' })
    @IsPhoneNumber('IR')
    @NotEquals('test')
    @Validate(UserAlreadyExist, {
        message: 'user exists',
    })
    @IsDefined()
    readonly phone: string;

    @ApiProperty({ description: 'verification code', example: '1234' })
    @IsNotEmpty()
    @IsDefined()
    readonly code: string;
}
