import React, { useEffect, useState } from 'react'
import '../../../asset/plugins/OwlCarousel2-2.2.1/owl.carousel.css'
import '../../../asset/plugins/OwlCarousel2-2.2.1/owl.theme.default.css'
import '../../../asset/plugins/OwlCarousel2-2.2.1/animate.css'
import '../../../asset/styles/main_styles.css'
import '../../../asset/styles/responsive.css'
import './style.scss'
import BannerGear from '../../../asset/image/Banner_Gear.jpg';
import BannerGear2 from '../../../asset/image/Banner_Gear2.jpeg'
import DealBanner from '../../../asset/image/Deal_Banner.jpeg';
import axios from 'axios'
import {
    Navigate, useNavigate
} from "react-router-dom";
import Header from '../Header'
import { Table, Button, Modal, Spinner, Form } from "react-bootstrap";
import $ from 'jquery';
import "jquery-ui/ui/effects/effect-slide"

export default function ClientHome(props) {
    const [allCategory, setAllCategory] = useState([])
    const [newProduct, setNewProduct] = useState([])
    const [selectCategotyNewProduct, setSelectCategoryNewProduct] = useState(null)
    const [displayErrorModal, setDislayErrorModal] = useState({ status: false, error: '', type: '' })

    const navigate = useNavigate()
    let customerData = JSON.parse(sessionStorage.getItem('gears-ctm'))
    const {actions} = props

    const getAllCategory = async () => {
        const getRes = await axios(`${window.SERVER_HOST}/api/public/get-category`, {
            method: 'GET',
        })

        console.log('get category: ', getAllCategory)
        if (getRes.data.success) {
            setAllCategory(getRes.data.payload)

            if (getRes.data.payload.length) {
                setSelectCategoryNewProduct(getRes.data.payload[0].category_id)
            }
        }
    }

    const getNewProduct = async (categoryId) => {
        const getRes = await axios(`${window.SERVER_HOST}/api/public/get-new-product/${Number(categoryId)}`, {
            method: 'GET',
        })

        if (getRes.data.success) {
            setNewProduct(getRes.data.payload)
        }
    }

    useEffect(() => {
        getNewProduct(selectCategotyNewProduct)
    }, [selectCategotyNewProduct])

    useEffect(() => {
        getAllCategory()
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const addProductToCart = async (productId) => {
        if (customerData) {
            const addCartRes = await axios(`${window.SERVER_HOST}/api/cart/add-cart`, {
                method: 'POST',
                data: {
                    customerId: customerData.ctm_id,
                    productId,
                    quality: 1
                },
                headers: {
                    'auth-token': customerData.ctm_tk
                },
            })

        } else {
            navigate('/admin')
        }
    }

    $(document).ready(function () {
        $('.add_to_cart_button').on('click', function () {
            if(customerData){
                const cart = $('.shopping-cart');
                const imgtodrag = $(this).parent('.product-item').find("img").eq(0);
                if (imgtodrag) {
                    const imgclone = imgtodrag.clone()
                        .offset({
                            top: imgtodrag.offset().top,
                            left: imgtodrag.offset().left
                        })
                        .css({
                            'opacity': '0.5',
                            'position': 'absolute',
                            'height': '150px',
                            'width': '150px',
                            'z-index': '2000'
                        })
                        .appendTo($('body'))
                        .animate({
                            'top': cart.offset().top + 10,
                            'left': cart.offset().left + 10,
                            'width': 75,
                            'height': 75
                        }, 1000, 'easeInOutExpo');
    
                    imgclone.animate({
                        'width': 0,
                        'height': 0
                    }, function () {
                        $(this).detach()
                    });
    
                }
            }
        });
    })

    const renderCategory = allCategory.map((categoryItem, categoryIndex) => {
        return (
            <div className="col-md-4" 
                key={`homecategory-${categoryIndex}`} 
                style={{marginTop: '110px'}}
                onClick={() => {
                    navigate('/product')
                    actions.setSearchCategory(categoryItem.category_id)
                }}
            >
                <div className="banner_item align-items-center">
                    <img src={`data:image/png;base64, ${categoryItem.category_image}`} style={{ width: '100%', height: '100%', minHeight: '100%', minWidth: '100%', maxHeight: '100%', maxWidth: '100%' }} />
                    <div className="banner_category">
                        <a>{categoryItem.category_name}</a>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="super_container client-home">
            {/* Header */}
            <Header {...props}/>
            {displayErrorModal.status ?
                <Modal show={displayErrorModal.status}
                    size="md"
                    centered
                    animation={false}
                    onHide={() => setDislayErrorModal({ status: false, error: '', type: '' })}
                    aria-labelledby="example-modal-sizes-title-sm"
                >
                    <Modal.Body>
                        <div style={{ fontSize: '24px', color: displayErrorModal.type === 'error' ? 'red' : 'blue' }}>{displayErrorModal.error}</div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setDislayErrorModal({ status: false, error: '', type: '' })}>Đóng</Button>
                    </Modal.Footer>
                </Modal> : ''
            }
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to={0} className="active" />
                    <li data-target="#carouselExampleIndicators" data-slide-to={1} />
                    {/* <li data-target="#carouselExampleIndicators" data-slide-to={2} /> */}
                </ol>
                <div className="carousel-inner" style={{ height: '100%', minHeight: '100vh', maxHeight: '100vh' }}>
                    <div className="carousel-item active" style={{ height: '100%', minHeight: '100vh', maxHeight: '100vh', minWidth: '100vw' }}>
                        <img src={BannerGear} class="img-fluid" style={{ height: '100%', minHeight: '100vh', maxHeight: '100vh', objectFit: 'cover', minWidth: '100vw' }} />
                        <div className="carousel-caption">


                        </div>
                    </div>
                    <div className="carousel-item" style={{ height: '100%', minHeight: '100vh', maxHeight: '100vh', minWidth: '100vw' }}>
                        <img src={BannerGear2} class="img-fluid" style={{ height: '100%', minHeight: '100vh', maxHeight: '100vh', objectFit: 'cover', minWidth: '100vw' }} />
                        <div className="carousel-caption">
                            <h1 style={{ color: 'white' }}>New product</h1>
                        </div>
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="sr-only">Next</span>
                </a>
            </div>

            {/* Banner */}
            <div className="banner">
                <div className="container">
                    <div className="row" style={{ justifyContent: 'center' }}>
                        {renderCategory}
                    </div>
                </div>
            </div>
            {/* New Arrivals */}
            <div className="new_arrivals">
                <div className="container">
                    <div className="row">
                        <div className="col text-center">
                            <div className="section_title new_arrivals_title">
                                <h2>Sản phẩm mới</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col text-center">
                            <div className="new_arrivals_sorting">
                                <ul className="arrivals_grid_sorting clearfix button-group filters-button-group">
                                    {allCategory.map((categoryItem, categoryIndex) => {
                                        return (
                                            <li key={`new-product-category-${categoryIndex}`}
                                                className={`grid_sorting_button button d-flex flex-column justify-content-center align-items-center` + `${categoryItem.category_id === Number(selectCategotyNewProduct) ? ' active is-checked' : ''}`}
                                                onClick={() => {
                                                    setSelectCategoryNewProduct(categoryItem.category_id)
                                                }}
                                            >{categoryItem.category_name}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="product-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {/* Product 1 */}
                                {newProduct.map((productItem, productIndex) => {
                                    return (
                                        <div className="product-item accessories" key={`newproduct-${productIndex}`}>
                                            <div className="product discount product_filter" onClick={() => navigate(`product/${productItem.product_id}`)}>
                                                <div className="product_image" style={{ height: '60%' }}>
                                                    <img src={`data:image/png;base64, ${productItem.product_image}`} style={{ height: '100%' }} />
                                                </div>
                                                <div className="favorite favorite_left" />
                                                <div className="product_info">
                                                    <h6 className="product_name"><a href="#single.html">{productItem.product_name}</a></h6>
                                                    {productItem.product_sale_price > 0 ?
                                                        <div className="product_price">{productItem.product_sale_price} vnđ<span>{productItem.product_price} vnđ</span></div> :
                                                        <div className="product_price">{productItem.product_price} vnđ</div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="red_button add_to_cart_button"
                                                style={{ width: '100%', marginLeft: 0 }}
                                                onClick={() => {
                                                    if (customerData) {
                                                        addProductToCart(productItem.product_id)
                                                    } else {
                                                        setDislayErrorModal({ status: true, error: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng', type: 'error' })
                                                    }

                                                }}
                                            >
                                                <a>Thêm vào giỏ hàng</a>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Deal of the week */}
            <div className="deal_ofthe_week">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="deal_ofthe_week_img">
                                <img src={DealBanner} alt="" />
                            </div>
                        </div>
                        <div className="col-lg-6 text-right deal_ofthe_week_col">
                            <div className="deal_ofthe_week_content d-flex flex-column align-items-center float-right">
                                <div className="section_title" style={{ backgroundColor: 'aliceblue' }}>
                                    <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'red' }}>Ưu đãi khủng trong tuần</h2>
                                </div>
                                <div className="red_button deal_ofthe_week_button"
                                    onClick={() => navigate('/product')}
                                >
                                    <a>Mua sắm ngay</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Best Sellers */}
            {/* <div className="new_arrivals">
                <div className="container">
                    <div className="row">
                        <div className="col text-center">
                            <div className="section_title new_arrivals_title">
                                <h2>Sản phẩm bán chạy</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col text-center">
                            <div className="new_arrivals_sorting">
                                <ul className="arrivals_grid_sorting clearfix button-group filters-button-group">
                                    {allCategory.map((categoryItem, categoryIndex) => {
                                        return (
                                            <li key={`new-product-category-${categoryIndex}`}
                                                className={`grid_sorting_button button d-flex flex-column justify-content-center align-items-center` + `${categoryItem.category_id === Number(selectCategotyNewProduct) ? ' active is-checked' : ''}`}
                                                onClick={() => {
                                                    setSelectCategoryNewProduct(categoryItem.category_id)
                                                }}
                                            >{categoryItem.category_name}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="product-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                              
                                {newProduct.map((productItem, productIndex) => {
                                    return (
                                        <div className="product-item accessories" key={`newproduct-${productIndex}`}>
                                            <div className="product discount product_filter">
                                                <div className="product_image" style={{ height: '40%' }}>
                                                    <img src={`data:image/png;base64, ${productItem.product_image}`} style={{ height: '100%' }} />
                                                </div>
                                                <div className="favorite favorite_left" />
                                                <div className="product_info">
                                                    <h6 className="product_name"><a href="#single.html">{productItem.product_name}</a></h6>
                                                    {productItem.product_sale_price > 0 ?
                                                        <div className="product_price">{productItem.product_sale_price} vnđ<span>{productItem.product_price} vnđ</span></div> :
                                                        <div className="product_price">{productItem.product_price} vnđ</div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="red_button add_to_cart_button"
                                                style={{ width: '100%', marginLeft: 0 }}
                                                onClick={() => {
                                                    if (customerData) {
                                                        addProductToCart(productItem.product_id)
                                                    } else {
                                                        setDislayErrorModal({ status: true, error: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng', type: 'error' })
                                                    }

                                                }}
                                            >
                                                <a>Thêm vào giỏ hàng</a>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            
            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="footer_nav_container d-flex flex-sm-row flex-column align-items-center justify-content-lg-start justify-content-center text-center">
                                <ul className="footer_nav">
                                    <li><a href="#">Blog</a></li>
                                    <li><a href="#">FAQs</a></li>
                                    <li><a href="contact.html">Contact us</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="footer_social d-flex flex-row align-items-center justify-content-lg-end justify-content-center">
                                <ul>
                                    <li><a href="#"><i className="fa fa-facebook" aria-hidden="true" /></a></li>
                                    <li><a href="#"><i className="fa fa-twitter" aria-hidden="true" /></a></li>
                                    <li><a href="#"><i className="fa fa-instagram" aria-hidden="true" /></a></li>
                                    <li><a href="#"><i className="fa fa-skype" aria-hidden="true" /></a></li>
                                    <li><a href="#"><i className="fa fa-pinterest" aria-hidden="true" /></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}