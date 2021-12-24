import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Spinner, Form, Badge } from "react-bootstrap";

export default function AdminOrder(props) {
    const [allOrder, setAllOrder] = useState([])
    const [displayErrorModal, setDislayErrorModal] = useState({ status: false, error: '', type: '' })
    const [loadingCategory, setLoadingCategory] = useState(false)

    let adminToken = JSON.parse(sessionStorage.getItem('gears-ctm'))

    const getAllOrder = async () => {
        setLoadingCategory(true)

        const getRes = await axios(`${window.SERVER_HOST}/api/cart/get-order`, {
            method: 'GET',
            headers: {
                'auth-token': adminToken.ctm_tk
            },
        })

        if (getRes.data.success) {
            setAllOrder(getRes.data.payload)
        }

        setLoadingCategory(false)
    }


    useEffect(() => {
        getAllOrder()
    }, [])

    const updateStatus = async (status, orderId) => {
        const updateRes = await axios(`${window.SERVER_HOST}/api/cart/update-order-status`, {
            method: 'PUT',
            data : {
                status,
                orderId
            },
            headers: {
                'auth-token': adminToken.ctm_tk
            },
        })

        if ( updateRes.data.success ){
            const order = [...allOrder]
            const findIndex = order.findIndex((item) => Number(item.order_id) === Number(orderId) )
            if ( findIndex >= 0 ){
                order[findIndex].status = status
            }

            setAllOrder(order)
        }
    }

    const renderTable = allOrder.map((orderItem, orderIndex) => {
        return (
            <tr style={{ cursor: 'pointer' }}>
                <td>
                    {orderIndex + 1}
                </td>
                <td>
                    {orderItem.order_customer}
                </td>

                <td>
                    {orderItem.product.map((productItem, productIndex) => {
                        return (
                            <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '5px'}}>
                                <img style={{ width: '8rem', height: '8rem' }} src={`data:image/png;base64, ${productItem.product_image}`} />
                                <div style={{marginLeft: '30px', width: '250px'}}>
                                    <p style={{fontSize: '1.3em'}}>{productItem.product_name}</p>
                                    <p>SL: {productItem.quality}</p>
                                </div>
                            </div>
                        )
                    })}           
                </td>
                <td>{orderItem.create_date}</td>
                <td>{orderItem.price} vnđ</td>
                <td>{orderItem.order_address}</td>
                <td>{orderItem.oder_phone}</td>
                <td style={{ textAlign: 'center' }}>
                    <div style={{margin: '5px'}}>
                        <Button variant={orderItem.status === 'Xác nhận' ? 'primary' : 'secondary'}>Xác nhận</Button>
                    </div>
                    <div style={{margin: '5px'}}>
                        <Button variant={orderItem.status === 'Vận chuyển' ? 'primary' : 'secondary'}
                            onClick={() => {
                                if ( orderItem.status === 'Xác nhận' ){
                                    updateStatus('Vận chuyển', orderItem.order_id)
                                }else{
                                    setDislayErrorModal({status: true, error: 'Cập nhật trạng thái thất bại', type: 'error'})
                                }
                            }}
                        >Đang vận chuyển</Button>
                    </div>
                    <div style={{margin: '5px'}}>
                        <Button variant={orderItem.status === 'Hoàn thành' ? 'primary' : 'secondary'}
                            onClick={() => {
                                if ( orderItem.status === 'Vận chuyển' ){
                                    updateStatus('Hoàn thành', orderItem.order_id)
                                }else{
                                    setDislayErrorModal({status: true, error: 'Cập nhật trạng thái thất bại', type: 'error'})
                                }
                            }}
                        >Đã nhận hàng</Button>
                    </div>
                </td>
            </tr>
        )
    })

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', overflow: 'scroll' }} className="categoty-table">
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

            {
                loadingCategory ? <Spinner animation="border" variant="primary" /> :
                    allOrder.length ?
                        <Table responsive="sm" striped bordered hover >
                            <thead>
                                <tr style={{ whiteSpace: 'nowrap' }}>
                                    <th>STT</th>
                                    <th>Tên khách hàng</th>
                                    <th>Sản phẩm</th>
                                    <th>Ngày đặt hàng</th>
                                    <th>Tổng đơn hàng</th>
                                    <th>Địa chỉ</th>
                                    <th>SĐT</th>
                                    <th>Trạng thái</th>

                                </tr>
                            </thead>
                            <tbody>
                                {renderTable}
                            </tbody>
                        </Table> : <div style={{ fontWeight: '800' }}>Chưa có thông tin danh mục</div>

            }
        </div>
    )
}