require('dotenv').config();
require('express-async-errors');

const express = require('express');
const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const productsRouter = require('./routes/products');

const app = express();


// middleware
app.use(express.json())
 

// routes
app.use('/api/v1/products', productsRouter)

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1> <a href="/api/v1/products">Products routes</a>');
});

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Store API app is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start();