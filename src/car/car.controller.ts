import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { CarService } from "./car.service";
import { Car } from "./schema/car.schema";
import { AutoComplete } from "src/common/dto/auto-complete.dto";
import { AutoCompletePagination } from "src/common/dto/auto-complete-pagination.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags('Cars')
@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) { }

    @Get()
    @ApiOperation({
        summary: 'get all cars',
        description: 'This end point use for get all cara',
    })
    async findCars(): Promise<Record<string, any>> {
        try {
            const cars = await this.carService.getAllCars();
            return {
                data: cars,
                message: 'All cars find successfully',
                errors: {}
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
            return {
                statusCode: error.status || 5000,
                data: null,
                message: error.message,
                errors: error.response,
            }
        }
    }

    @Get('/autocomplete')
    @ApiOperation({
        summary: 'AutoComplete for user',
        description: 'This end point use for autoComplete for user',
    })
    @ApiQuery({ name: 'query', required: false })
    @ApiQuery({ name: 'label', required: true })
    @ApiQuery({ name: 'value', required: true })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    async autoComplete(
        // @Req() req: IRequest<JwtUser>,
        @Query() autoComplete: AutoComplete,
        @Query() autoCompletePagination: AutoCompletePagination,
    ): Promise<Record<string, any>> {
        try {

            const data = await this.carService.autocomplete(
                autoComplete,
                autoCompletePagination,
            );

            return {
                data: data,
                message: 'Autocomplete',
                errors: {},
            };
        } catch (e) {
            return {
                statusCode: e.status | 500,
                data: null,
                message: e.message,
                errors: e.response,
            };
        }
    }

    @Get('compare')
    async compareCars(@Query('ids') ids: string) {
        try {
            const carIds = ids.split(',');
            const car = await this.carService.compareCars(carIds);
            if (!car) {
                throw new NotFoundException({
                    cars: ['Cars not found']
                })
            }
            return {
                data: car,
                message: 'car compare successfully',
                errors: {},
            }
        } catch (e) {
            return {
                statusCode: e.status | 500,
                data: null,
                message: e.message,
                errors: e.response,
            }

        }
    }
}