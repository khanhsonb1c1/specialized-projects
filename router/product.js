
const express =  require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {productMiddleware} = require('../middleware/product');
const asyncBusboy = require('async-busboy');

router.post('/add-category', bodyParser(), async (req, res) => {
    const {fields, files} = await asyncBusboy(req)
    const results = await productMiddleware.addCategory(fields, files)
    res.json(results)
})

router.post('/add-product', bodyParser(), async (req, res) => {
    const {fields, files} = await asyncBusboy(req)
    const results = await productMiddleware.addProduct(fields, files)
    res.json(results)
})

router.delete('/delete-product/:productId', async (req, res) => {
    const {productId} = req.params
    const results = await productMiddleware.deleteProduct(productId)
    res.json(results)
})

router.delete('/delete-category/:categoryId', async (req, res) => {
    const {categoryId} = req.params
    const results = await productMiddleware.deleteCategory(categoryId)
    res.json(results)
})

router.put('/update-category', async (req, res) => {
    const {category_name, category_image, category_id} = req.body
    const results = await productMiddleware.updateCategory(category_name, category_image, category_id)
    res.json(results)
})

router.put('/update-product', async (req, res) => {
    const {category_id, product_name, product_image, product_price, product_sale_price, product_description, product_id} = req.body
    const results = await productMiddleware.updateProduct(category_id, product_name, product_image, product_price, product_sale_price, product_description, product_id)
    res.json(results)
})

module.exports = router;