import React, { useEffect, useState } from 'react'
import '../../../asset/plugins/OwlCarousel2-2.2.1/owl.carousel.css'
import '../../../asset/plugins/OwlCarousel2-2.2.1/owl.theme.default.css'
import '../../../asset/plugins/OwlCarousel2-2.2.1/animate.css'
import '../../../asset/plugins/jquery-ui-1.12.1.custom/jquery-ui.css'
import '../../../asset/styles/categories_styles.css'
import '../../../asset/styles/categories_responsive.css'
import './style.scss'
import BannerGear from '../../../asset/image/Banner_Gear.jpg'
import axios from 'axios'
import {
    useNavigate,
    useParams
} from 'react-router-dom';
import Header from '../Header';
import { Table, Button, Modal, Spinner, Form } from "react-bootstrap";
import $ from 'jquery';
import "jquery-ui/ui/effects/effect-slide"


export default function ClientProduct(props) {
    const [allCategory, setAllCategory] = useState([])
    const [selectCategoty, setSelectCategory] = useState(null)
    const [listProduct, setListProduct] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [totalItem, setTotalItem] = useState(1)
    const [displayErrorModal, setDislayErrorModal] = useState({ status: false, error: '', type: '' })

    const navigate = useNavigate()
    let customerData = JSON.parse(sessionStorage.getItem('gears-ctm'))

    const { searchValue, searchCategory } = props

    const getAllCategory = async () => {
        const getRes = await axios(`${window.SERVER_HOST}/api/public/get-category`, {
            method: 'GET',
        })

        if (getRes.data.success) {
            setAllCategory(getRes.data.payload)

            if (getRes.data.payload.length) {
                if (Number(searchCategory) < 0)
                    setSelectCategory(getRes.data.payload[0].category_id)
            }
        }
    }

    const getProduct = async (page) => {
        const getRes = await axios(`${window.SERVER_HOST}/api/public/get-product-by-category`, {
            method: 'POST',
            data: {
                page: page,
                category: selectCategoty,
                searchValue: searchValue.length ? searchValue : ''
            }
        })

        if (getRes.data.success) {
            setListProduct(getRes.data.payload)
            setCurrentPage(page)
            setTotalItem(getRes.data.totalItem)
            setTotalPage(Math.ceil(getRes.data.totalItem / 20) < 1 ? 1 : Math.ceil(getRes.data.totalItem / 20))
        }
    }

    useEffect(() => {
        getProduct(currentPage)
    }, [selectCategoty, searchValue])

    useEffect(() => {
        getAllCategory()
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        setSelectCategory(searchCategory)
    }, [searchCategory])

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

            console.log('addCartRes addCartRes: ', addCartRes)
        } else {
            navigate('/admin')
        }
    }

    $(document).ready(function () {
        $('.add_to_cart_button').on('click', function () {
            if (customerData){
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
    
    return (
        <div className="super_container client-home">
            {/* Header */}
            <Header {...props} />
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
            <div className="container product_section_container">
                <div className="row">
                    <div className="col product_section clearfix">
                        {/* Breadcrumbs */}
                        <div className="breadcrumbs d-flex flex-row align-items-center">
                            <ul>
                                <li style={{ cursor: 'pointer' }}><a onClick={() => navigate('/')}>Trang chủ</a></li>
                                <li className="active"><a><i className="fa fa-angle-right" aria-hidden="true" />Sản phẩm</a></li>
                            </ul>
                        </div>
                        {/* Sidebar */}
                        <div className="sidebar">
                            <div className="sidebar_section">
                                <div className="sidebar_title">
                                    <h5>Danh mục</h5>
                                </div>
                                <ul className="sidebar_categories">
                                    {allCategory.map((categoryItem, categoryIndex) => {
                                        if (categoryItem.category_id === Number(selectCategoty)) {
                                            return <li className="active"><a href="#"><span><i className="fa fa-angle-double-right" aria-hidden="true" /></span>{categoryItem.category_name}</a></li>
                                        } else {
                                            return (
                                                <li onClick={() => setSelectCategory(categoryItem.category_id)} style={{ cursor: 'pointer' }}>
                                                    <a >{categoryItem.category_name}</a>
                                                </li>
                                            )
                                        }
                                    })}
                                </ul>
                            </div>
                        </div>
                        {/* Main Content */}
                        <div className="main_content">
                            {/* Products */}
                            <div className="products_iso">
                                <div className="row">
                                    <div className="col">
                                        {/* Product Grid */}
                                        <div className="product-grid" style={{ marginTop: 0, display: 'flex', flexWrap: 'wrap' }}>
                                            {/* Product 1 */}
                                            {listProduct.length ? listProduct.map((productItem, productIndex) => {
                                                return (
                                                    <div className="product-item accessories"
                                                        key={`newproduct-${productIndex}`}
                                                    >
                                                        <div className="product discount product_filter" onClick={() => navigate(`${productItem.product_id}`)}>
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
                                                            <a >Thêm vào giỏ hàng</a>
                                                        </div>
                                                    </div>
                                                )
                                            }) : <p style={{ fontSize: '1.5rem' }}>Không có sản phẩm phù hợp</p>}
                                        </div>
                                        {listProduct.length ?
                                            <div className="product_sorting_container product_sorting_container_bottom clearfix">
                                                <span className="showing_results">Showing 1–{totalPage} of {totalItem} results</span>
                                                <div className="pages d-flex flex-row align-items-center">
                                                    {currentPage > 1 ?
                                                        <div id="next_page_1"
                                                            className="page_next"
                                                            style={{ marginRight: '30px' }}
                                                            onClick={() => {
                                                                setCurrentPage(currentPage - 1)
                                                                getProduct(currentPage - 1)
                                                            }}
                                                        >
                                                            <a>
                                                                <i className="fa fa-long-arrow-left" aria-hidden="true" />
                                                            </a>
                                                        </div> : ''
                                                    }
                                                    <div className="page_current">
                                                        <span>{currentPage}</span>
                                                    </div>
                                                    <div className="page_total"><span>of</span> {totalPage}</div>
                                                    {totalPage > 1 && Number(currentPage) < Number(totalPage) ?
                                                        <div id="next_page_1"
                                                            className="page_next"
                                                            onClick={() => {
                                                                setCurrentPage(currentPage + 1)
                                                                getProduct(currentPage + 1)
                                                            }}
                                                        >
                                                            <a>
                                                                <i className="fa fa-long-arrow-right" aria-hidden="true" />
                                                            </a>
                                                        </div> : ''
                                                    }
                                                </div>
                                            </div> : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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