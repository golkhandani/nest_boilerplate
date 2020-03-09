import { IsAlphanumeric, NotEquals, IsDefined } from 'class-validator';

export class SingGuestUserDto {
    @IsAlphanumeric()
    @NotEquals('test')
    @IsDefined()
    readonly fingerprint: string;
}
