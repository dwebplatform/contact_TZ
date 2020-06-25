import React,{useState} from 'react';
import {NavLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { API_URL} from '../assets';

import '../styles.css';

export const Login=()=>{
    const [formData, setFormData] = useState({
        email:'',
        password:'',
    });
    const dispatch = useDispatch();
    const isLogin = useSelector(state=>state.isLogin);
    const onHandleChange=(e)=>{
            let name = e.target.name;
            let val = e.target.value;
            setFormData({
                ...formData,
                [name]:val
            })
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        fetch(`${API_URL}/login`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(formData)
        }).then(res=>{
            return res.json()})
        .then((data)=>{
            if(!data.error){
                dispatch({
                    type:"LOGIN",
                    value: data.token
                });
            }
    })
    }
    return <div className="container-login-form">
        {
            isLogin && <div className="login-info">
                <h3>Поздравляем !!!</h3>
                Вы зарегистрированы можете перейти к списку пользователей
                <NavLink to="/"><button style={{
                    width:'200px',
                    margin:'10px auto 10px 0',
                    alignSelf:'flex-start'
                }} className="btn btn-dark"> Перейти к контактам</button>
                </NavLink>
            </div>
        }
        {
            !isLogin &&  <form className="login-form"
            onSubmit={(e)=>handleSubmit(e)}
        >
            <div className="form-group">
            <label htmlFor="exampleInputEmail1">Введите Email:</label>
            <input type="email" className="form-control"
            name="email"
            value={formData.email}
            onChange={onHandleChange}
            aria-describedby="emailHelp" 
            placeholder="Enter email"/>
        <small className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group">
        <label htmlFor="exampleInputEmail1">Введите пароль</label>
            <input  
                    type="password" 
                    name="password" 
                    value={formData.password}
                    onChange={onHandleChange}
                    className="form-control"   aria-describedby="emailHelp" 
                    placeholder="Enter password"/>
        <small  
        className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group"
            style={{
                display:'flex',
                width:'100%',
                justifyContent:'flex-start'
            }}
        >
        <button 
                style={{
                    width:'200px'   
                }}
                type="submit"
                className="btn btn-primary">Войти</button>
        </div>
    </form>
        }
       
</div>
}