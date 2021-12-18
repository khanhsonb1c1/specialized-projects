import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Spinner, Form } from "react-bootstrap";
import axios from "axios";
import './style.scss'

export default function ListProduct(props) {
    const [allProduct, setAllProduct] = useState([])
    const [allCategory, setAllCategory] = useState([])
    const [selectCategory, setSelectCategory] = useState('null')
    const [displayErrorModal, setDislayErrorModal] = useState({ status: false, error: '', type: '' })
    const [loadingProduct, setLoadingProduct] = useState(false)
    const [openAddProductModal, setOpenAddProductModal] = useState(false)

    const [openUpdateProductModal, setOpenUpdateProductModal] = useState(false)
    const [productUpdate, setProductUpdate] = useState({})
    const [updateProductError, setUpdateProductError] = useState({ status: false, error: '' })
    const [updateProductLoading, setUpdateProductLoading] = useState(false)

    let adminToken = JSON.parse(sessionStorage.getItem('gears-ctm'))
    const { actions } = props

    const getAllProduct = async () => {
        setLoadingProduct(true)
        const getRes = await axios(`${window.SERVER_HOST}/api/public/get-product`, {
            method: 'GET',
        })

        if (getRes.data.success) {
            setAllProduct(getRes.data.payload)
        }
        setLoadingProduct(false)
    }

    const getAllCategory = async () => {
        const getRes = await axios(`${window.SERVER_HOST}/api/public/get-category`, {
            method: 'GET',
        })

        if (getRes.data.success) {
            setAllCategory(getRes.data.payload)
            if (getRes.data.payload.length) {
                setSelectCategory(getRes.data.payload[0].category_id)
            }
        }
    }

    useEffect(() => {
        setAllCategory(props.category)
    }, [props.category])


    useEffect(() => {
        getAllCategory()
        getAllProduct()
    }, [])

    const deleteProduct = async (productId) => {
        const deleteRes = await axios(`${window.SERVER_HOST}/api/product/delete-product/${productId}`, {
            method: 'DELETE',
            headers: {
                'auth-token': adminToken.ctm_tk
            },
        })

        if (deleteRes.data.success) {
            const product = [...allProduct].filter((item) => Number(item.product_id) !== Number(productId))
            setAllProduct(product)
            setDislayErrorModal({ status: true, error: 'Xóa thông tin sản phẩm thành công', type: 'success' })
        } else {
            setDislayErrorModal({ status: true, error: 'Xóa thông tin sản phẩm thất bại', type: 'error' })
        }
    }

    const updateProductInfo = async () => {
        if (!productUpdate.product_name.length) {
            setUpdateProductError({ status: true, error: 'Tên sản phẩm không được bỏ trống' })
        } else if (productUpdate.category_id === 'null') {
            setUpdateProductError({ status: true, error: 'Cần lựa chọn tên danh mục' })
        } else {
            setUpdateProductLoading(true)
            const findIndex = allProduct.findIndex((item) => item.product_id === productUpdate.product_id )

            const updateData = {
                category_id: Number(productUpdate.category_id),
                product_name: productUpdate.product_name,
                product_image: productUpdate.product_image && productUpdate.product_image.length ? productUpdate.product_image : allProduct[findIndex].product_image,
                product_price: productUpdate.product_price,
                product_sale_price: productUpdate.product_sale_price,
                product_description: productUpdate.product_description,
                product_id: productUpdate.product_id,
            }

            const updateRes = await axios(`${window.SERVER_HOST}/api/product/update-product`, {
                method: 'PUT',
                data: updateData,
                headers: {
                    'auth-token': adminToken.ctm_tk
                },
            })

            if (updateRes.data.success) {
                const product = [...allProduct]
                product[findIndex] = Object.assign({}, updateData)
                setAllProduct(product)
                setOpenUpdateProductModal(false)
                setProductUpdate({})

            }else{
                setUpdateProductError({ status: true, error: updateRes.data.error.message })
            }

            setUpdateProductLoading(false)
        }
    }


    const renderTable = allProduct.filter((item) => item.category_id === Number(selectCategory)).map((productItem, productIndex) => {
        return (
            <tr style={{ cursor: 'pointer' }}>
                <td>
                    {productIndex + 1}
                </td>
                <td>
                    <img style={{ width: '8rem', height: '8rem' }} src={`data:image/png;base64, ${productItem.product_image}`} />
                </td>
                <td>{productItem.product_name}</td>
                <td>{productItem.product_price}</td>
                <td>{productItem.product_sale_price}</td>
                <td style={{ textAlign: 'center' }}>
                    <Button variant="danger" onClick={() => deleteProduct(productItem.product_id)}>Xóa</Button>
                    <Button
                        onClick={() => {
                            setOpenUpdateProductModal(true)
                            setProductUpdate({
                                category_id: productItem.category_id,
                                product_name: productItem.product_name,
                                product_image: '',
                                product_price: productItem.product_price,
                                product_sale_price: productItem.product_sale_price,
                                product_description: productItem.product_description,
                                product_id: productItem.product_id,
                            })
                        }}
                    >Sửa</Button>
                </td>
            </tr>
        )
    })

    return (
        <div className="list-product">
            <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                <h5>Sản phẩm</h5>
                <Button onClick={() => setOpenAddProductModal(true)}>Thêm</Button>
            </div>
            <div style={{ width: '100%', marginTop: '20px' }}>
                <Form.Select value={selectCategory}
                    onChange={(event) => {
                        setSelectCategory(event.target.value)
                    }}
                >
                    <option value="null">Danh mục</option>
                    {allCategory.map((categoryItem, categoryIndex) => {
                        return <option value={categoryItem.category_id} >{categoryItem.category_name}</option>
                    })}
                </Form.Select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: '20px' }} className="product-table">
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

                {openUpdateProductModal ?
                    <Modal show={openUpdateProductModal}
                        size="md"
                        centered
                        animation={false}
                        onHide={() => setOpenUpdateProductModal(false)}
                        aria-labelledby="example-modal-sizes-title-sm"
                    >
                        <Modal.Header>
                            <Modal.Title>Thêm sản phẩm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <div style={{ marginBottom: '20px', width: '100%' }}>
                                    <Form.Select style={{ width: '100%' }}
                                        value={productUpdate.category_id}
                                        onChange={(event) => {
                                            setProductUpdate({
                                                ...productUpdate,
                                                category_id: event.target.value
                                            })
                                        }}
                                    >
                                        <option value="null">Danh mục</option>
                                        {allCategory.map((categoryItem, categoryIndex) => {
                                            return <option value={categoryItem.category_id} >{categoryItem.category_name}</option>
                                        })}
                                    </Form.Select>
                                </div>

                                <Form.Group className="mb-3">
                                    <Form.Label>Tên sản phẩm</Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Nhập vào tên sản phẩm"
                                        value={productUpdate.product_name}
                                        onChange={(event) => {
                                            setProductUpdate({
                                                ...productUpdate,
                                                product_name: event.target.value
                                            })
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Giá sản phẩm</Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Nhập vào giá sản phẩm"
                                        value={productUpdate.product_price}
                                        onChange={(event) => {
                                            setProductUpdate({
                                                ...productUpdate,
                                                product_price: event.target.value
                                            })
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Giá giảm</Form.Label>
                                    <Form.Control type="text"
                                        value={productUpdate.product_sale_price}
                                        onChange={(event) => {
                                            setProductUpdate({
                                                ...productUpdate,
                                                product_sale_price: event.target.value
                                            })
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Mô tả sản phẩm</Form.Label>
                                    <Form.Control as="textarea"
                                        rows={3}
                                        value={productUpdate.product_description}
                                        onChange={(event) => {
                                            setProductUpdate({
                                                ...productUpdate,
                                                product_description: event.target.value
                                            })
                                        }}
                                    />
                                    <Form.Text className="text-muted">
                                        Mỗi tính năng cách nhau bởi dấu '.'
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Hình ảnh sản phẩm</Form.Label>
                                    <Form.Control type="file"
                                        onChange={(event) => {
                                            let reader = new FileReader();
                                            reader.readAsDataURL(event.target.files[0]);
                                            if (event.target.files[0]) {
                                                reader.onload = function () {
                                                    setProductUpdate({
                                                        ...productUpdate,
                                                        product_image: reader.result.replace(/^data:[a-z]+\/[a-z\-]+;base64,/, "")
                                                    })
                                                };

                                                reader.onerror = function (error) {
                                                    console.log('Error: ', error);
                                                };
                                            }
                                        }}
                                    />
                                </Form.Group>

                                {updateProductError.status ?
                                    <div style={{ color: 'red' }}>{updateProductError.error}</div> : ''
                                }
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setOpenUpdateProductModal(false)}>Đóng</Button>
                            <Button variant="primary" onClick={() => updateProductInfo()} disabled={updateProductLoading}>
                                {!updateProductLoading ?
                                    'Lưu' :
                                    <Spinner animation="border" variant="light" />
                                }
                            </Button>
                        </Modal.Footer>
                    </Modal> : ''
                }

                {openAddProductModal ?
                    <AddProductModal showModal={openAddProductModal}
                        hideModal={() => setOpenAddProductModal(false)}
                        allCategory={allCategory}
                        addProduct={(newProduct) => {
                            const product = [...allProduct]
                            product.push(newProduct)
                            setAllProduct(product)
                        }}
                    /> : ''
                }

                {
                    loadingProduct ? <Spinner animation="border" variant="primary" /> :
                        allProduct.length ?
                            <Table responsive="sm" striped bordered hover >
                                <thead>
                                    <tr style={{ whiteSpace: 'nowrap' }}>
                                        <th>STT</th>
                                        <th>Ảnh sản phẩm</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Giá khuyến mãi</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTable}
                                </tbody>
                            </Table> : <div style={{ fontWeight: '800' }}>Chưa có thông tin sản phẩm</div>
                }
            </div>
        </div>
    );
}

const AddProductModal = (props) => {
    const [productName, setProductName] = useState('')
    const [productImage, setProductImage] = useState('')
    const [productCategory, setProductCategory] = useState('null')
    const [productDescription, setProductDescription] = useState('')
    const [productPrice, setProductPrice] = useState(0)
    const [productSalePrice, setProductSalePrice] = useState(0)
    const [addProductError, setAddProductError] = useState({ status: false, error: '' })
    const [addProductLoading, setAddProductLoading] = useState(false)

    let adminToken = JSON.parse(sessionStorage.getItem('gears-ctm'))

    const addNewProduct = async () => {
        if (!props.allCategory.length) {
            setAddProductError({ status: true, error: 'Không thể thêm sản phẩm do chưa tạo danh mục' })
        } else if (!productName.length) {
            setAddProductError({ status: true, error: 'Tên sản phẩm không được bỏ trống' })
        } else if (productCategory === 'null') {
            setAddProductError({ status: true, error: 'Cần lựa chọn tên danh mục' })
        } else {
            setAddProductError({ status: false, error: '' })
            setAddProductLoading(true)
            const formData = new FormData();
            formData.append('productName', productName)
            formData.append('productImage', productImage)
            formData.append('productCategory', productCategory)
            formData.append('productDescription', productDescription)
            formData.append('productPrice', productPrice)
            formData.append('productSalePrice', productSalePrice)

            const addProduct = await axios(`${window.SERVER_HOST}/api/product/add-product`, {
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=something',
                    'auth-token': adminToken.ctm_tk
                }
            })

            if (addProduct.data.success) {
                props.hideModal()
                props.addProduct({
                    product_id: addProduct.data.payload.productId,
                    category_id: Number(productCategory),
                    product_name: productName,
                    product_image: addProduct.data.payload.productImage,
                    product_description: productDescription,
                    product_price: Number(productPrice),
                    product_sale_price: Number(productSalePrice),
                    product_create_date: addProduct.data.payload.createDate
                })
            } else {
                setAddProductError({ status: true, error: addProduct.data.error.message })
            }

            setAddProductLoading(false)
        }

    }

    return (
        <Modal show={props.showModal}
            size="md"
            centered
            animation={false}
            onHide={() => props.hideModal()}
            aria-labelledby="example-modal-sizes-title-sm"
        >
            <Modal.Header>
                <Modal.Title>Thêm danh mục</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                        <Form.Select style={{ width: '100%' }}
                            value={productCategory}
                            onChange={(event) => {
                                setProductCategory(event.target.value)
                            }}
                        >
                            <option value="null">Danh mục</option>
                            {props.allCategory.map((categoryItem, categoryIndex) => {
                                return <option value={categoryItem.category_id} >{categoryItem.category_name}</option>
                            })}
                        </Form.Select>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control type="text"
                            placeholder="Nhập vào tên sản phẩm"
                            value={productName}
                            onChange={(event) => {
                                setProductName(event.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Giá sản phẩm</Form.Label>
                        <Form.Control type="text"
                            placeholder="Nhập vào giá sản phẩm"
                            value={productPrice}
                            onChange={(event) => {
                                setProductPrice(event.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Giá giảm</Form.Label>
                        <Form.Control type="text"
                            value={productSalePrice}
                            onChange={(event) => {
                                setProductSalePrice(event.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả sản phẩm</Form.Label>
                        <Form.Control as="textarea"
                            rows={3}
                            value={productDescription}
                            onChange={(event) => {
                                setProductDescription(event.target.value)
                            }}
                        />
                        <Form.Text className="text-muted">
                            Mỗi tính năng cách nhau bởi dấu '.'
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hình ảnh sản phẩm</Form.Label>
                        <Form.Control type="file"
                            onChange={(event) => {
                                setProductImage(event.target.files[0])
                            }}
                        />
                    </Form.Group>

                    {addProductError.status ?
                        <div style={{ color: 'red' }}>{addProductError.error}</div> : ''
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.hideModal()}>Đóng</Button>
                <Button variant="primary" onClick={() => addNewProduct()} disabled={addProductLoading}>
                    {!addProductLoading ?
                        'Lưu' :
                        <Spinner animation="border" variant="light" />
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
