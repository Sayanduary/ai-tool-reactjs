import mongoose from "mongoose";

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connented to Database");
  } catch (err) {
    console.log(err);
  }
}

export default connectDatabase;
