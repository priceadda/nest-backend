import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Car } from "./schema/car.schema";
import { Model, PipelineStage } from "mongoose";
import { AutoCompletePagination } from "src/common/dto/auto-complete-pagination.dto";
import { AutoComplete } from "src/common/dto/auto-complete.dto";
import axios from "axios";

@Injectable()
export class CarService {
    constructor(@InjectModel(Car.name) private readonly carModel: Model<Car>) { }

    async getAllCars(): Promise<Car[]> {
        return await this.carModel.find().exec();
    }

    async autocomplete(autoComplete: AutoComplete,
        autoCompletePagination: AutoCompletePagination,) {
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
        let users = await this.carModel.aggregate(pipeline).exec();
        return users;
    }

    async compareCars(carIds: string[]): Promise<any> {
        const cars = await this.carModel.find({ _id: { $in: carIds } });

        if (cars.length < 2) {
            throw new NotFoundException({ car: ['At least two cars required'] });
        }
        return {
            comparedCars: cars.map(car => ({
                Brand: car.Brand,
                Model: car.Model,
                Variant: car.Variant,
                Gearbox: car.Gearbox,
                Displacement: car.Displacement,
                Length: car.Length,
                Width: car.Width,
            })),
        };
    }

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