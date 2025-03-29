import {
    UnprocessableEntityException,
    ValidationPipe,
    ValidationPipeOptions,
} from '@nestjs/common';

class CustomValidationPipe extends ValidationPipe {
    constructor(options?: ValidationPipeOptions) {
        const updatedOptions = Object.assign({}, options, {
            exceptionFactory: (errors) => {
                const result = {};
                errors.forEach((error) => {
                    const handleNestedErrors = (error) => {
                        if (error.children && error.children.length > 0) {
                            error.children.forEach((childError) => {
                                handleNestedErrors(childError);
                            });
                        } else {
                            const propertyName = error.property;
                            if (error.constraints) {
                                const message =
                                    error.constraints[Object.keys(error.constraints)[0]];
                                if (!result[propertyName]) {
                                    result[propertyName] = [];
                                }
                                result[propertyName].push(message);
                            } else {
                                if (!result[propertyName]) {
                                    result[propertyName] = ['Validation error'];
                                }
                            }
                        }
                    };
                    // Start handling errors recursively
                    handleNestedErrors(error);
                });
                return new UnprocessableEntityException({ errors: result });
            },
        });
        super(updatedOptions);
    }
}

export { CustomValidationPipe };
