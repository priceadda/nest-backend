import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Car, CarSchema } from "./schema/car.schema";
import { CarService } from "./car.service";
import { CarController } from "./car.controller";
import { callbackify } from "util";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Car.name, schema: CarSchema },
        ])
    ],
    providers: [CarService],
    controllers: [CarController],
    exports: []
})
export class CarModule { }