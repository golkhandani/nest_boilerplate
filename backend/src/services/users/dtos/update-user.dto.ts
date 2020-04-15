import { IsAlpha, NotEquals, Validate, IsOptional, ValidateNested } from 'class-validator';

import { UserAlreadyExist } from '@services/authentication/validators';
import { BankAccountDto } from '.';

export class UpdateUserDto {
    @IsAlpha()
    @NotEquals('test')
    @Validate(UserAlreadyExist, {
        message: 'username exists',
    })
    @IsOptional()
    readonly username: string;
    @NotEquals('test')
    @IsOptional()
    readonly name: string;

    @IsOptional()
    public address: string;

    @ValidateNested()
    @IsOptional()
    public bank_account: BankAccountDto;

}
