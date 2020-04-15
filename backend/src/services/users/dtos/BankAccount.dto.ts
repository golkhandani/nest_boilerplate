import { IsOptional } from 'class-validator';
export class BankAccountDto {
    @IsOptional()
    name: string;
    @IsOptional()
    number: string;
}
