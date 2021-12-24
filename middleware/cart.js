const { postgresql } = require('../connector/postgresql');

const getCustomerCart = async (customerId) => {
    try{
        console.log('customerId customerId: ', customerId)
        const getCartProduct = await postgresql.query(
            `SELECT cart.*, p.product_name, p.product_image, p.product_price, p.product_sale_price, category.category_name  FROM cart JOIN product p ON cart.product_id = p.product_id 
            JOIN category ON p.category_id =  category.category_id WHERE cart.user_id = ${Number(customerId)}`)
        
        if ( getCartProduct.rows ){
            return {
                success: true,
                payload: getCartProduct.rows
            }
        }

    }catch(error){
        return {
            success : false,
            error : {
                message: error.message
            }
        }
    }
}

const addProductToCart = async (customerId, productId, qly) => {
    try {
        const checkCartExist = await postgresql.query(`SELECT * FROM cart WHERE user_id = ${Number(customerId)} `)

        if ( checkCartExist.rows ){
            if ( checkCartExist.rows.length > 0 ){
                const checkProductExist = await postgresql.query(`SELECT * FROM cart WHERE user_id = ${Number(customerId)} AND product_id = ${Number(productId)}`)
                if ( checkProductExist.rows ){
                    if ( checkProductExist.rows.length ){
                        const {quality} = checkProductExist.rows[0]
                        const newQuality = Number(quality) + Number(qly)
                        
                        const updateCart = await postgresql.query(`UPDATE cart SET quality=${newQuality} WHERE user_id = ${Number(customerId)} AND product_id= ${Number(productId)}`)
                    }else{
                        const insertCart = await postgresql.query(`INSERT INTO cart(product_id, user_id, quality) VALUES(${Number(productId)}, ${Number(customerId)}, ${qly})`)
                    }
                }
            }else{
                const insertCart = await postgresql.query(`INSERT INTO cart(product_id, user_id, quality) VALUES(${Number(productId)}, ${Number(customerId)}, ${qly})`)
            }
        }

        return {
            success: true,
        }

    }catch(error){
        return {
            success : false,
            error : {
                message: error.message
            }
        }
    }
}

const setCartQuality = async (customerId, productId, quality) => {
    try{
        const updateCart = await postgresql.query(
            `UPDATE cart SET quality=${quality} WHERE user_id = ${Number(customerId)} AND product_id= ${Number(productId)}`
        )

        if ( updateCart.rows ){
            return {
                success: true,
            }
        }

    }catch(error){
        return {
            success : false,
            error : {
                message: error.message
            }
        }
    }
}

const deleteCartProduct = async (customerId, productId) => {
    try{
        const deleteCart = await postgresql.query(`DELETE FROM cart WHERE user_id = ${Number(customerId)} AND product_id= ${Number(productId)}`)
        if ( deleteCart.rows ){
            return {
                success: true
            }
        }

    }catch(error){
        return {
            success : false,
            error : {
                message: error.message
            }
        }
    }
}

const checkoutCart = async (customerId, cartProduct, cartTotalPrice, customerName, customerAddress, customerPhone) => {
    try{
        const createDate = new Date().toISOString()
// insert dữ liệu vào bảng oder
        const insertOrderTable = await postgresql.query(`INSERT INTO user_order(user_id, price, create_date, status,order_customer, order_address, order_phone ) 
        VALUES(${Number(customerId)}, ${Number(cartTotalPrice)}, '${createDate}', 'Xác nhận', '${customerName}', '${customerAddress}', '${customerPhone}')`)
        
        const getLastId = await postgresql.query(`SELECT MAX(order_id) FROM user_order`)
        const lastId = Number(getLastId.rows[0].max)
        for(let i= 0; i < cartProduct.length; i++ ){
            const insertOrderDetailTable = await postgresql.query(`INSERT INTO order_detail(order_id, product_id, quality) VALUES(${Number(lastId)}, ${Number(cartProduct[i].product_id)}, ${Number(cartProduct[i].quality)})`)
        }

        const deleteCart = await postgresql.query(`DELETE FROM cart WHERE user_id = ${Number(customerId)}`)

        return {
            success: true   
        }

    }catch(error){
        return {
            success : false,
            error : {
                message: error.message
            }
        }
    }
}

const getOrder = async () => {
    try{
        const getOrder = await postgresql.query(
            `select ord.*,detail.product_id, detail.quality,product.*, usr.* FROM user_order ord JOIN order_detail detail ON ord.order_id = detail.order_id 
            JOIN customer usr ON usr.user_id = ord.user_id JOIN product ON detail.product_id = product.product_id`)
        
        if ( getOrder.rows ){
            const orderRows = getOrder.rows
            const orderResult = []

            orderRows.forEach((orderItem, orderIndex) => {
                const findIndex = orderResult.findIndex((item) => item.order_id === orderItem.order_id )
                if ( findIndex < 0 ){
                    const order = {
                        order_id: orderItem.order_id,
                        user_id: orderItem.user_id,
                        price: orderItem.price,
                        status: orderItem.status,
                        create_date: orderItem.create_date,
                        user_name: orderItem.user_name,
                        order_customer: orderItem.order_customer,
                        order_address: orderItem.order_address,
                        order_phone: orderItem.oder_phone,
                        product: [
                            {
                                product_id: orderItem.product_id,
                                product_name: orderItem.product_name,
                                product_image: orderItem.product_image,
                                product_price: orderItem.product_price,
                                product_sale_price: orderItem.product_sale_price,
                                quality: orderItem.quality,                   
                            }
                        ]
                    }

                    orderResult.push(order)

                }else{
                    const product = [...orderResult[findIndex].product]
                    product.push({
                        product_id: orderItem.product_id,
                        product_name: orderItem.product_name,
                        product_image: orderItem.product_image,
                        product_price: orderItem.product_price,
                        product_sale_price: orderItem.product_sale_price,
                        quality: orderItem.quality
                    })

                    orderResult[findIndex].product = product
                }
            })
            return {
                success: true,
                payload: orderResult
            }
        }
    }catch(error){
        return {
            success : false,
            error : {
                message: error.message
            }
        }
    }
}

const updateOrderStatus = async (status, orderId) => {
    try{
        const updateOrder = await postgresql.query(`UPDATE user_order SET status = '${status}' WHERE order_id = ${Number(orderId)}`)

        if ( updateOrder.rows ){
            return {
                success: true
            }
        }

    }catch(error){
        return {
            success : false,
            error : {
                message: error.message
            }
        }
    }
}

module.exports.cartMiddleware = {
    getCustomerCart,
    addProductToCart,
    setCartQuality,
    deleteCartProduct,
    checkoutCart,
    getOrder,
    updateOrderStatus
}