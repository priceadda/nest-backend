import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Car } from "./schema/car.schema";
import { Model, PipelineStage } from "mongoose";
import { AutoCompletePagination } from "src/common/dto/auto-complete-pagination.dto";
import { AutoComplete } from "src/common/dto/auto-complete.dto";
import axios from "axios";
import { PaginationDto } from "src/common/pagination/offset-pagination.dto";

@Injectable()
export class CarService {
    constructor(@InjectModel(Car.name) private readonly carModel: Model<Car>) { }

    async getAllCars(paginationDto: PaginationDto,) {
        let pipeline: PipelineStage[] = [
            {
                $project: {
                    No: 0
                }
            }
        ]
        pipeline = this.addOffsetPagination(pipeline, paginationDto);
        const cars = await this.carModel.aggregate(pipeline).exec();
        const total: number = await this.countCars(pipeline);
        const total_pages = Math.ceil(total / paginationDto.limit!);
        return {
            cars,
            meta: {
                total_records: Number(total ? total : 0),
                page_total_records: cars.length,
                current_page: Number(paginationDto.page ? paginationDto.page : 1),
                total_pages: Number(total_pages ? total_pages : 1),
                has_previous: paginationDto.page! > 1,
                has_next: paginationDto.page! < total_pages,
                last_page: Number(total_pages ? total_pages : 1),
                first_page: 1,
            },
        };
    }

    addOffsetPagination(pipeline, paginationDto: PaginationDto) {
        const { page, limit, } = paginationDto;
        const skip = (page! - 1) * limit!;
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });
        return pipeline;
    }

    async countCars(aggregationPipeline): Promise<number> {
        aggregationPipeline.pop();
        aggregationPipeline.pop();
        aggregationPipeline.pop();
        aggregationPipeline.push({ $count: 'totalCount' });
        let count = await this.carModel.aggregate(aggregationPipeline).exec();
        count = count[0]?.totalCount;
        return Number(count);
    }


    async getCarById(id: string) {
        return await this.carModel.findOne({ _id: id })
    }

    async autocomplete(autoComplete: AutoComplete,
        autoCompletePagination: AutoCompletePagination) {
        const { label, value, query } = autoComplete;
        let pipeline: PipelineStage[] = [
            {
                $project: {
                    No: 0,
                },
            },
        ];
        if (query) {
            pipeline.push({
                $match: {
                    [`${label}`]: { $regex: new RegExp(`.*${query}.*`, 'i') },
                },
            });
        }
        pipeline.push({
            $project: {
                [`${label}`]: 1,
                [`${value}`]: 1,
            },
        });
        pipeline = this.addOffsetPagination(pipeline, {
            page: autoCompletePagination.page,
            limit: autoCompletePagination.limit,
            // sort: [{ field: label, direction: 1 }],
        });
        let cars = await this.carModel.aggregate(pipeline).exec();
        const total = await this.countCars(pipeline);
        const total_pages = Math.ceil(total / autoCompletePagination.limit!);
        return {
            cars,
            meta: {
                total_records: Number(total ? total : 0),
                page_total_records: cars.length,
                current_page: Number(
                    autoCompletePagination.page ? autoCompletePagination.page : 1,
                ),
                total_pages: Number(total_pages ? total_pages : 1),
                has_previous: autoCompletePagination.page! > 1,
                has_next: autoCompletePagination.page! < total_pages,
                last_page: Number(total_pages ? total_pages : 1),
                first_page: 1,
            },
        };
    }

    async compareCars(carIds: string[], showDifferences: boolean): Promise<any> {
        const cars = await this.carModel.find({ _id: { $in: carIds } });

        if (cars.length < 2) {
            throw new NotFoundException({ car: ['At least two cars required'] });
        }

        // Extract attributes for comparison
        const carAttributes = cars.map(car => ({
            _id: car._id,
            Brand: car.Brand,
            Model: car.Model,
            Variant: car.Variant,
            EngineType: car.EngineType,
            MaxPower: car.MaxPower,
            MaxTorque: car.MaxTorque,
            ValvesPerCylinder: car.ValvesPerCylinder,
            TransmissionType: car.TransmissionType,
            Gearbox: car.Gearbox,
            DriveType: car.DriveType,
            FuelType: car.FuelType,
            PetrolMileageARAI: car.PetrolMileageARAI,
            EmissionNormCompliance: car.EmissionNormCompliance,
            FrontSuspension: car.FrontSuspension,
            RearSuspension: car.RearSuspension,
            SteeringType: car.SteeringType,
            TurningRadius: car.TurningRadius,
            FrontBrakeType: car.FrontBrakeType,
            RearBrakeType: car.RearBrakeType,
            Displacement: car.Displacement,
            Length: car.Length,
            Width: car.Width,
        }));

        // If showDifferences is false, return all details
        if (!showDifferences) {
            return { comparedCars: carAttributes };
        }

        // Identify differing attributes
        const keys = Object.keys(carAttributes[0]);
        const differingKeys = new Set();

        keys.forEach(key => {
            const uniqueValues = new Set(carAttributes.map(car => car[key]));
            if (uniqueValues.size > 1) {
                differingKeys.add(key);
            }
        });

        // Filter cars to include only differing attributes while keeping the structure
        const filteredCars = carAttributes.map(car => {
            return Object.fromEntries(
                Object.entries(car).filter(([key]) => differingKeys.has(key))
            );
        });

        return { comparedCars: filteredCars };
    }


    // async compareCars(carIds: string[], showDifferences: boolean): Promise<any> {
    //     const cars = await this.carModel.find({ _id: { $in: carIds } });

    //     if (cars.length < 2) {
    //         throw new NotFoundException({ car: ['At least two cars required'] });
    //     }
    //     return {
    //         comparedCars: cars.map(car => ({
    //             Brand: car.Brand,
    //             Model: car.Model,
    //             Variant: car.Variant,
    //             Gearbox: car.Gearbox,
    //             Displacement: car.Displacement,
    //             Length: car.Length,
    //             Width: car.Width,
    //         })),
    //     };
    // }

    // async fetchData() {
    //     try {
    //         let options = {
    //             method: 'GET',
    //             url: 'https://car-data.p.rapidapi.com/cars',
    //             params: {
    //                 limit: '10',
    //                 page: '0'
    //             },
    //             headers: {
    //                 'x-rapidapi-host': 'car-data.p.rapidapi.com',
    //                 'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY'
    //             }
    //         };
    //         const response = await axios.request(options);
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
}