import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    collection: 'core_cars',
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Car {
    @Prop({ required: true })
    Brand: string;

    @Prop({ required: true })
    Model: string;

    @Prop({ required: true })
    Variant: string;

    @Prop()
    EngineType: string;

    @Prop()
    Displacement: string;

    @Prop()
    MaxPower: string;

    @Prop()
    MaxTorque: string;

    @Prop({ type: Object })
    No: {
        Cylinders: number;
        Doors: number;
        Airbags: number;
    };

    @Prop()
    ValvesPerCylinder: number;

    @Prop()
    TransmissionType: string;

    @Prop()
    Gearbox: string;

    @Prop()
    DriveType: string;

    @Prop()
    FuelType: string;

    @Prop()
    PetrolMileageARAI: string;

    @Prop()
    PetrolFuelTankCapacity: string;

    @Prop()
    EmissionNormCompliance: string;

    @Prop()
    FrontSuspension: string;

    @Prop()
    RearSuspension: string;

    @Prop()
    SteeringType: string;

    @Prop()
    SteeringColumn: string;

    @Prop()
    TurningRadius: string;

    @Prop()
    FrontBrakeType: string;

    @Prop()
    RearBrakeType: string;

    @Prop()
    Length: string;

    @Prop()
    Width: string;

    @Prop()
    Height: string;

    @Prop()
    BootSpace: string;

    @Prop()
    SeatingCapacity: number;

    @Prop()
    GroundClearanceUnladen: string;

    @Prop()
    WheelBase: string;

    @Prop()
    KerbWeight: string;

    @Prop()
    GrossWeight: string;

    @Prop()
    PowerSteering: string;

    @Prop()
    AirConditioner: string;

    @Prop()
    Heater: string;

    @Prop()
    AdjustableSteering: string;

    @Prop()
    HeightAdjustableDriverSeat: string;

    @Prop()
    AutomaticClimateControl: string;

    @Prop()
    ParkingSensors: string;

    @Prop()
    KeyLessEntry: string;

    @Prop()
    EngineStartStopButton: string;

    @Prop()
    CruiseControl: string;

    @Prop()
    AntiLockBrakingSystemABS: string;

    @Prop()
    CentralLocking: string;

    @Prop()
    DriverAirbag: string;

    @Prop()
    PassengerAirbag: string;

    @Prop()
    SideAirbag: string;

    @Prop()
    RearCamera: string;

    @Prop()
    SpeedAlert: string;

    @Prop()
    SpeedSensingAutoDoorLock: string;

    @Prop()
    ISOFIXChildSeatMounts: string;

    @Prop()
    HillAssist: string;

    @Prop()
    GlobalNCAPSafetyRating: string;

    @Prop()
    GlobalNCAPChildSafetyRating: string;

    @Prop()
    WirelessPhoneCharging: string;
}
export type CarDocument = Car & Document;
export const CarSchema = SchemaFactory.createForClass(Car);