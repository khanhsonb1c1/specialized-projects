
const express =  require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {publicMiddleware} = require('../middleware/public');


router.post('/signup', bodyParser(), async (req, res) => {
    const { userName, userPassword } = req.body
    const results = await publicMiddleware.customerSignUp(userName, userPassword)
    res.json(results)
})

router.post('/login', bodyParser(), async (req, res) => {
    const { userName, userPassword } = req.body
    const results = await publicMiddleware.customerLogin(userName, userPassword)
    res.json(results)
})

router.get('/get-category', async (req, res) => {
    const results = await publicMiddleware.getCategory()
    res.json(results)
})

router.get('/get-product', async (req, res) => {
    const results = await publicMiddleware.getProduct()
    res.json(results)
})

router.get('/get-new-product/:categoryId', async (req, res) => {
    const {categoryId} = req.params
    const results = await publicMiddleware.getNewProductAsCategoryId(categoryId)
    res.json(results)
})

router.post('/get-product-by-category', bodyParser(), async (req, res) => {
    const { page, category, searchValue } = req.body
    const results = await publicMiddleware.getProductByCategory(page, category, searchValue)
    res.json(results)
})

router.get('/product-detail/:productId', async (req, res) => {
    const {productId} = req.params
    const results = await publicMiddleware.getProductDetail(productId)
    res.json(results)
})


module.exports = router;