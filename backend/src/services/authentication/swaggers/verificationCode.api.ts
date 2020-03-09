import { ApiProperty } from '@nestjs/swagger';
import { VerificationCodeDto } from '@services/authentication/dtos';

export class VerificationCodeApi {
    @ApiProperty({
        type: () => VerificationCodeDto,
    })
    data: VerificationCodeDto;
    @ApiProperty({
        required: false,
    })
    message?: string;
}
