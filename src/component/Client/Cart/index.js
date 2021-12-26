import React, { useEffect, useState } from 'react'
import {Button, Modal, Form, Spinner} from "react-bootstrap";
import './style.scss'
import axios from 'axios'
import {
    Navigate, useNavigate
} from "react-router-dom";
import Header from '../Header';

export default function ShopingCart(props) {
    const [cartProduct, setCartProduct] = useState([])
    const [cartTotalPrice, setCartTotalPrice] = useState(0)
    const [displayErrorModal, setDislayErrorModal] = useState({ status: false, error: '', type: '' })
    const [openCheckoutModal, setOpenCheckoutModal] = useState(false)
    const [loadingCheckout, setLoadingCheckout] = useState(false)

    const navigate = useNavigate()
    let customerData = JSON.parse(sessionStorage.getItem('gears-ctm'))

    const getCustomerProductCart = async () => {
        const getRes = await axios(`${window.SERVER_HOST}/api/cart/customer-cart/${customerData.ctm_id}`, {
            method: 'GET',
        })

        if (getRes.data.success) {
            setCartProduct(getRes.data.payload)
        }
    }

    useEffect(() => {
        getCustomerProductCart()
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        let price = 0

        cartProduct.forEach((cartItem) => {
            if (cartItem.product_sale_price > 0) {
                price = price + (Number(cartItem.product_sale_price) * Number(cartItem.quality))
            } else {
                price = price + (Number(cartItem.product_price) * Number(cartItem.quality))
            }
        })

        setCartTotalPrice(price)

    }, [cartProduct])

    const changeProductQuality = async (productId, quality) => {
        const updateRes = await axios(`${window.SERVER_HOST}/api/cart/set-cart-quality`, {
            method: 'POST',
            data: {
                productId,
                quality,
                customerId: customerData.ctm_id
            }
        })

        if (updateRes.data.success) {
            const product = [...cartProduct]
            const findIndexProduct = product.findIndex((item) => {
                if (Number(item.product_id) === Number(productId) && Number(item.user_id) === Number(customerData.ctm_id)) {
                    return true
                }
            })
            product[findIndexProduct].quality = quality
            setCartProduct(product)
        }
    }

    const deleteProductFromCart = async (productId) => {
        const deleteRes = await axios(`${window.SERVER_HOST}/api/cart/delete-cart-product`, {
            method: 'DELETE',
            data: {
                productId,
                customerId: customerData.ctm_id
            }
        })

        if (deleteRes.data.success) {
            const product = [...cartProduct].filter((item) => {
                if (Number(item.user_id) !== Number(customerData.ctm_id)) {
                    return true
                } else {
                    if (Number(item.product_id) !== Number(productId)) {
                        return true
                    }
                }
            })
            setCartProduct(product)
        }
    }

    const checkoutCart = async (customerName, customerAddress, customerPhone) => { 
        if ( cartProduct.length ){
            setLoadingCheckout(true)
            const checkoutCartRes = await axios(`${window.SERVER_HOST}/api/cart/checkout-cart`, {
                method: 'POST',
                data: {
                    customerId: customerData.ctm_id,
                    cartProduct,
                    cartTotalPrice,
                    customerAddress,
                    customerPhone,
                    customerName,
                    
                }
            })
    
            if (checkoutCartRes.data.success) {
                setCartProduct([])
                setDislayErrorModal({ status: true, error: 'Thanh toán thành công. Đơn hàng đang được xử lí', type: 'success' })
                setOpenCheckoutModal(false)
            } else {
                setDislayErrorModal({ status: true, error: 'Thanh toán thất bại, vui lòng thử lại', type: 'error' })
            }

            setLoadingCheckout(false)
        }else{
            setDislayErrorModal({ status: true, error: 'Không có sản phẩm trong giỏ hàng', type: 'error' })
        }
        
    }

    return (
        <div className="super_container client-home">

            { openCheckoutModal ? 
                <CheckoutModal 
                    setCustomerMoreInfo = {(moreInfo) => {
                        const {customerName, customerAddress, customerPhone} = moreInfo 
                        checkoutCart(customerName, customerAddress, customerPhone) 
                    }}

                    displayErrorModal = {displayErrorModal}
                    loading = {loadingCheckout}
                    showModal = {openCheckoutModal}
                    hideModal={() => setOpenCheckoutModal(false)}
                /> : ''
            }
            <Header {...props}/>
            <div className='card-frame'>       
                <div className="card">
                    <div className="row">
                        <div className="col-md-8 cart">
                            <div className="title">
                                <div className="row">
                                    <div className="col">
                                        <h4><b>Giỏ hàng</b></h4>
                                    </div>
                                    {/* <div className="col align-self-center text-right text-muted">

                                        {cartProduct.reduce((item1, item2, item3) => {return item1.quality + item2.quality}, 0)} sản phẩm

                                        </div> */}
                                </div>
                            </div>
                            {cartProduct.map((cartItem, cartIndex) => {
                                return (
                                    <div className="row" key={`cart-item-${cartIndex}`}>
                                        <div className="row main align-items-center">
                                            <div className="col-2">
                                                <img className="img-fluid" src={`data:image/png;base64, ${cartItem.product_image}`} style={{ height: '3.5rem' }} />
                                            </div>
                                            <div className="col">
                                                <div className="row text-muted">{cartItem.category_name}</div>
                                                <div className="row">{cartItem.product_name}</div>
                                            </div>
                                            <div className="col">
                                                <a style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        if (Number(cartItem.quality) > 1) {
                                                            changeProductQuality(cartItem.product_id, Number(cartItem.quality) - 1)
                                                        }

                                                    }}
                                                >-</a>
                                                <a className="border">{cartItem.quality}</a>
                                                <a style={{ cursor: 'pointer' }}
                                                    onClick={() => changeProductQuality(cartItem.product_id, Number(cartItem.quality) + 1)}
                                                >+</a>
                                            </div>
                                            <div className="col">
                                                {cartItem.product_sale_price > 0 ? cartItem.product_sale_price : cartItem.product_price} vnđ
                                                <span className="close" onClick={() => deleteProductFromCart(cartItem.product_id)} style={{ cursor: 'pointer' }}>✕</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            <div className="back-to-shop" onClick={()=>navigate('/')} style={{cursor: 'pointer'}}>
                                <a href="#">←</a>
                                <span className="text-muted">Quay về trang chủ</span>
                            </div>
                        </div>
                        <div className="col-md-4 summary">
                            <div>
                                <h5><b>Chi tiết</b></h5>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col" style={{ paddingLeft: 0 }}>{cartProduct.length} sản phẩm</div>
                                <div className="col text-right">{cartTotalPrice} vnđ</div>
                            </div>
                            <div className="row">
                                <div className="col" style={{ paddingLeft: 0 }}>Vận chuyển: </div>
                                <div className="col text-right">Miễn phí</div>
                            </div>
                            <div className="row" style={{ borderTop: '1px solid rgba(0,0,0,.1)', padding: '2vh 0' }}>
                                <div className="col">Tổng: </div>
                                <div className="col text-right">{cartTotalPrice} vnđ</div>
                            </div>
                            <button className="btn"
                                onClick={() => {
                                    setOpenCheckoutModal(true)
                                }}
                            >ĐẶT HÀNG</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// pop-up checkoutcard

const CheckoutModal = (props) => {
    const [customerName, setCustomerName] = useState('')
    const [customerAddress, setCustomerAddress] = useState('')
    const [customerPhone, setCustomerPhone] = useState('')

    const {displayErrorModal} = props
    return (
        <Modal show={props.showModal}
            size="md"
            centered
            animation={false}
            onHide={() => props.hideModal()}
            aria-labelledby="example-modal-sizes-title-sm"
        >
            <Modal.Header>
                <Modal.Title>Nhập thông tin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên khách hàng</Form.Label>
                        <Form.Control type="text" 
                            placeholder="Nhập vào tên khách hàng" 
                            value={customerName}
                            onChange={(event) => {
                                setCustomerName(event.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control type="text" 
                            placeholder="Nhập vào địa chỉ" 
                            value={customerAddress}
                            onChange={(event) => {
                                setCustomerAddress(event.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>SĐT</Form.Label>
                        <Form.Control type="text" 
                            placeholder="Nhập vào số điện thoại" 
                            value={customerPhone}
                            onChange={(event) => {
                                setCustomerPhone(event.target.value)
                            }}
                        />
                    </Form.Group>



                    {displayErrorModal.status && displayErrorModal.type === 'error'? 
                        <div style={{color: 'red'}}>{displayErrorModal.error}</div> : ''
                    }

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.hideModal()}>Đóng</Button>
                <Button variant="primary" 
                    onClick={() => 
                        props.setCustomerMoreInfo({
                        customerName,
                        customerAddress,
                        customerPhone
                    })} 
                    disabled={props.loading}
                >
                    {!props.loading ?
                        'Thanh toán' :
                        <Spinner animation="border" variant="light" />
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    )
}