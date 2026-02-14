import mongoose from "mongoose";

const checkConnectionDB = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/SarhaAPP1", {serverSelectionTimeoutMS: 5000,})
    .then(()=>{
        console.log(`DB Connected Successfully...✅`);  
    })
    .catch((error)=>{
        console.log(error,` DB Failed TO connect..❌`);
        
    })



};

export default checkConnectionDB
