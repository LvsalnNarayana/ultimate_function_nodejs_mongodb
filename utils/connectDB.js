/* eslint-disable no-console */
// connectDB.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process?.env?.MONGODB_URI);

    // Logging more details about the database connection
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.db.databaseName}`);
    console.log(`Connection Port: ${conn.connection.port}`);
    console.log(`Connection URL: ${conn.connection.client.s.url}`); // Note: s.url might not always be available depending on the driver version
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
