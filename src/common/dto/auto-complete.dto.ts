import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AutoComplete {
    @IsString({ message: 'Label must be a string' })
    @IsNotEmpty({ message: 'Label is required' })
    label: string;

    @IsString({ message: 'Value must be a string' })
    @IsNotEmpty({ message: 'Value is required' })
    value: string;

    @IsOptional()
    @IsString({ message: 'Query must be a string' })
    query?: string;
}
