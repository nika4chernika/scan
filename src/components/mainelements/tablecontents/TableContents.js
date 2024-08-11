import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "../../../App";
import styles from './TableContents.module.css'
import { useNavigate } from "react-router-dom";


const TableContents = () => {
    const [signedIn, setSignedIn] = useContext(MyContext);
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const changeSizeWin = () => {
            setWindowWidth(window.innerWidth)
        } 
        window.addEventListener('resize', changeSizeWin)

        return () => {
            window.removeEventListener('resize', changeSizeWin)
        }
    }, [])

    return (
        <section className={styles.tablecontents}>
                <h1 className={styles.title}>сервис по поиску <br/> публикаций <br/> о компании <br/> по его ИНН</h1>
                <p className={styles.text}>Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.</p>
                <button onClick={() => navigate('/search')} style={signedIn === false ? {
                            display: 'none'
                        } : {
                            display: 'block'
                        }} 
                        className={`${styles.tablecontents_btn} ${styles.btn}`}>Запросить данные</button>
                <div className={styles.tablecontents_background} style={{
                    backgroundImage: 'url(/Logo/Main_elements/Table_contents/manwithmag.svg)'
                }}></div>
        </section>
    )
}

export default TableContents;