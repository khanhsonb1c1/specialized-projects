const { postgresql } = require('../connector/postgresql');
const fs = require('fs');

const addCategory = async (fields, files) => {
    try {
        let categoryImage = ''
        console.log('files: ', files)
        for (let i = 0; i < files.length; i++) {
            const attachment = await fs.readFileSync(files[i].path, { encoding: 'base64' });
            if (files[i].fieldname === 'categoryImage') {
                categoryImage = attachment
            }
        }

        const { categoryName } = fields

        const addCategoryRes = await postgresql.query(
            `INSERT INTO  category(category_name, category_image) VALUES('${categoryName}', '${categoryImage}')`
        )

        if (addCategoryRes.rows) {
            const getLastId = await postgresql.query(`SELECT MAX(category_id) FROM category`)

            return {
                success: true,
                payload: {
                    categoryImage,
                    categoryId: Number(getLastId.rows[0].max)
                }
            }
        }

    } catch (error) {
        return {
            success: false,
            error: {
                message: error.message
            }
        }
    }

}

const addProduct = async (fields, files) => {
    try {
        let productImage = ''

        for (let i = 0; i < files.length; i++) {
            const attachment = await fs.readFileSync(files[i].path, { encoding: 'base64' });
            if (files[i].fieldname === 'productImage') {
                productImage = attachment
            }
        }

        const { productName, productCategory, productDescription, productPrice, productSalePrice } = fields
        const createDate = new Date().toISOString()

        const addProductRes = await postgresql.query(
            `INSERT INTO product(category_id, product_name, product_image, product_description, product_price, product_sale_price, product_create_date) 
            VALUES(${Number(productCategory)}, '${productName}', '${productImage}', '${productDescription}', ${Number(productPrice)}, ${Number(productSalePrice)}, '${createDate}')`
        )

        if (addProductRes.rows) {
            const getLastId = await postgresql.query(`SELECT MAX(product_id) FROM product`)

            return {
                success: true,
                payload: {
                    productImage,
                    productId: Number(getLastId.rows[0].max) + 1,
                    createDate
                }
            }
        }

    } catch (error) {
        return {
            success: false,
            error: {
                message: error.message
            }
        }
    }
}

const deleteProduct = async (productId) => {
    try {
        const deleteOrderDetail = await postgresql.query(`DELETE FROM order_detail WHERE product_id = ${Number(productId)}`)
        const deleteCart = await postgresql.query(`DELETE FROM cart WHERE product_id = ${Number(productId)}`)
        const deleteProduct = await postgresql.query(`DELETE FROM product WHERE product_id = ${Number(productId)}`)

        return {
            success: true
        }

    } catch (error) {
        return {
            success: false,
            error: {
                message: error.message
            }
        }
    }
}

const deleteCategory = async (categoryId) => {
    try {
        const getProductWithCategory = await postgresql.query(`SELECT * FROM product WHERE category_id=${Number(categoryId)}`)

        if (getProductWithCategory.rows.length) {
            const productRows = getProductWithCategory.rows

            for (let i = 0; i < productRows.length; i++) {
                const deleteOrderDetail = await postgresql.query(`DELETE FROM order_detail WHERE product_id = ${Number(productRows[i].product_id)}`)
                const deleteCart = await postgresql.query(`DELETE FROM cart WHERE product_id = ${Number(productRows[i].product_id)}`)     
            }

            const deleteProduct = await postgresql.query(`DELETE FROM product WHERE category_id = ${Number(categoryId)}`)
            const deleteOrderDetail = await postgresql.query(`DELETE FROM category WHERE category_id = ${Number(categoryId)}`)
            
        } else {
            const deleteOrderDetail = await postgresql.query(`DELETE FROM category WHERE category_id = ${Number(categoryId)}`)
        }

        return {
            success: true
        }

    } catch (error) {
        return {
            success: false,
            error: {
                message: error.message
            }
        }
    }
}

const updateCategory = async (category_name, category_image, category_id) => {
    try{
        const updateRes = await postgresql.query(`UPDATE category SET category_name='${category_name}', category_image='${category_image}' WHERE category_id=${Number(category_id)}`)

        if ( updateRes.rows ){
            return {
                success: true
            }
        }

    }catch(error) {
        return {
            success: false,
            error: {
                message: error.message
            }
        }
    }
}

const updateProduct = async (category_id, product_name, product_image, product_price, product_sale_price, product_description, product_id) => {
    try{
        const updateRes = await postgresql.query(`UPDATE product SET category_id=${Number(category_id)}, product_name='${product_name}', product_image='${product_image}',
        product_price=${Number(product_price)}, product_sale_price=${Number(product_sale_price)}, product_description='${product_description}' WHERE product_id=${Number(product_id)}`)

        if ( updateRes.rows ){
            return {
                success: true
            }
        }
        
    }catch(error) {
        return {
            success: false,
            error: {
                message: error.message
            }
        }
    }
}

module.exports.productMiddleware = {
    addCategory,
    addProduct,
    deleteProduct,
    deleteCategory,
    updateCategory,
    updateProduct
}