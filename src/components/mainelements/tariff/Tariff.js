import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { MyContext } from '../../../App';
import styles from './Tariff.module.css';

const TariffTitle = [
    {
        title: 'Beginner',
        for: 'Для небольшого исследования',
        logo: '/logo/mainelements/tariff/lamp.svg',
        special_price: '799 ₽',
        price: '1 200 ₽',
        credit: 'или 150 ₽/мес. при рассрочке на 24 мес.',
        checks: ['Безлимитная история запросов', 'Безопасная сделка', 'Поддержка 24/7'],
        background_color: '#FFB64F',
        color: '#000',
        width: '92.244px',
        height: '83.145px',
        width_mob: '59px',
        height_mob: '53.181px',
        top: '11px',
        right: '15.76px',
        top_mob: '13px',
        right_mob: '5px'
    },
    {
        title: 'Pro',
        for: 'Для HR и фрилансеров',
        logo: '/logo/mainelements/tariff/target.svg',
        special_price: '1 299 ₽',
        price: '2 600 ₽',
        credit: 'или 279 ₽/мес. при рассрочке на 24 мес.',
        checks: ['Все пункты тарифа Beginner', 'Экспорт истории', 'Рекомендации по приоритетам'],
        background_color: '#7CE3E1',
        color: '#000',
        width: '119.96px',
        height: '118.76px',
        width_mob: '68.299px',
        height_mob: '75.734px',
        top: '0',
        right: '0',
        top_mob: '2px',
        right_mob: '0.38px'
    },
    {
        title: 'Business',
        for: 'Для корпоративных клиентов',
        logo: '/Logo/Main_elements/Tariff/laptop.svg',
        special_price: '2 379 ₽',
        price: '3 700 ₽',
        credit: ' ',
        checks: ['Все пункты тарифа Pro', 'Безлимитное количество запросов', 'Приоритетная поддержка'],
        background_color: '#000',
        color: '#fff',
        width: '96px',
        height: '80.09px',
        width_mob: '73px',
        height_mob: '60.902px',
        top: '23px',
        right: '5px',
        top_mob: '5px',
        right_mob: '10px'
    }
]

const Tariff = () => {
    const [signedIn, setSignedIn] = useContext(MyContext)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)


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
    <section className={styles.tariff}>
        <h2 className={styles.tariff_title}>НАШИ ТАРИФЫ</h2>
        <ul className={styles.tariff_list}>
            {TariffTitle.map(item => {
                return (
                    <li key={item.title} className={styles.tariff_item} >
                        <div className={styles.tariff_item_header} style={{
                            backgroundColor: `${item.background_color}`,
                            color: `${item.color}`
                        }}>
                            <div className={styles.tariff_background_logo} style={windowWidth > 1400 ? {
                                 backgroundImage: `url(${item.logo})`,
                                 width: `${item.width}`,
                                 height: `${item.height}`,
                                 top: `${item.top}`,
                                 right: `${item.right}`
                            } : {
                                backgroundImage: `url(${item.logo})`,
                                 width: `${item.width_mob}`,
                                 height: `${item.height_mob}`,
                                 top: `${item.top_mob}`,
                                 right: `${item.right_mob}`
                            }}></div>
                            <h4 className={styles.tariff_item_title}>{item.title}</h4>
                            <p className={styles.tariff_item_text}>{item.for}</p>
                        </div>
                        <div className={styles.tariff_main} style={signedIn && item.title === 'Beginner'? {border: '2px solid #FFB64F'} : {}}>
                            <h6 className={styles.tariff_current} style={signedIn && item.title === 'Beginner'? {display: 'block'} : {display: 'none'}}>Текущий тариф</h6>
                            <h4 className={styles.tariff_special_price}>{item.special_price}</h4>
                            <h5 className={styles.tariff_price}>{item.price}</h5>
                            <p className={styles.tariff_credit}>{item.credit}</p>
                            <h6 className={styles.tariff_cheks_title} style={item.credit === ' ' && windowWidth > 1440 ? {
                                marginTop: '91px'
                            } : windowWidth < 1440 ? {marginTop: '37px'} : {}}>В тариф входит:</h6>
                            <ul className={styles.tariff_list_info}>
                                {item.checks.map(el => {
                                    return (
                                        <li key={el} className={styles.tariff_cheks} style={{
                                            backgroundImage: 'url(/Logo/Main_elements/tariff/checkmark.svg)'
                                        }}>{el}</li>
                                    )
                                })}
                            </ul>
                            <button className={signedIn && item.title === 'Beginner' ? `${styles.tariff_btn} ${styles.tariff_btn_signed}` : `${styles.tariff_btn}`}>{signedIn && item.title === 'Beginner' ? 'Перейти в личный кабинет' : 'Подробнее'}</button>
                        </div>
                    </li>
                )
            })}
        </ul>
    </section>
  )
}

export default Tariff;
