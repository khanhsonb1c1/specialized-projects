import React, { useState } from 'react'
import './style.scss'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function LoginForm(props) {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState({ status: false, error: '' })
    const {actions} = props
    let navigate = useNavigate();

    const loginWeb = async () => {
        if (!userName.length) {
            setLoginError({ status: true, error: 'Tên đăng nhập không được bỏ trống' })
        } else {
            setLoginError({ status: false, error: '' })

            const loginRes = await axios(`${window.SERVER_HOST}/api/public/login`, {
                method: 'POST',
                data: {
                    userName,
                    userPassword: password
                }
            })

            if ( loginRes.data.success ){
                const role = loginRes.data.payload.ctm_rl
                sessionStorage.setItem("gears-ctm", JSON.stringify(loginRes.data.payload));
                if ( role === 'a' ){
                    navigate('/admin')  
                }else {
                    navigate('/')  
                }
                    
            }else{
                setLoginError({ status: true, error: loginRes.data.error.message })
            }
        }
    }

    const switchSignUpPage = async () => {
        navigate('/signup')
    }

    return (
        <div className="login-form web-login">
            <form>
                <div className="form-icon">
                    <span><i className="icon icon-user"></i></span>
                </div>
                <h2 style={{textAlign: 'center', fontWeight: 600}}>ĐĂNG NHẬP</h2>
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
                    <label for="password">Mật khẩu</label>
                    <input type="password"
                        className="form-control item"
                        id="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                {loginError.status ? <div style = {{color: 'red', marginLeft: '10px'}}>{loginError.error}</div> : '' }        
                <div className="form-group" onClick={() => loginWeb()}>
                    <button type="button" className="btn btn-block create-account">Đăng nhập</button>
                </div>
                <div style = {{display: 'flex', float: 'right'}}>
                    <div style = {{marginRight: '30px', cursor: 'pointer', color: 'chocolate', fontSize: '18px', textDecoration: 'underline'}} onClick = {()=>switchSignUpPage()}>Đăng kí</div>
                </div>
            </form>
        </div>
    )
}