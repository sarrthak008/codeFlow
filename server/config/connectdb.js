import mongoose from "mongoose";

const connectdb = async () => {
    try {
         let connection = await mongoose.connect(`${process.env.MONGO_URL}`)
         if(connection){
           console.log(`database connected successfully ♨`)
         }else{
            throw new error("connection error")
         }
    } catch (error) {
        console.log(`error ${error.message}`)
        process.exit(0)
    }
}

export default connectdb