import { IsPhoneNumber, NotEquals, Validate, IsDefined, Matches } from 'class-validator';
import { UserAlreadyExist } from '@services/authentication/validators';
import { ApiProperty } from '@nestjs/swagger';

export class SignByPhoneNumberDto {
    @ApiProperty({ description: 'must be real phone number', example: '989121234567' })
    @IsPhoneNumber('IR')
    @NotEquals('test')
    @Validate(UserAlreadyExist, {
        message: 'user exists',
    })
    @Matches(/^[0-9]{10,13}$/)
    @IsDefined()
    readonly phone: string;
}
