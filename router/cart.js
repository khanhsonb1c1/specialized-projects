
const express =  require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {cartMiddleware} = require('../middleware/cart');
const asyncBusboy = require('async-busboy');

router.get('/customer-cart/:customerId', async (req, res) => {
    const {customerId} = req.params
    const results = await cartMiddleware.getCustomerCart(customerId)
    res.json(results)
})

router.post('/add-cart', bodyParser(), async (req, res) => {
    const {customerId, productId, quality} = req.body
    const results = await cartMiddleware.addProductToCart(customerId, productId, quality)
    res.json(results)
})

router.post('/set-cart-quality', bodyParser(), async (req, res) => {
    const {customerId, productId, quality} = req.body
    const results = await cartMiddleware.setCartQuality(customerId, productId, quality)
    res.json(results)
})

router.delete('/delete-cart-product', bodyParser(), async (req, res) => {
    const {customerId, productId} = req.body
    const results = await cartMiddleware.deleteCartProduct(customerId, productId)
    res.json(results)
})

router.post('/checkout-cart', bodyParser(), async (req, res) => {
    const {customerId, cartProduct, cartTotalPrice, customerName, customerAddress, customerPhone} = req.body
    const results = await cartMiddleware.checkoutCart(customerId, cartProduct, cartTotalPrice, customerName, customerAddress, customerPhone)
    res.json(results)
})

router.get('/get-order', async (req, res) => {
    const results = await cartMiddleware.getOrder()
    res.json(results)
})

router.put('/update-order-status', async (req, res) => {
    const {status, orderId} = req.body
    const results = await cartMiddleware.updateOrderStatus(status, orderId)
    res.json(results)
})

module.exports = router;