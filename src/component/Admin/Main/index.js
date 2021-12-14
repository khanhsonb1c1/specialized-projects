import React, { useState, useCallback, useEffect } from "react";
import './sb-admin-2.min.scss';
import './style.css';
import NoAvatar from '../../../media/images/no-avatar.png'
import Product from "../Product";
import AdminOrder from "../Order";
import { useNavigate } from "react-router-dom";

export default function AdminDashBoard(props) {
    let navigate = useNavigate();

    const [selected, setSelected] = useState(1)
    const [title, setTitle] = useState('Khách hàng')

    const renderComponent = () => {
        if ( selected === 1 ){
            return <Product {...props} />
        }else if ( selected === 2 ){
            return <AdminOrder {...props} />
        }
    }

    useEffect(() => {
        if ( selected === 1 ) setTitle('Sản phẩm')
        else if (selected === 2) setTitle('Đặt hàng')
    },[selected])

    return (
        <div id="admin-page">
            <div id="wrapper">
                <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                        <div class="sidebar-brand-icon rotate-n-15">
                            <i class="fas fa-laugh-wink"></i>
                        </div>
                        <div class="sidebar-brand-text mx-3">GEAR SHOP ADMIN</div>
                    </a>
                    <hr class="sidebar-divider my-0" />
                    <li class="nav-item active" onClick={()=>setSelected(1)} style={{cursor: 'pointer'}}>
                        <a class="nav-link">
                            <i class="fas fa-fw fa-tachometer-alt"></i>
                            <span>Sản phẩm</span></a>
                    </li>

                    <li class="nav-item active" onClick={()=>setSelected(2)} style={{cursor: 'pointer'}}>
                        <a class="nav-link">
                            <i class="fas fa-fw fa-tachometer-alt"></i>
                            <span>Đơn đặt hàng</span></a>
                    </li>
                </ul>
                <div id="content-wrapper" class="d-flex flex-column">

                    <div id="content">

                        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow" style={{width: '100%'}}>
                            {/* <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                                <i class="fa fa-bars"></i>
                            </button> */}
                            {/* <form
                                class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                                <div class="input-group" style={{display: 'flex', flexWrap: 'nowrap'}}>
                                    <input type="text" class="form-control bg-light border-0 small" placeholder="Tìm kiếm theo tên sản phẩm"
                                        aria-label="Search" aria-describedby="basic-addon2" />
                                    <div class="input-group-append">
                                        <button class="btn btn-primary" type="button">
                                            <i class="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </form> */}
                            <ul class="navbar-nav ml-auto">
                                {/* <li class="nav-item dropdown no-arrow d-sm-none">
                                    <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-search fa-fw"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                        aria-labelledby="searchDropdown">
                                        <form class="form-inline mr-auto w-100 navbar-search">
                                            <div class="input-group">
                                                <input type="text" class="form-control bg-light border-0 small"
                                                    placeholder="Search for..." aria-label="Search"
                                                    aria-describedby="basic-addon2" />
                                                <div class="input-group-append">
                                                    <button class="btn btn-primary" type="button">
                                                        <i class="fas fa-search fa-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </li> */}
                                <div class="topbar-divider d-none d-sm-block"></div>
                                <li class="nav-item dropdown no-arrow">
                                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span class="mr-2 d-none d-lg-inline text-gray-600 small">Admin</span>
                                        <img class="img-profile rounded-circle"
                                            src={NoAvatar} />
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="userDropdown">
                                        <a class="dropdown-item" 
                                            href="#" 
                                            data-toggle="modal" 
                                            data-target="#logoutModal" 
                                            onClick={() => {
                                                sessionStorage.removeItem('gears-ctm')
                                                navigate('/')
                                            }}
                                        >
                                            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Logout
                                        </a>
                                    </div>
                                </li>

                            </ul>
                        </nav>

                        <div class="container-fluid" style={{marginTop: '6rem'}}>
                            <div className="row" style={{marginBottom: '1.5rem'}}>
                                <h1 style={{whiteSpace: 'nowrap'}} class="h3 mb-0 text-gray-800">{title}</h1>
                            </div>
                            <div className="row">
                                {renderComponent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}