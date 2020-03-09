import { ApiProperty } from '@nestjs/swagger';

export class IApi<T> {
    @ApiProperty({
        type: () => String,
    })
    data: T;
    @ApiProperty()
    message?: string;
}
