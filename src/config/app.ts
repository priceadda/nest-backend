import * as process from 'process';

export default () => {
    return {
        isProduction: process.env.NODE_ENV === 'production',
        port: process.env.PORT || 3000,
        api: {
            prefix: process.env.API_PREFIX || null,
        },
        database: {
            default: {
                dsn: process.env.DEFAULT_MONGO_DSN || 'mongodb://localhost/nest',
            },
        },
    };
};
