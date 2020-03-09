import { ApiProperty } from '@nestjs/swagger';
import { NotEquals, IsDefined, IsNotEmpty, IsAlphanumeric, IsEnum } from 'class-validator';
import { OS } from '@shared/enums';

export class SignByGoogleDto {
    @ApiProperty({ description: 'google access token' })
    @IsAlphanumeric()
    @NotEquals('test')
    @IsDefined()
    readonly gat: string;

    @ApiProperty({ description: 'issuer device type', enum: OS })
    @IsNotEmpty()
    @IsDefined()
    @IsEnum(OS)
    readonly dp: OS;
}
