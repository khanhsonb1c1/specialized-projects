import React, { useState, useEffect } from 'react'
import {Navigate, useNavigate} from "react-router-dom";
    

import { Table, Button, Modal, Spinner, Form } from "react-bootstrap";
import ShopLogo from '../../../asset/image/logo1.jpg'

export default function Header(props) {
    const [searchData, setSearchData] = useState('')
    const navigate = useNavigate()
    let customerData = JSON.parse(sessionStorage.getItem('gears-ctm'))
    const [displayErrorModal, setDislayErrorModal] = useState({ status: false, error: '', type: '' })

    const {actions} = props
    const {searchValue} = props

    useEffect(() => {
        setSearchData(searchValue)
    }, [searchValue])

    return (
        <div>
            <div style={{height: '60px', background: '#f0486c', width: '100vw', position: 'fixed', zIndex: 100}}>
                <div style={{display: 'flex', flexWrap: 'nowrap', alignItems: 'center'}}>
                    <div style={{width: '30%', marginLeft: '10%', marginTop: '5px'}}>
                        <img src={ShopLogo} style={{width: '50px', height: '50px'}}/>
                    </div>
                    <div style={{width: '70%'}}>
                        <form class="form-inline" onSubmit={(event) => event.preventDefault()} style={{ flexWrap: 'nowrap'}}>
                            <input class="form-control mr-sm-2" 
                                    type="text" 
                                    placeholder="Tìm kiếm sản phẩm" 
                                    style={{width: '50%'}}
                                    value={searchData}
                                    onChange={(event) => {
                                        setSearchData(event.target.value)
                                    }}
                            />
                            <button class="btn btn-success" 
                                style={{backgroundColor: 'burlywood'}}
                                onClick={() => {
                                    navigate('/product')
                                    actions.setSearchValue(searchData)            
                                }}
                            >
                                <i class="fas fa-search"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top" style={{marginTop: '60px'}}>
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

                <div className="container">
                    <a className="navbar-brand">GEAR SHOP</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto" style={{justifyContent: 'center'}}>
                            <li className='nav-item'
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    navigate('/')
                                }}
                                //
                            >
                                <a className="nav-link"

                                >TRANG CHỦ</a>
                            </li>
                            <li className='nav-item'
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    navigate('/product')
                                }}
                            >
                                <a className="nav-link"

                                >SẢN PHẨM</a>
                            </li>
                            {!customerData ?
                                <li className='nav-item'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        navigate('/login')
                                    }}
                                >
                                    <a className="nav-link"

                                    >ĐĂNG NHẬP</a>
                                </li> : ''
                            }

                            {!customerData ?
                                <li className='nav-item'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        navigate('/signup')
                                    }}
                                >
                                    <a className="nav-link"

                                    >ĐĂNG KÍ</a>
                                </li> : ''
                            }
                            <li className='nav-item shopping-cart'
                                style={{ color: 'white', fontSize: '1.5rem', marginRight: '2vw' }}
                                onClick={() => {
                                    if (!customerData) {
                                        setDislayErrorModal({ status: true, error: 'Bạn cần đăng nhập để xem thông tin giỏ hàng', type: 'error' })
                                    } else {

                                        navigate('/cart')
                                    }
                                }}
                            >
                                <i class="fas fa-cart-plus"></i>
                            </li>

                            {customerData ?
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
                                        Xin chào {customerData.ctm_usr}
                                    </a>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                sessionStorage.removeItem('gears-ctm')
                                                navigate('/')
                                            }}>Đăng xuất</a>
                                    </div>
                                </li> : ''
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}