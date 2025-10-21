import cors from 'cors';

const allowedOrigins  = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];

const corsOptions = {
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error('Cors not allowed'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

export default cors(corsOptions);