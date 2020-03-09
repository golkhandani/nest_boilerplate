import { ApiProperty } from '@nestjs/swagger';
import { CodeType } from '../helpers/phoneAuth.helper';

export class VerificationCodeDto {
    @ApiProperty({ type: Number })
    codeLength: number;
    @ApiProperty({ description: 'date string', type: String })
    expires: Date;
    @ApiProperty({ description: 'code type', default: CodeType.NUMBER, enum: CodeType })
    codeType: CodeType;

    @ApiProperty()
    cooldownDuration: number;

    @ApiProperty()
    cooldownProgress: number;

}
