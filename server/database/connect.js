import mongoose from 'mongoose';

export const connect = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log('MangoDB Connected')
    } catch (err) {
        console.log(process.env.MONGO_URI, err)
        process.exit(1)
    }
}