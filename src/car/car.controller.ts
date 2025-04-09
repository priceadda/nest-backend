import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { CarService } from "./car.service";
import { Car } from "./schema/car.schema";
import { AutoComplete } from "src/common/dto/auto-complete.dto";
import { AutoCompletePagination } from "src/common/dto/auto-complete-pagination.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/common/pagination/offset-pagination.dto";

@ApiTags('Cars')
@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) { }

    @Get()
    @ApiOperation({
        summary: 'get all cars',
        description: 'This end point use for get all cara',
    })
    async findCars(@Query() paginationDto: PaginationDto,): Promise<Record<string, any>> {
        try {
            const cars = await this.carService.getAllCars(paginationDto);
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

    @Get('/:id')
    @ApiOperation({
        summary: 'get car by its id cars',
        description: 'This end point use for get car by id cara',
    })
    async findById(@Query('id') id: string) {
        try {
            const cars = await this.carService.getCarById(id);
            if (!cars) {
                throw new NotFoundException({
                    id: ["Car not found"]
                })
            }
            return {
                data: cars,
                message: 'Get car by id successfully',
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
    async compareCars(@Query('ids') ids: string, @Query('showDifferences') showDifferences: boolean) {
        try {
            const carIds = ids.split(',');
            const car = await this.carService.compareCars(carIds, showDifferences);
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