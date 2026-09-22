// server.js

// NEW: 1. Load environment variables from .env file
// We call the config() method on the dotenv package to parse our .env file
// and attach the variables to the process.env object.
// This should be done at the very beginning of the application entry point.
require('dotenv').config();


// 1. Import the Express library
// 'require' is a built-in Node.js function to load and cache JavaScript modules.
// When we 'require('express')', we are loading the Express framework code from our node_modules folder.
const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const cors = require('cors'); // Assuming you'll add/have cors


// NEW: Import your route files
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');

// 2. Create an instance of an Express application
// We execute the imported express module as a function to create our app object.
// This 'app' object has methods for routing HTTP requests, configuring middleware, and starting the server.
const app = express();

// 3. Define the port the server will listen on
// A port is like a numbered door on your computer that programs can use to communicate over a network.
// We've chosen 5000, a common port for local backend development, to avoid conflicts with other services
// (like the React development server, which often uses port 3000).


// --- MIDDLEWARE ---
// This is the crucial line. express.json() is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads and is based on body-parser.
// When a request comes in with a 'Content-Type: application/json' header, this middleware
// will parse the JSON data and make it available on the `req.body` property.
app.use(cors());

app.use(express.json());


// MODIFIED: 4. Define the port the server will listen on
// We now read the port from the process.env object, which was populated by dotenv.
// It's a best practice to provide a fallback (or default) value using the OR (||) operator.
// If PORT is not defined in our .env file for any reason, the server will default to port 5000.
// This makes the application more robust.
const PORT = process.env.PORT || 5000

// 4. Start the server and make it listen for connections
// The app.listen() function starts a UNIX socket and listens for connections on the specified path.
// It takes two main arguments:
// - The port number (our PORT constant).
// - A callback function that is executed once the server has successfully started.
// This callback is the perfect place to log a message to the console to confirm that our server is up and running.
// app.listen(PORT, () => {
//   console.log(`Server is alive and running on port ${PORT}`);
// });


// NEW: Mount the routes
// This tells Express that for any request that starts with '/api/posts',
// it should be handled by the 'postRoutes' router.
app.use('/api/posts', postRoutes);

app.use('/api/auth', authRoutes);



const startServer = async () => {
  try {
    // Await the connection to MongoDB
    // Mongoose.connect returns a promise, so we use await to wait for it to resolve.
    await mongoose.connect(process.env.MONGODB_URI);
    
    // This line will only execute if the connection is successful
    console.log('Successfully connected to MongoDB!');

    // Start the server only AFTER the database connection is successful
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    // This block will execute if the connection fails
    console.error('Failed to connect to MongoDB', error);
    // Exit the Node.js process with a failure code (1)
    // This is important for deployment environments to know the app failed to start.
    process.exit(1);
  }
};

// NEW: 6. Call the function to start the server
startServer();


// const mongoose = require('mongoose');: We import the mongoose library that we installed earlier, making its methods available to us.
// const startServer = async () => { ... }: We've defined an async function. The async keyword is what allows us to use await inside it. This function now contains all our application's startup logic.
// try...catch Block: This is a fundamental error-handling pattern. Network operations like a database connection can fail for many reasons (wrong password, server down, firewall issues).
// The code inside the try block is the "happy path"—what we want to happen. If any line of code inside try throws an error (like mongoose.connect() failing), the execution immediately jumps to the catch block.
// The catch (error) block handles the failure. We log a descriptive error message to the console and, crucially, call process.exit(1). This command terminates the entire Node.js application. It's better for the application to stop completely than to run in a broken state where it can't access its data.
// await mongoose.connect(...): This is the core of the operation. We tell Mongoose to connect using the MONGODB_URI from our process.env object. The await keyword pauses the execution of the startServer function until the mongoose.connect() promise is either fulfilled (connection succeeded) or rejected (connection failed).
// app.listen(...): Notice this is now inside the try block. This ensures we only start listening for HTTP requests after we have a confirmed, successful connection to our database.
// startServer();: Finally, we call our new function to kick off the entire process.
// Run your server now with npm run dev. If your .env file is configured correctly, your console should proudly display:

// Successfully connected to MongoDB! Server is running on port 5000



