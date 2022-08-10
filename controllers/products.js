const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    // throw new Error('testing async errors')
    const products = await Product.find({
        // name: 'albany sectional',
        // featured: true
    })
    res.status(200).json({ nbHits: products.length, products });
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters }  = req.query;
    // filter
    const queryObject = {}

    if(featured) {
        queryObject.featured = featured === 'true' ? true : false
    }

    if(company) {
        queryObject.company = company
    }

    if(name) {
        queryObject.name = { $regex: name, $options: 'i'}
    }

    // numericFilters
    if(numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };

        // replace any of the sign to match the opposite
        const regEx = /\b(<|>|>=|=|<|<=)\b/g; //all signs <,<=, =, >, etc
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )

        // only key whose value is a number
        const options = ['price', 'rating'];

        filters = filters.split(',').forEach(item => {
            // field, operator and value = e.g: rating, >, 4
            const [field, operator, value] = item.split('-');
            if(options.includes(field)) {
                // below line is like saying queryObject.rating = { $gt: 4 }
                queryObject[field] = { [operator]: Number(value) }
            }
        });
    }

    console.log(queryObject)
    let result = Product.find(queryObject)

    // sort - ascending, descending, highest, lowest - name, price, company -- add minus before to show in descending order
    if(sort) {
        // console.log(sort)
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        // default
        result = result.sort('createdAt')
    }

    // fields - fields to show from object eg: name, company etc
    if(fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }

    // pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit);
    // example 
    // 23 pages
    // limit = 7 means we have 4 pages
    // 7 7 7 2

    // 
    const products = await result

    res.status(200).json({
        nbHits: products.length, 
        products 
    });
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}