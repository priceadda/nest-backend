import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { CarService } from "./car.service";
import { Car } from "./schema/car.schema";
import { AutoComplete } from "src/common/dto/auto-complete.dto";
import { AutoCompletePagination } from "src/common/dto/auto-complete-pagination.dto";

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) { }

    @Get()
    async findCars(): Promise<Car[]> {
        return this.carService.getAllCars();
    }

    @Get('/autocomplete')
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