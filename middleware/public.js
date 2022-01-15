const { postgresql } = require('../connector/postgresql');
const bcrypt = require('bcryptjs');
const SALT_ROUND = 10;
const jwt = require("jsonwebtoken")
const SECRET_TOKEN = 'FACE_TAG'

const customerSignUp = async(userName, userPassword, userFullname, userAge, userAddress, userPhone) => {
    try {
        console.log('userName: ', userName)
        console.log('userPassword: ', userPassword)

        const checkUserFromCustomer = await postgresql.query(
            `SELECT user_name FROM customer WHERE user_name = '${userName}'`
        )

        const checkUserFromAdmin = await postgresql.query(
            `SELECT user_name FROM admin WHERE user_name= '${userName}'`
        )



        if (!checkUserFromCustomer.rows.length && !checkUserFromAdmin.rows.length) {
            const token = jwt.sign({ _id: userName }, SECRET_TOKEN)

            const insertAccount = await postgresql.query(
                `INSERT INTO customer(user_name, password, user_fullname, user_age, user_phone, user_address, token) 
                VALUES ('${userName}', '${userPassword}','${userFullname}','${userAge}','${userPhone}','${userAddress}','${token}');`
            )

            const getCustomerId = await postgresql.query(
                `SELECT user_id FROM customer WHERE user_name = '${userName}'`
            )

            if (insertAccount.rows) {
                return {
                    success: true,
                    payload: {
                        ctm_tk: token,
                        ctm_rl: 'c',
                        ctm_id: getCustomerId.rows[0].user_id,
                        ctm_usr: userName
                    }
                }
            }

        } else {
            throw new Error('Tên đăng nhập tồn tại')
        }

        return {
            success: true,
        }
    } catch (err) {
        return {
            success: false,
            error: {
                message: err.message
            }
        }
    }
}

const customerLogin = async(userName, userPassword) => {
    try {
        const checkUserFromCustomer = await postgresql.query(
            `SELECT user_id, user_name, password, token FROM customer WHERE user_name = '${userName}'`
        )

        const checkEmailFromAdmin = await postgresql.query(
            `SELECT admin_id, user_name, password, token FROM admin WHERE user_name= '${userName}'`
        )

        if (checkUserFromCustomer.rows.length) {
            const accountRow = checkUserFromCustomer.rows[0]

            if (bcrypt.compareSync(userPassword, accountRow.password)) {
                return {
                    success: true,
                    payload: {
                        ctm_tk: accountRow.token,
                        ctm_rl: 'c',
                        ctm_id: accountRow.user_id,
                        ctm_usr: userName
                    }
                }
            } else {
                throw new Error("Sai mật khẩu")
            }

        } else if (checkEmailFromAdmin.rows.length) {
            const accountRow = checkEmailFromAdmin.rows[0]
            if (bcrypt.compareSync(userPassword, accountRow.password)) {
                return {
                    success: true,
                    payload: {
                        ctm_tk: accountRow.token,
                        ctm_rl: 'a',
                        ctm_id: accountRow.admin_id
                    }
                }
            } else {
                throw new Error("Sai mật khẩu")
            }

        } else {
            throw new Error("Thông tin đăng nhập không chính xác")
        }

    } catch (err) {
        return {
            success: false,
            error: {
                message: err.message
            }
        }
    }
}



const getUserInfor = async(userId) => {
    try {
        const getUserInfor = await postgresql.query(
            `SELECT * FROM customer WHERE user_name=${Number(userId)}`
        )

        if (getUserInfor.rows) {
            return {
                success: true,
                payload: getUserInfor.rows
            }
        } else {
            throw new Error('Lấy thông tin tai khoan thất bại')
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







const getUserOder = async() => {

}


const updateUserInfor = async() => {

}




const getCategory = async() => {
    try {
        const getCategory = await postgresql.query(
            `SELECT * FROM category`
        )

        if (getCategory.rows) {
            return {
                success: true,
                payload: getCategory.rows
            }
        } else {
            throw new Error('Lấy thông tin danh mục thất bại')
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

const getProduct = async() => {
    try {
        const getProduct = await postgresql.query(
            `SELECT * FROM product`
        )

        if (getProduct.rows) {
            return {
                success: true,
                payload: getProduct.rows
            }
        } else {
            throw new Error('Lấy thông tin sản phẩm thất bại')
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

const getNewProductAsCategoryId = async(categoryId) => {
    try {
        const getProduct = await postgresql.query(
            `SELECT * FROM product WHERE category_id=${Number(categoryId)} ORDER BY product_create_date DESC LIMIT 10`
        )

        if (getProduct.rows) {
            return {
                success: true,
                payload: getProduct.rows
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

const getProductByCategory = async(page, category, searchValue) => {
    try {
        const getProduct = await postgresql.query(
            `SELECT * FROM product WHERE category_id=${Number(category)} AND upper(product_name) like '%${searchValue.toUpperCase()}%' offset ${(Number(page) - 1) * 20 } LIMIT 20`
        )

        const getTotalItem = await postgresql.query(`SELECT * FROM product WHERE category_id=${Number(category)} AND product_name like '%${searchValue}%'`)

        if (getProduct.rows) {
            return {
                success: true,
                payload: getProduct.rows,
                totalItem: getTotalItem.rows.length

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

const getProductDetail = async(productId) => {
    try {
        const getProductDetail = await postgresql.query(
            `SELECT * FROM product WHERE product_id=${Number(productId)}`
        )

        if (getProductDetail.rows && getProductDetail.rows.length) {
            return {
                success: true,
                payload: getProductDetail.rows[0]
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

module.exports.publicMiddleware = {
    customerSignUp,
    customerLogin,
    getCategory,
    getProduct,
    getNewProductAsCategoryId,
    getProductByCategory,
    getProductDetail,
<<<<<<< HEAD
    getUserInfor,
    getUserOder,
    updateUserInfor,

}
=======
}
>>>>>>> 9903049c463130432a570a28d21d74f45ea584cd
