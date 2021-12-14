import React, { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from 'react-router-dom'
import '../../../asset/plugins/OwlCarousel2-2.2.1/owl.carousel.css'
import '../../../asset/plugins/OwlCarousel2-2.2.1/owl.theme.default.css'
import '../../../asset/plugins/OwlCarousel2-2.2.1/animate.css'
import '../../../asset/plugins/themify-icons/themify-icons.css'
import '../../../asset/plugins/jquery-ui-1.12.1.custom/jquery-ui.css'
import '../../../asset/styles/single_styles.css'
import '../../../asset/styles/single_responsive.css'
import axios from 'axios'
import Header from "../Header";
import { Table, Button, Modal, Spinner, Form } from "react-bootstrap";
import $ from 'jquery';
import "jquery-ui/ui/effects/effect-slide"

export default function ProductDetail(props) {
    const [productDetailInfo, setProductDetailInfo] = useState({})
    const [quality, setQuality] = useState(1)
    const [displayErrorModal, setDislayErrorModal] = useState({ status: false, error: '', type: '' })

    const params = useParams()
    const navigate = useNavigate()

    let customerData = JSON.parse(sessionStorage.getItem('gears-ctm'))

    const getProductDetail = async () => {
        const getRes = await axios(`${window.SERVER_HOST}/api/public/product-detail/${params.productId}`, {
            method: 'GET',
        })
        if (getRes.data.success) {
            setProductDetailInfo(getRes.data.payload)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        getProductDetail()
    }, [])

    const addProductToCart = async (productId) => {
        if ( customerData ){
            const addCartRes = await axios(`${window.SERVER_HOST}/api/cart/add-cart`, {
                method: 'POST',
                data : {
                    customerId: customerData.ctm_id,
                    productId: productDetailInfo.product_id,
                    quality: quality
                },
                headers: {
                    'auth-token': customerData.ctm_tk
                },
            })
        }else{
            navigate('/admin')
        }   
    }

    $(document).ready(function () {
        $('.add_to_cart_button').on('click', function () {
            if (customerData){
                const cart = $('.shopping-cart');
                const imgtodrag = $('.single_product_image_background').find("img").eq(0);
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
            <div>
                <div className="container single_product_container">
                    <div className="row">
                        <div className="col">
                            {/* Breadcrumbs */}
                            <div className="breadcrumbs d-flex flex-row align-items-center">
                                <ul>
                                    <li>
                                        <a style={{cursor: 'pointer'}} onClick={()=>navigate('/')}>Trang chủ</a>
                                    </li>
                                    <li>
                                        <a style={{cursor: 'pointer'}} onClick={()=>navigate('/product')}>
                                            <i className="fa fa-angle-right" aria-hidden="true" />Sản phẩm
                                        </a>
                                    </li>
                                    <li className="active">
                                        <a href="#" >
                                            <i className="fa fa-angle-right" aria-hidden="true" />Chi tiết sản phẩm
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-7">
                            <div className="single_product_pics">
                                <div className="row">
                                    <div className="col-lg-9 image_col order-lg-2 order-1">
                                        <div className="single_product_image">
                                            <div className="single_product_image_background">
                                                <img style={{width: '100%', height: '80%'}} src={`data:image/png;base64, ${productDetailInfo.product_image}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="product_details">
                                <div className="product_details_title">
                                    <h2>{productDetailInfo.product_name ? productDetailInfo.product_name: ''}</h2>
                                    <ul>
                                    {productDetailInfo.product_description ? 
                                        productDetailInfo.product_description.split('.').map((descriptItem, descriptIndex) => {
                                            return (
                                                <li>{descriptItem}</li>
                                            )
                                        }) : ''
                                    }
                                    </ul>
                                </div>
                                <div className="free_delivery d-flex flex-row align-items-center justify-content-center">
                                    <span className="ti-truck" /><span>Miễn phí vận chuyển</span>
                                </div>

                                {productDetailInfo.product_sale_price > 0 ? 
                                    <div className="original_price">{productDetailInfo.product_price} vnđ</div> : ''
                                }

                                {productDetailInfo.product_sale_price > 0 ?
                                    <div className="product_price">{productDetailInfo.product_sale_price} vnđ</div> :  <div className="product_price">{productDetailInfo.product_price} vnđ</div>
                                }
                                <div className="quantity d-flex flex-column flex-sm-row align-items-sm-center">
                                    <span>Số lượng:</span>
                                    <div className="quantity_selector">
                                        <span className="minus" 
                                            style={{cursor: 'poniter'}} 
                                            onClick={()=> {
                                                if ( quality > 1 ) setQuality(quality - 1)
                                            }}>
                                            <i className="fa fa-minus" aria-hidden="true" />
                                        </span>

                                        <span id="quantity_value">{quality}</span>

                                        <span className="plus"
                                            style={{cursor: 'poniter'}} 
                                            onClick={()=> {
                                                setQuality(quality + 1)
                                            }}
                                        >
                                            <i className="fa fa-plus" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <div className="red_button add_to_cart_button" 
                                        style={{visibility: 'visible', opacity: 1, cursor: 'pointer'}}
                                        onClick={() => {
                                            if ( customerData ){
                                                addProductToCart()
                                            }else{
                                                setDislayErrorModal({ status: true, error: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng', type: 'error' })
                                            }                                 
                                        }}
                                    >
                                        <a >Thêm vào giỏ hàng</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Benefit */}
                <div className="benefit">
                    <div className="container">
                        <div className="row benefit_row">
                            <div className="col-lg-3 benefit_col">
                                <div className="benefit_item d-flex flex-row align-items-center">
                                    <div className="benefit_icon"><i className="fa fa-truck" aria-hidden="true" /></div>
                                    <div className="benefit_content">
                                        <h6>Miễn phí vận chuyển</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 benefit_col">
                                <div className="benefit_item d-flex flex-row align-items-center">
                                    <div className="benefit_icon"><i className="fa fa-money" aria-hidden="true" /></div>
                                    <div className="benefit_content">
                                        <h6>Thanh toán khi nhận hàng</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 benefit_col">
                                <div className="benefit_item d-flex flex-row align-items-center">
                                    <div className="benefit_icon"><i className="fa fa-undo" aria-hidden="true" /></div>
                                    <div className="benefit_content">
                                        <h6>Đổi trả trong vòng 45 ngày</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 benefit_col">
                                <div className="benefit_item d-flex flex-row align-items-center">
                                    <div className="benefit_icon"><i className="fa fa-clock-o" aria-hidden="true" /></div>
                                    <div className="benefit_content">
                                        <h6>Mở cửa cả tuần</h6>
                                        <p>8AM - 09PM</p>
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