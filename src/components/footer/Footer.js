import React from 'react'
import styles from './Footer.module.css'

const Footer = () => {

  return (
    <footer className={styles.footer}>
        <img className={styles.logo} src="/Logo/Footer/scan_logo.png" alt="scan_logo" />
        <div className={styles.footer_label}>
            <p className={styles.footer_label_element}>г. Москва, Цветной б-р, 40</p>
            <a href="tel:+7(495)771-21-11" className={styles.footer_label_element}>+7 495 771 21 11</a>
            <a href="mailto:info@skan.ru" className={styles.footer_label_element}>info@skan.ru</a>
            <p className={styles.footer_copyright}>Copyright. 2024</p>
        </div>
    </footer>
  )
}

export default Footer;