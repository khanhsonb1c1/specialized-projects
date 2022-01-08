import React, {useState} from 'react'
import './style.scss'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs'

const SALT_ROUND = 10;

export default function SignUpForm(props) {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [userFullname, setUserfullname] = useState('')
    const [userPhone, setUserphone] = useState('')
    const [userAge, setUserage] = useState('')
    const [userAddress, setUseraddress] = useState('')

    const [signUpError, setSignUpError] = useState({status: false, error: ''})
    const {actions} = props
    let navigate = useNavigate();

    const customerSignUp = async() => {
       if (password.length < 8 ){
            setSignUpError({status: true, error: 'Mật khẩu cần lớn hơn 8 kí tự'})
        }else{
            setSignUpError({status: false, error: ''})
            const hashPassword = bcrypt.hashSync(password, SALT_ROUND);

            const signUpRes = await axios(`${window.SERVER_HOST}/api/public/signup`, {
                method: 'POST',
                data:{
                    userName,
                    userPassword: hashPassword
                }             
            })

            if ( signUpRes.data.success ){
                sessionStorage.setItem("gears-ctm", JSON.stringify(signUpRes.data.payload));
                navigate('/')
            }else{
                setSignUpError({status: true, error: signUpRes.data.error.message})
            }
            
        }
    }

    const switchLoginPage = () => {
        navigate('/login')
    }

    return (
        <div className="registration-form">
            <form>
                <div className="form-icon">
                    <span><i className="icon icon-user"></i></span>
                </div>
                <h2 style={{textAlign: 'center', fontWeight: 600}}>ĐĂNG KÍ</h2>
                <div className="form-group">
                    <label for="phone-number">Tên đăng nhập</label>
                    <input type="text" 
                            className="form-control item" 
                            id="phone-number" 
                            placeholder="Nhập vào tên đăng nhập" 
                            value={userName}
                            onChange={(event) => setUserName(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input type="password" 
                            className="form-control item" 
                            id="password" 
                            placeholder="Mật khẩu" 
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Tên đầy đủ</label>
                    <input type="text" 
                            className="form-control item" 
                            id="phone-number" 
                            placeholder="Tên" 
                            value={userFullname}
                            onChange={(event) => setUserfullname(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Tuổi</label>
                    <input type="text" 
                            className="form-control item" 
                            id="phone-number" 
                            placeholder="Tuổi" 
                            value={userAge}
                            onChange={(event) => setUserage(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input type="text" 
                            className="form-control item" 
                            id="phone-number" 
                            placeholder="SDT" 
                            value={userPhone}
                            onChange={(event) => setUserphone(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Địa chỉ</label>
                    <input type="text" 
                            className="form-control item" 
                            id="phone-number" 
                            placeholder="Địa chỉ" 
                            value={userAddress}
                            onChange={(event) => setUseraddress(event.target.value)}
                    />
                </div>

                {signUpError.status ? <div style = {{color: 'red', marginLeft: '10px'}}>{signUpError.error}</div> : '' }              
                <div className="form-group">
                    <button type="button" className="btn btn-block create-account" onClick={()=>customerSignUp()}>Tạo tài khoản</button>
                </div>
                <div style = {{float: 'right', cursor: 'pointer', color: 'chocolate', fontSize: '18px', textDecoration: 'underline'}} onClick = {()=>switchLoginPage()}>
                    Đăng nhập
                </div>
            </form>
        </div>
    )
}