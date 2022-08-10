const connectDB = require('./db/connect');
const Product = require('./models/product');

const jsonProducts = require('./products.json')
require('dotenv').config();

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        
        // remove all products that are there before ---optional
        await Product.deleteMany();

        // create products
        await Product.create(jsonProducts);

        console.log('Products added to database successfully');

        // terminate to stop running after creating successfully
        process.exit(0)
    } catch (error) {
        console.log(error)
        
        process.exit(1)
    }
}

start();