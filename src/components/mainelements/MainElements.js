import React from "react";
import styles from './MainElements.module.css';
import Header from "../header/Header";
import Footer from "../footer/Footer";
import TableContents from "./tablecontents/TableContents";
import WhyWe from "./whywe/WhyWe";
import Tariff from "./tariff/Tariff";


const MainElements = () => {
   
    return (
       <>
       <Header />
            <main className={styles.main}>
                <TableContents />
                <WhyWe />
                <Tariff />
            </main>
            <Footer />   
       </>
    )
}

export default MainElements;