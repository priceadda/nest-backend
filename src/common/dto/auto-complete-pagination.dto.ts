import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class AutoCompletePagination {
    @IsOptional()
    @IsNumber({}, { message: 'Page must be a number' })
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsNumber({}, { message: 'Limit must be a number' })
    @Type(() => Number)
    limit?: number = 10;
}
