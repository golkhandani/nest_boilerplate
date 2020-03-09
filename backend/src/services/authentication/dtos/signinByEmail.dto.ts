import { ApiProperty } from '@nestjs/swagger';
import { NotEquals, IsDefined, IsNotEmpty, Length, ValidationArguments, IsEmail } from 'class-validator';
export class SigninByEmailDto {
    @ApiProperty({ description: 'must be real email address', example: 'boilerplate@gmail.com' })
    @IsEmail()
    @NotEquals('test')
    @IsDefined()
    readonly email: string;

    @ApiProperty({
        description: 'user password => must be bigger than 10 char',
        example: '123412341234',
    })
    @IsNotEmpty()
    @Length(10, 20, {
        message: (args: ValidationArguments) => {
            if (args.value) {
                if (args.value.length === 1) {
                    return 'too short password';
                } else {
                    return `must be more than ${args.constraints[0]} char`;
                }
            }

        },
    })
    @IsDefined()
    public password: string;
}
