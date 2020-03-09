export const mongoConstants = {
    uri: process.env.MONGO_CONSTANTS_URI,
    options: {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
};
