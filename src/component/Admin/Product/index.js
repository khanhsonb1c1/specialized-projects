import React, {useEffect, useState} from 'react'
import ListCategory from './ListCategory'
import ListProduct from './ListProduct'

export default function Product(props) {
    const [allCategory, setAllCategory] = useState([])

    return (
        <div style={{width: '100%', overflow: 'scroll'}}>
            <div>
                <ListCategory {...props} 
                    setCategory={(category) => {
                        setAllCategory(category)
                    }}
                />
            </div>

            <div style={{marginTop: '50px'}}>
                <ListProduct {...props} category = {allCategory}/>
            </div>
        </div>
    )
}