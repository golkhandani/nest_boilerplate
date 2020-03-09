import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, NotEquals, IsDefined, IsNotEmpty, Length, ValidationArguments } from 'class-validator';
export class SigninByUsernameDto {
    @ApiProperty({ description: 'must be alpha char', example: 'golkhanadni' })
    @IsAlpha()
    @NotEquals('test')
    @IsDefined()
    readonly username: string;

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
