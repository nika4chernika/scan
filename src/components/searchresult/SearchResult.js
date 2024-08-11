import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setHistograms } from '../../reducers/Histograms';
import { setFind } from '../../reducers/Find';
import { setDocList } from '../../reducers/DocList';
import { setDocuments } from '../../reducers/Docs';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import Articles from './articles/Articles';
import styles from './SearchResult.module.css';
import axios from 'axios';
import { OBJECTSEARCH_URL } from "../../API/Api";
import { DOCUMENTS_URL } from "../../API/Api";
import { useNavigate } from 'react-router-dom';


const SearchResult = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [showBtn, setShowBtn] = useState(true)
  const [currentAmount, setCurrentAmount] = useState(10);
  const [wholeAmount, setWholeAmount] = useState();
  const [executed, setExecuted] = useState(false);

  const sliderRef = useRef()
  const itemRef = useRef()
  const mobileRef = useRef()
  const dispatch = useDispatch();

  const histograms = useSelector((state) => state.histograms.value);
  const Find = useSelector((state) => state.Find.value);
  const DocList = useSelector((state) => state.DocList.value);
  const documents = useSelector((state) => state.documents.value);

  useEffect(() => {
    const changeSizeWin = () => {
        setWindowWidth(window.innerWidth)
    } 
    window.addEventListener('resize', changeSizeWin)

    return () => {
        window.removeEventListener('resize', changeSizeWin)
    }
}, [])

  useEffect(() => {
    if (documents) {
      dispatch(setDocuments(''))
    }
    if (DocList) {
      dispatch(setDocList(''))
    }
    if (localStorage.getItem('accessToken')) return
    else {
      navigate('/') 
    }
  }, [dispatch])

  useEffect(() => {
    if (localStorage.getItem('histograms')) {
     dispatch(setHistograms(JSON.parse(localStorage.getItem('histograms'))))
    }
    if(localStorage.getItem('Find')) {
      dispatch(setFind(JSON.parse(localStorage.getItem('Find'))))
    }
  }, [dispatch])
  
  const requestObjectSearch = async (requestBody) => {
    const result = await axios.post(OBJECTSEARCH_URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken')).accessToken}`,
        'accept': 'application/json'
      }
    })
    .catch(err => {console.log('err')})
    let dataResponse
    if (result) {
      dataResponse = result.data.items
    } else {
      dataResponse = false
    }
    return dataResponse
  }

  const setData = async (requestBody) => {
    let result = await requestObjectSearch(requestBody)
    let data
    if (result) {
      const stringifiedItems = result.map(item => {
        const result = String(item.encodedId)
        return result
      }) 
      data = {ids: stringifiedItems}
      dispatch(setDocList(data))
    }
  }

  useEffect(() => {
    if (!wholeAmount) {
      if (Find.limit <= histograms.amount) {
        setWholeAmount(Find.limit)
      } else {
        setWholeAmount(histograms.amount)
      }
    }
  }, [Find])

  useEffect(() => {
    let mockParams
    if (wholeAmount) {
    mockParams = Object.assign({}, Find)
    mockParams.limit = currentAmount
    if (mockParams.limit === currentAmount) {
      setData(mockParams)
    }
    }
  }, [wholeAmount, currentAmount])

  const showMore = () => {
    setLoadingBtn(true)
    if (currentAmount < wholeAmount && wholeAmount - currentAmount >= 10) {
      setCurrentAmount(currentAmount + 10)
      setExecuted(false)
    } else if (currentAmount < wholeAmount && wholeAmount - currentAmount < 10) {
      setCurrentAmount(currentAmount + (wholeAmount - currentAmount))
      setExecuted(false)
    } 
  }

  useEffect(() => {
       if (currentAmount >= wholeAmount && !loadingBtn) {
        setShowBtn(false)
    }
  }, [currentAmount, loadingBtn, documents])

  const documentsRequest = async (e) => {
    const result = await axios.post(DOCUMENTS_URL, DocList, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken')).accessToken}`,
        'accept': 'application/json'
      }
    })
    .catch(err => {console.log('err')})
    let dataResponse 
    dataResponse = result.data.map(item => {
      return item.ok
    })
    return dataResponse
  }

  const getDocuments = async () => {
    let result = await documentsRequest()
    if (result && !executed) {
      dispatch(setDocuments(result))
      setExecuted(true)
    }
    if (loadingBtn) {
      setLoadingBtn(false)
    }
  }

  useEffect(() => {
    if (DocList) {
      getDocuments()
    } 
  }, [DocList])
  
  const displayArticles = () => {
    return(
      <div className={styles.section_articles}>
        <div className={styles.articles}>
        {documents.map(item => {
          if (item) {
            return (
              <Articles item={item} key={item.id}/>
            )
          }
          })}
      </div>
      <button onClick={showMore} style={showBtn ? {display: 'inline-block'} : {display: 'none'}} className={!loadingBtn ? `${styles.articles_btn}` : `${styles.articles_btn} ${styles.articles_btn_loading}`}>{!loadingBtn ? 'Показать больше' : 'Идет загрузка...'}</button>
      </div>
      
    )
  }

  const slideRight = () => {
    if (windowWidth > 760)
    {
       sliderRef.current.scrollLeft += itemRef.current.clientWidth
    } else {
      sliderRef.current.scrollTop += 48
    }
  }

  const slideLeft = () => {  
    if (windowWidth > 760) {
      sliderRef.current.scrollLeft -= itemRef.current.clientWidth 
    } else {
      sliderRef.current.scrollTop -= 48
    }
  }

  const displayHistograms = () => {
    if (histograms && windowWidth > 760) {
      return (
        <table className={styles.table}>
          <tbody>
            <tr className={styles.table_row}>
            {histograms.total.map(item => {
              const date = new Date(item.date)
              const formattedDate = `${date.getDate().toString().length === 2 ? date.getDate() : '0' + date.getDate()}.${(date.getMonth() + 1).toString().length === 2 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}.${date.getFullYear()}`
              return (
                <td key={formattedDate} ref={itemRef} className={styles.table_date}>{formattedDate}</td>
              )
            })}
          </tr>
          <tr className={styles.table_row}>
            {histograms.total.map(item => {
              return (
                <td key={item.date} className={styles.table_value}>{item.value}</td>
              )
            })}
          </tr>
          <tr className={styles.table_row}>
            {histograms.riskfactor.map(item => {
              return (
                <td key={item.date} className={styles.table_value}>{item.value}</td>
              )
            })}
          </tr>
          </tbody>
        </table>
    )
    } else if (histograms && windowWidth < 760) {
      return (
        <div className={styles.table_mobile} >
          <ul className={styles.mobile_column}>
            {histograms.total.map(item => {
              const date = new Date(item.date)
              const formattedDate = `${date.getDate().toString().length === 2 ? date.getDate() : '0' + date.getDate()}.${(date.getMonth() + 1).toString().length === 2 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}.${date.getFullYear()}`
              return (
                <li key={formattedDate} className={styles.mobile_date}>{formattedDate}</li>
              )
            })}
            </ul>
            <ul className={styles.mobile_column}ref={mobileRef}>
              {histograms.total.map(item => {
              return (
                <li key={item.date} className={styles.mobile_value}>{item.value}</li>
              )
            })}
            </ul>
            <ul className={styles.mobile_column}>
              {histograms.riskfactor.map(item => {
              return (
                <li key={item.date} className={styles.mobile_value}>{item.value}</li>
              )
            })}
            </ul>
        </div>
      )
    } else {
      return (
        <div className={styles.review_loading}>
          <div className={styles.review_loading_img} 
          style={windowWidth > 760 ? {backgroundImage: 'url(/Logo/Header/loader.svg)'}
           : {backgroundImage: 'url(/logo/header/loader.svg)', left: '40%', top: '20%'}}></div>
          <h4 className={styles.review_loading_text} style={windowWidth < 760 ? {marginTop: '80px', marginBottom: '15px'} : {}}>Загружаем данные</h4>
        </div>
      )  
    } 
  }


  return (
    <>
      <Header />
      <main className={styles.main}>
      <section className={styles.tablecontents}>
        <div className={styles.background} style={{
        backgroundImage: 'url(/Logo/Search_result/ladyloupe.svg)'
      }}></div>
        <h1 className={styles.tablecontents_title}>
          Ищем. Скоро <br/> будут результаты
        </h1>
        <p className={styles.tablecontents_text}>Поиск может занять некоторое время, <br/> просим сохранять терпение.</p>
      </section>
       <section className={styles.review}>
        <h2 className={styles.head_text}>Общая сводка</h2>
        <p className={styles.text}>Найдено вариантов {histograms.amount}</p>
        <div className={styles.review_slider} ref={sliderRef}>
          <div onClick={slideLeft} className={styles.arrow_left} style={{
            backgroundImage: 'url(/Logo/Main_elements/Whywe/leftarrow.svg)'
          }} ></div>
          <div onClick={slideRight} className={styles.arrow_right} style={{
            backgroundImage: 'url(/Logo/Main_elements/Whywe/rightarrow.svg)'
          }}></div>
          <ul className={windowWidth > 760? `${styles.review_header}` : `${styles.review_header} ${styles.review_header_mobile}`}>
            <li className={styles.review_title}>Период</li>
            <li className={styles.review_title}>Всего</li>
            <li className={styles.review_title}>Риски</li>
          </ul>
            {displayHistograms()}
        </div>
      </section>
      <section className={styles.doc}>
      <h2 className={styles.head_text}>Список документов</h2>
      {documents ? displayArticles() : (<div className={styles.loading_text}>Пожалуйста подождите, выполняется загрузка...</div>)}
      </section>
    </main>
    <Footer />
    </>
  )
}

export default SearchResult;


