import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Spinner, Form } from "react-bootstrap";
import axios from "axios";
import './style.scss';

export default function ListCategory(props) {
    const [allCategory, setAllCategory] = useState([])
    const [displayErrorModal, setDislayErrorModal] = useState({ status: false, error: '', type: '' })
    const [loadingCategory, setLoadingCategory] = useState(false)
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false)
    const [openUpdateCategoryModal, setOpenUpdateCategoryModal] = useState(false)
    const [categoryUpdate, setCategoryUpdate] = useState({})
    const [updateCategoryError, setUpdateCategoryError] = useState({ status: false, error: '' })
    const [updateCategoryLoading, setUpdateCategoryLoading] = useState(false)

    let adminToken = JSON.parse(sessionStorage.getItem('gears-ctm'))
    const { actions } = props

    const getAllCategory = async () => {
        setLoadingCategory(true)
        const getRes = await axios(`${window.SERVER_HOST}/api/public/get-category`, {
            method: 'GET',
        })

        if (getRes.data.success) {
            setAllCategory(getRes.data.payload)
            props.setCategory(getRes.data.payload)
        }
        setLoadingCategory(false)
    }

    useEffect(() => {
        getAllCategory()
    }, [])

    const deleteCategory = async (categoryId) => {
        const deleteRes = await axios(`${window.SERVER_HOST}/api/product/delete-category/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'auth-token': adminToken.ctm_tk
            },
        })

        if (deleteRes.data.success) {
            const category = [...allCategory].filter((item) => item.category_id !== categoryId)
            setAllCategory(category)
            props.setCategory(category)
            setDislayErrorModal({ status: true, error: 'Xóa thông tin danh mục thành công', type: 'success' })
        } else {
            setDislayErrorModal({ status: true, error: 'Xóa thông tin danh mục thất bại', type: 'error' })
        }
    }

    const updateCategory = async () => {
        if (categoryUpdate.category_name) {
            if (!categoryUpdate.category_name.length) {
                setUpdateCategoryError({ status: false, error: 'Tên danh mục không được bỏ trống' })
            } else {
                setUpdateCategoryLoading(true)

                const updateData = {
                    category_name: categoryUpdate.category_name,
                    category_image: categoryUpdate.category_image && categoryUpdate.category_image.length ? categoryUpdate.category_image : allCategory[categoryUpdate.category_index].category_image,
                    category_id: categoryUpdate.category_id
                }
                
                const updateRes = await axios(`${window.SERVER_HOST}/api/product/update-category`, {
                    method: 'PUT',
                    data: updateData,
                    headers: {
                        'auth-token': adminToken.ctm_tk
                    },
                })

                if ( updateRes.data.success ){
                    const category = [...allCategory]
                    category[categoryUpdate.category_index] = Object.assign({}, updateData)
                    setAllCategory(category)
                    props.setCategory(category)
                    setOpenUpdateCategoryModal(false)
                    setCategoryUpdate({})
                }else{
                    setUpdateCategoryError({ status: false, error: updateRes.data.error.message })
                }

                setUpdateCategoryLoading(false)
            }
        }
    }

    const renderTable = allCategory.map((categoryItem, categoryIndex) => {
        return (
            <tr style={{ cursor: 'pointer' }}>
                <td>
                    {categoryIndex + 1}
                </td>
                <td>
                    <img style={{ width: '8rem', height: '8rem' }} src={`data:image/png;base64, ${categoryItem.category_image}`} />
                </td>
                <td>{categoryItem.category_name}</td>
                <td style={{ textAlign: 'center' }}>
                    <Button variant="danger" onClick={() => deleteCategory(categoryItem.category_id)}>Xóa</Button>
                    <Button onClick={() => {
                        setOpenUpdateCategoryModal(true)
                        setCategoryUpdate({
                            category_name: categoryItem.category_name,
                            category_image: '',
                            category_id: categoryItem.category_id,
                            category_index: categoryIndex
                        })
                    }}>Sửa</Button>
                </td>
            </tr>
        )
    })

    return (
        <div>
            {openAddCategoryModal ?
                <AddCategoryModal showModal={openAddCategoryModal}
                    hideModal={() => setOpenAddCategoryModal(false)}
                    addCategory={(data) => {
                        const { categoryName, categoryImage, categoryId } = data
                        const newData = {
                            category_id: categoryId,
                            category_name: categoryName,
                            category_image: categoryImage
                        }

                        const category = [...allCategory]
                        category.push(newData)
                        setAllCategory(category)
                        props.setCategory(category)
                    }}
                /> : ''
            }

            {openUpdateCategoryModal ?
                <Modal show={openUpdateCategoryModal}
                    size="md"
                    centered
                    animation={false}
                    onHide={() => setOpenUpdateCategoryModal(false)}
                    aria-labelledby="example-modal-sizes-title-sm"
                >
                    <Modal.Header>
                        <Modal.Title>Sửa danh mục</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên danh mục</Form.Label>
                                <Form.Control type="text"
                                    placeholder="Nhập vào tên danh mục sản phẩm"
                                    value={categoryUpdate.category_name ? categoryUpdate.category_name : ''}
                                    onChange={(event) => {
                                        setCategoryUpdate({
                                            ...categoryUpdate,
                                            category_name: event.target.value
                                        })
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Hình ảnh danh mục</Form.Label>
                                <Form.Control type="file"
                                    onChange={(event) => {
                                        let reader = new FileReader();
                                        reader.readAsDataURL(event.target.files[0]);
                                        if (event.target.files[0]) {
                                            reader.onload = function () {
                                                setCategoryUpdate({
                                                    ...categoryUpdate,
                                                    category_image: reader.result.replace(/^data:[a-z]+\/[a-z\-]+;base64,/, "")
                                                })
                                            };

                                            reader.onerror = function (error) {
                                                console.log('Error: ', error);
                                            };
                                        }
                                    }}
                                />
                            </Form.Group>

                            {updateCategoryError.status ?
                                <div style={{ color: 'red' }}>{updateCategoryError.error}</div> : ''
                            }
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setOpenUpdateCategoryModal(false)}>Đóng</Button>
                        <Button variant="primary"
                            onClick={() => updateCategory()}
                            disabled={updateCategoryLoading}
                        >
                            {!updateCategoryLoading ?
                                'Lưu' :
                                <Spinner animation="border" variant="light" />
                            }
                        </Button>
                    </Modal.Footer>
                </Modal> : ''
            }


            <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                <h5>Danh mục</h5>
                <Button onClick={() => setOpenAddCategoryModal(true)}>Thêm</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }} className="categoty-table">
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
                        allCategory.length ?
                            <Table responsive="sm" striped bordered hover >
                                <thead>
                                    <tr style={{ whiteSpace: 'nowrap' }}>
                                        <th>STT</th>
                                        <th>Ảnh danh mục</th>
                                        <th>Tên danh mục</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTable}
                                </tbody>
                            </Table> : <div style={{ fontWeight: '800' }}>Chưa có thông tin danh mục</div>

                }
            </div>
        </div>
    );
}

const AddCategoryModal = (props) => {
    const [categoryName, setCategoryName] = useState('')
    const [categoryImage, setCategoryImage] = useState()
    const [addCategoryError, setAddCategoryError] = useState({ status: false, error: '' })
    const [addCategoryLoading, setAddCategoryLoading] = useState(false)

    let adminToken = JSON.parse(sessionStorage.getItem('gears-ctm'))

    const addNewCategory = async () => {
        if (!categoryName.length) {
            setAddCategoryError({ status: true, error: 'Tên danh mục không được bỏ trống' })
        } else {
            setAddCategoryError({ status: false, error: '' })
            setAddCategoryLoading(true)
            const formData = new FormData();
            formData.append('categoryName', categoryName)
            formData.append('categoryImage', categoryImage)

            const addCategory = await axios(`${window.SERVER_HOST}/api/product/add-category`, {
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=something',
                    'auth-token': adminToken.ctm_tk
                }
            })

            if (addCategory.data.success) {
                props.hideModal()
                props.addCategory({
                    categoryName,
                    categoryImage: addCategory.data.payload.categoryImage,
                    categoryId: addCategory.data.payload.categoryId
                })
            } else {
                setAddCategoryError({ status: true, error: addCategory.data.error.message })
            }

            setAddCategoryLoading(false)
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
                    <Form.Group className="mb-3">
                        <Form.Label>Tên danh mục</Form.Label>
                        <Form.Control type="text"
                            placeholder="Nhập vào danh mục sản phẩm"
                            value={categoryName}
                            onChange={(event) => {
                                setCategoryName(event.target.value)
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Hình ảnh danh mục</Form.Label>
                        <Form.Control type="file"
                            onChange={(event) => {
                                setCategoryImage(event.target.files[0])
                            }}
                        />
                    </Form.Group>

                    {addCategoryError.status ?
                        <div style={{ color: 'red' }}>{addCategoryError.error}</div> : ''
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.hideModal()}>Đóng</Button>
                <Button variant="primary" onClick={() => addNewCategory()} disabled={addCategoryLoading}>
                    {!addCategoryLoading ?
                        'Lưu' :
                        <Spinner animation="border" variant="light" />
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
