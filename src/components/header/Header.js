import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setLimit } from "../../reducers/Limit";
import { setAccessToken } from '../../reducers/AccessToken';
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import styles from './Header.module.css';
import axios from "axios";
import { LOGININFO_URL } from "../../API/Api";

const Header = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [active, setActive] = useState(false)
    const [signedIn, setSignedIn] = useContext(MyContext);
    const Limit = useSelector((state) => state.Limit.value);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const signOut = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('histograms')
        localStorage.removeItem('Find')
        setSignedIn(false)
        dispatch(setAccessToken(''))
    }

    const dataRequest = async () => {
        if (localStorage.getItem('accessToken')) {
            const result = await axios.get(LOGININFO_URL, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken')).accessToken}`,
                'accept': 'application/json'
            }})
            let dataResponse 
            if (result) {
                dataResponse = {
                    Limit: result.data.eventFiltersInfo.Limit,
                    usedCompanyCount: result.data.eventFiltersInfo.usedCompanyCount
                  }
            } else {
                dataResponse = false
            }
            return dataResponse
        }
    }

    const setData = async () => {
        let result = await dataRequest()
        if (result) {
            dispatch(setLimit(result))
        }  
      }

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) return 
        else {
            setData()
        }
    }, [])

    useEffect(() => {
        const changeSizeWin = () => {
            setWindowWidth(window.innerWidth)
        } 
        window.addEventListener('resize', changeSizeWin)

        return () => {
            window.removeEventListener('resize', changeSizeWin)
        }
    }, [])

    const infoLimit = () => {
        if (Limit && windowWidth > 1000) {
             return (
            <div className={styles.rectangle}>
                    <div className={styles.rectangle_left}>
                        <h6 className={styles.rectangle_text}>Использовано компаний</h6>
                        <h6 className={styles.rectangle_text}>Лимит по компаниям</h6>        
                    </div>    
                    <div className={styles.rectangle_right}>
                        <h6 className={styles.rectangle_number}>{Limit.usedCompanyCount}</h6>
                        <h6 className={styles.rectangle_number}>{Limit.Limit}</h6>    
                    </div>
            </div>
        )
        } else if (Limit) {
            return (
               <div className={styles.info} style={active ? {display: 'none'} : {}}>
                    <div className={styles.rectangle_top}>
                        <h6 className={styles.rectangle_text}>Использовано компаний</h6>
                        <h6 className={styles.rectangle_number_black}>{Limit.usedCompanyCount}</h6>
                    </div>    
                    <div className={styles.rectangle_bottom}>
                        <h6 className={styles.rectangle_text}>Лимит по компаниям</h6>  
                        <h6 className={styles.rectangle_number}>{Limit.Limit}</h6>    
                    </div>
            </div> 
            )
        } else {
            return (
                <div className={`${styles.rectangle_loading} ${styles.info}`}>
                    <div className={styles.rectangle_background} style={windowWidth > 1000 ? {
                    backgroundImage: 'url(/Logo/Header/loader.svg)'
                } : {
                    backgroundImage: 'url(/Logo/Header/loader.svg)',
                    left: '40%',
                    top: '34%'
                }}></div>
                </div>
            )
    }}

    const Stripes = () => {
        if (active) {
            setActive(false)
        } else {
           setActive(true) 
        }   
    }

    useEffect(() => {
        if (windowWidth > 1000) {
            setActive(false)
        }
    }, [windowWidth])

    const hiddenMenu = () => {
        return (
            <div className={styles.hidden_menu}>
                <nav className={styles.hidden_nav}>
                    <ul className={styles.hidden_list}>
                    <li className={styles.hidden_item}>
                        <Link className={styles.hidden_link} to={'/'}>Главная</Link>
                    </li>
                    <li className={styles.hidden_item}>
                        <a className={styles.hidden_link} href=" ">Тарифы</a>
                    </li>
                    <li className={styles.hidden_item}>
                        <a className={styles.hidden_link} href=" ">FAQ</a>
                    </li>
                    </ul>
                </nav>
                <a style={signedIn ? {display: 'none'} : {}} className={styles.hidden_registration} href=" ">Зарегистрироваться</a>
                <div onClick={signOut} style={!signedIn ? {display: 'none'} : {}} className={styles.hidden_registration}>Выйти</div>
                <button style={signedIn ? {display: 'none'} : {}} className={styles.hidden_btn} onClick={() => navigate('/login')}>Войти</button>
            </div>
        )
    }

    return (
        <header className={styles.header} style={active ? {backgroundColor: '#029491'} : {}}>
            <div className={styles.header_container}>
            <Link to={'/'}>
            <img className={styles.logo} src={active ? "/Logo/Header/scan_logo.svg" : "/Logo/Header/scan_logo_2.svg"} alt="scan_logo" style={active ? {marginTop: '10px'} : {}}/>
            </Link>
            <nav className={styles.nav}>
                <ul className={styles.nav_list}>
                    <li className={styles.nav_item}>
                        <Link className={styles.nav_link} to={'/'}>Главная</Link>
                    </li>
                    <li className={styles.nav_item}>
                        <a className={styles.nav_link} href=" ">Тарифы</a>
                    </li>
                    <li className={styles.nav_item}>
                        <a className={styles.nav_link} href=" ">FAQ</a>
                    </li>
                </ul>
            </nav>
            {!signedIn ? 
            <div className={styles.not_signed} style={windowWidth > 1000 ? {display: 'block'} : {display: 'none'}}>
                <a className={styles.registration} href=" ">Зарегистрироваться</a>
                <button className={styles.in_btn} onClick={() => navigate('/Login')}>Войти</button>
            </div>   
            : 
            <div className={styles.signed}>
                {infoLimit()}
                <div className={styles.user}>
                    <div className={styles.user_left}>
                       <h6 className={styles.user_name}>Алексей А.</h6>  
                       <button onClick={signOut} className={styles.out_btn}>Выйти</button>
                    </div>
                    <img className={styles.userpic} src="/Logo/Header/dwarf.png" alt="user"/>
                </div>
            </div>    
            }
            <div onClick={Stripes} className={styles.stripes_logo} style={windowWidth > 1000 ? {display: 'none'} : active ? {backgroundImage: 'url(/Logo/Header/cross.svg)'} : {backgroundImage: 'url(/Logo/Header/stripes.svg)'}}></div>
            </div>
            {active ? hiddenMenu() : null}
        </header>
    )
}

export default Header;