import React from 'react';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MyContext } from '../../App';
import { setAccessToken } from '../../reducers/AccessToken';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import styles from './Login.module.css'
import { useNavigate } from 'react-router-dom';
import { LOGIN_URL } from '../../API/Api';

const Login = () => {
  const[signedIn,setSignedIn] = useContext(MyContext);
  const accessToken = useSelector((state) => state.accessToken.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [verifyLog, setVerifyLog] = useState();
  const [verifyPass, setVerifyPass] = useState();
  const [error, setError] = useState();

  const verification = () => {
    const regexNumber = /^[\d\+][\d\(\)\ -]{4,14}\d$/
    const matchNumber = regexNumber.exec(login)
    const regexLogin = /sf_student[0-9]/
    const matchLogin = regexLogin.exec(login)

    if (matchNumber || matchLogin) {
      setVerifyLog(true)
    } else {
      setVerifyLog(false)
    }
    if (password) {
      setVerifyPass(true)
    } else {
      setVerifyPass(false)
    }
  }

  useEffect(() => {
    verification()
  }, [login, password])

  useEffect(() => {
    if (error) {
      setError(false)
    }
  }, [password, login])

  const myRequest = async (e) => {
    const result = await axios.post(LOGIN_URL, {
      'login': login,
      'password': password
    }, {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .catch(err => {})
    let dataResponse
    if (result) {
      dataResponse = {
      accessToken: result.data.accessToken,
      expire: result.data.expire
    }
    } else {
      dataResponse = false
    }
    return dataResponse 
  }
 
  const setData = async () => {
    let result = await myRequest()
    if (!result) {
      setError(true)
    } else {
       dispatch(setAccessToken(result))
       navigate('/')     
    }   
  }
   

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', JSON.stringify(accessToken))
      setSignedIn(true)
    }
  }, [accessToken])

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <div className={styles.personskey} style={{
          backgroundImage: "url(/Logo/Login/person_skey.svg)"
        }}></div>
        <div className={styles.lock} style={{backgroundImage: "url(/Logo/Login/lock.svg)"}}></div>
        <h1 className={styles.title}>Для оформления подписки на тариф, необходимо авторизоваться.</h1>
        <form className={styles.form} action="POST">
          <a className={styles.link_login} href=" ">Войти</a>
          <a className={styles.link_registration} href=" ">Зарегистрироваться</a>
          <label className={styles.label} htmlFor="Login">Логин или номер телефона:</label>
          <input className={styles.input} type="text" name='Login' id='Login' onInput={e => {
                            setLogin(e.target.value)
                        }}
                        style={login && !verifyLog || error ? { 
                          border: '1px solid #FF5959',
                          boxShadow: '0px 0px 20px 0px rgba(255, 89, 89, 0.20)',
                          color: '#FF5959'
                        } : {}} />
          <div className={styles.login_error} style={login && !verifyLog ? {display: 'block'} : {}}>Введите корректные данные</div>            
          <label className={styles.label} htmlFor="password">Пароль:</label>
          <input className={styles.input} type="password" name='password' id='password' onInput={e => {
                            setPassword(e.target.value)
                        }}
                        style={error ? {
                          border: '1px solid #FF5959',
                          boxShadow: '0px 0px 20px 0px rgba(255, 89, 89, 0.20)',
                          color: '#FF5959'
                        } 
                        : {}}/>
          <div className={styles.password_error} style={error ? {display: 'block'} : {}}>Неправильный пароль или логин</div>            
          <button type='button' onClick={setData} className={styles.in_btn} disabled={!verifyLog || !verifyPass || error}>Войти</button>
          <a className={styles.password} href=" ">Восстановить пароль</a>
          <p className={styles.text}>Войти через:</p>
          <div className={styles.btns}>
            <a href=" " className={styles.goofaceya}>
              <img className={styles.goofaceya_logo} src="/Logo/login/google.svg" alt="google" />
            </a>
            <a href=" " className={styles.goofaceya}>
              <img className={styles.goofaceya_logo} src="/Logo/Login/facebook.svg" alt="facebook" />
            </a>
            <a href=" " className={styles.goofaceya}>
              <img className={styles.goofaceya_logo} src="/Logo/Login/yandex.svg" alt="yandex" />
            </a>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}

export default Login;