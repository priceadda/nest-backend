import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { isArray as _isArray } from 'lodash';

export class SortObject {
    @ApiProperty({ type: String, example: 'createdAt' })
    @IsNotEmpty()
    @IsString()
    field: string;

    @ApiProperty({ type: Number, example: 1 })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    direction: number;
}

export class PaginationDto {
    @ApiPropertyOptional({ type: () => Number })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({ type: () => Number })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number = 10;

    // @IsOptional()
    // @Transform((options) => {
    //     let data = [];
    //     if (typeof options.value === 'string') {
    //         data = JSON.parse(options.value);
    //     } else {
    //         data = options.value;
    //     }
    //     const trandformed = [];
    //     if (_isArray(data)) {
    //         data.forEach((element) => {
    //             const a = new SortObject();
    //             a.direction = element.direction;
    //             a.field = element.field;
    //             trandformed.push(a);
    //         });
    //     }
    //     return trandformed;
    // })
    // @IsArray()
    // @Type(() => SortObject)
    // @ValidateNested({ each: true })
    // sort?: SortObject[] = [{ field: 'createdAt', direction: -1 }];
}
