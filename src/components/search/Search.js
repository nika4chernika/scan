import React, { useEffect } from 'react';
import ModalWindows from './modalwindows/ModalWindows';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setHistograms } from '../../reducers/Histograms';
import { setFind } from '../../reducers/Find';
import { useNavigate } from 'react-router-dom';
import { setDocList } from '../../reducers/DocList';
import { setDocuments } from '../../reducers/Docs';
import { useState } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { HISTOGRAMS_URL } from "../../API/Api";
import styles from './Search.module.css';

const Search = () => {
  const [modalActive, setModalActive] = useState(false)
  const [modalChild, setModalChild] = useState()
  const navigate = useNavigate()
  const [point, setPoint] = useState(false)
  const [maxcomplete, setMaxcomplete] = useState(false)
  const [businesscontent, setBusinesscontent] = useState(false)
  const [mainrole, setMainrole] = useState(false)
  const [riskfactor, setRiskfactor] = useState(false)
  const [technews, setTechnews] = useState(false)
  const [announcement, setAnnouncement] = useState(false)
  const [news, setNews] = useState(false)
  const [inn, setInn] = useState()
  const [verifyInn, setVerifyInn] = useState()
  const [tone, setTone] = useState()
  const [amount, setAmount] = useState()
  const [verifyAmount, setVerifyAmount] = useState()
  const [dateStart, setDateStart] = useState()
  const [dateEnd, setDateEnd] = useState()
  const [verifyDate, setVerifyDate] = useState(false)
  const [verifyBtn, setVerifyBtn] = useState(false)

  const dispatch = useDispatch();
  const histograms = useSelector((state) => state.histograms.value);
  const Find = useSelector((state) => state.Find.value);
  const DocList = useSelector((state) => state.DocList.value);
  const documents = useSelector((state) => state.documents.value);

  const SearchInfo = [
    {
      info: 'Признак максимальной полноты',
      state: maxcomplete,
      setstate: setMaxcomplete
    },
    {
      info: 'Упоминания в бизнес-контексте',
      state: businesscontent,
      setstate: setBusinesscontent
    },
    {
      info: 'Главная роль в публикации',
      state: mainrole,
      setstate: setMainrole
    },
    {
      info: 'Публикации только с риск-факторами',
      state: riskfactor,
      setstate: setRiskfactor
    },
    {
      info: 'Включать технические новости рынков',
      state: technews,
      setstate: setTechnews
    },
    {
      info: 'Включать анонсы и календари',
      state: announcement,
      setstate: setAnnouncement
    },
    {
      info: 'Включать сводки новостей',
      state: news,
      setstate: setNews
    }
  ]

  useEffect(() => {
    if(localStorage.getItem('Find')) {
      localStorage.removeItem('Find')
    }
    if (localStorage.getItem('histograms')) {
      localStorage.removeItem('histograms')
    }
    dispatch(setHistograms(''))
    dispatch(setFind(''))
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
  }, [dispatch, DocList, documents, navigate])

  //verifications

  useEffect(() => {
    const regexNumber = /^[\d+]{10}$/
    const matchNumber = regexNumber.exec(inn)

    if (matchNumber) {
      setVerifyInn(true)
    } else {
      setVerifyInn(false)
    }
  }, [inn])

  useEffect(() => {
    let startDate
    let endDate
    const currentDate = new Date()
    if (dateStart) {
      startDate = new Date(dateStart)
    }
    if (dateEnd) {
      endDate = new Date(dateEnd)
    }

    if (startDate && endDate) {
      if (startDate.getTime() <= currentDate.getTime() && endDate.getTime() <= currentDate.getTime()) {
        if (startDate.getTime() <= endDate.getTime()) {
          setVerifyDate(true)
        } else {
          setVerifyDate(false)
        }
      } else {
        setVerifyDate(false)
      }
    }
  }, [dateStart, dateEnd])

  useEffect(() => {
    setAmount(Number(amount))
    if (amount > 0 && amount <= 1000) {
      setVerifyAmount(true)
    } else {
      setVerifyAmount(false)
    }
  }, [amount])

  useEffect(() => {
    if (verifyInn && verifyAmount && verifyDate) {
      setVerifyBtn(true)
    }
  }, [verifyInn, verifyAmount, verifyDate])

  // request 
  
  const requestBody = {
    "issueDateInterval": {
      "startDate": dateStart,
      "endDate": dateEnd
    },
    "searchContext": {
      "targetSearchEntitiesContext": {
        "targetSearchEntities": [
          {
            "type": "company",
            "sparkId": null,
            "entityId": null,
            "inn": inn,
            "maxComplete": maxcomplete,
            "inBusinessNews": businesscontent
          }
        ],
        "mainRole": mainrole,
        "tonality": tone,
        "riskfactor": riskfactor,
        "riskfactors": {
          "and": [],
          "or": [],
          "not": []
        },
        "themes": {
          "and": [],
          "or": [],
          "not": []
        }
      },
      "themesFilter": {
        "and": [],
        "or": [],
        "not": []
      }
    },
    "searchArea": {
      "includedSources": [],
      "excludedSources": [],
      "includedSourceGroups": [],
      "excludedSourceGroups": []
    },
    "attributeFilters": {
      "excludeTechNews": !technews,
      "excludeAnnouncements": !announcement,
      "excludeDigests": !news
    },
    "similarMode": "duplicates",
    "limit": amount,
    "sortType": "sourceInfluence",
    "sortDirectionType": "desc",
    "intervalType": "month",
    "histogramTypes": [
      "totalDocuments",
      "riskfactors"
    ]
  }

  const CustomRequest = async (e) => {
    const result = await axios.post(HISTOGRAMS_URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken')).accessToken}`,
        'accept': 'application/json'
      }
    })
    .catch(err => {})
    let dataResponse
    let total = []
    let riskfactor = []
    let totalAmount = 0
    let riskfactorAmount = 0
    if (result.data) {
      if (result.data.data.length === 0) { 
        dataResponse = {}
      } else {
        result.data.data[0].data.map(item => {
          total.push(item)
          totalAmount += item.value
      })
      result.data.data[1].data.map(item => {
        riskfactor.push(item)
        riskfactorAmount += item.value
      })
      dataResponse = {
        total: total,
        riskfactor: riskfactor,
        amount: totalAmount + riskfactorAmount
      }}
    } else {
      dataResponse = false
    }
    
    return dataResponse
  }

  const setData = async () => {
    let result = await CustomRequest ()
    if (!result || Object.keys(result).length === 0) {
      setModalActive(true)
      if (!result) {
        setModalChild('Введен неверный ИНН')
      } else if (Object.keys(result).length === 0) {
        setModalChild('По вашему запросу статей не найдено. Попробуйте ещё раз.')
      }
    } else if (Object.keys(result).length > 0) {
      dispatch(setHistograms(result))
      navigate('/searchresult')
    }  
    dispatch(setFind(requestBody))

  }

  useEffect(() => {
    localStorage.setItem('histograms', JSON.stringify(histograms))
  }, [histograms])

  useEffect(() => {
    localStorage.setItem('Find', JSON.stringify(Find))
  }, [Find])
   

  return (
    <>
    <Header />
    <main className={styles.main}>
      <div className={styles.doc} style={{
        backgroundImage: 'url(/Logo/Search/doc.svg)'
      }}></div>
      <div className={styles.folders} style={{
        backgroundImage: 'url(/Logo/Search/folders.svg)'
      }}></div>
      <div className={styles.manrocket} style={{
        backgroundImage: 'url(/Logo/Search/manrocket.svg)'
      }}></div>
      <h1 className={styles.title}>Найдите необходимые данные в пару кликов.</h1>
      <p className={styles.text}>Задайте параметры поиска. <br/> Чем больше заполните, тем точнее поиск</p>
      <form action="POST" className={styles.form}>
        <div className={styles.form_left}>
          <label className={styles.label} htmlFor="INN" >ИНН компании<sup className={styles.note}>*</sup></label>
          <input className={!inn || (inn && verifyInn) ? `${styles.input} ${styles.input_inn}` : `${styles.input} ${styles.input_inn} ${styles.input_inn_invalid}`}  type="text" name='INN' placeholder='10 цифр' required minLength='10' maxLength = "10" onInput={e => {
                            setInn(e.target.value)
                        }}/>
          <div className={styles.inn_error} style={inn && !verifyInn ? {display: 'block'} : {display: 'none'}}>Введите корректные данные</div>
          <label className={styles.label} htmlFor="tone">Тональность</label>
          <select className={styles.select} defaultValue='any' name="tone" id="" style={{
            backgroundImage: "url(/logo/search/arrowdown.svg)"
          }} 
          onInput={e => {
            setTone(e.target.value)
        }}>
            <option value="positive">Позитивная</option>
            <option value="negative">Негативная</option>
            <option value="any">Любая</option>
          </select>
          <label className={styles.label} htmlFor="amount">Количество документов в выдаче<sup className={styles.note}>*</sup></label>
          <input className={!amount || (amount && verifyAmount) ? `${styles.input} ${styles.input_amount}` : `${styles.input} ${styles.input_amount} ${styles.input_amount_invalid}`} 
          type='number' name='amount' min="1" max="1000" placeholder='От 1 до 1000' required 
          onInput={e => {
                            setAmount(e.target.value)
                        }}/>
          <div className={styles.amount_error} style={!amount || (amount && verifyAmount) ? {display: 'none'} : {display: 'block'}}>Обязательное поле</div>
          <label htmlFor="dateStart" className={`${styles.label} ${styles.label_date}`}>Диапазон поиска<sup className={styles.note}>*</sup></label>
          <input 
          onInput={e => {
            setDateStart(new Date(e.target.value))
        }}
          name='dateStart'
          onPoint={(e) => {
            (e.target.type = "date")
            setPoint(true)
          }}
          onBlur={(e) => {
            (e.target.type = "text")
            setPoint(false)
          }}
          type="text" 
          className={dateStart && !verifyDate ? `${styles.input} ${styles.input_date} ${styles.input_date_invalid}` : `${styles.input} ${styles.input_date}`}
          placeholder='Дата начала'
          style={!point ? {
            backgroundImage: "url(/logo/search/arrowdown.svg)"
          } : {}}/>
          <input 
          onInput={e => {
            setDateEnd(new Date(e.target.value))
        }}
          name='dateEnd'
          onPoint={(e) => {
            (e.target.type = "date")
            setPoint(true)
          }}
          onBlur={(e) => {
            (e.target.type = "text")
            setPoint(false)
          }}
          type="text" 
          className={dateEnd && !verifyDate ? `${styles.input} ${styles.input_date} ${styles.input_date_invalid}` : `${styles.input} ${styles.input_date}`}
           placeholder='Дата конца'
           style={!point ? {
            backgroundImage: "url(/logo/search/arrowdown.svg)"
          } : {}} required/>
          <div className={styles.date_error} style={(dateStart || dateEnd) && !verifyDate ? {display: 'block'} : {display: 'none'}}>Введите корректные данные</div>
        </div>
        <div className={styles.form_right}>
          <div className={styles.check_container}>
            {SearchInfo.map(item => {
              return (
              <label key={item.info} className={styles.check_label}>
                <input type="checkbox" className={item.state ? styles.check_input_active : styles.check_input} onChange={() => {
                  item.setstate(!item.state)
                }}/>
                <div  className={item.state ? styles.mark_checked : styles.mark_not_checked} style={{
                  backgroundImage: "url(/logo/search/checkmark.svg)"
                }}></div>
                <span className={item.state ? styles.check_text_active : styles.check_text}>{item.info}</span>
              </label>
              )
            })}
          </div>
          <button type='button' className={styles.btn} disabled={verifyBtn ? false : true} onClick={setData}>Поиск</button>
          <div className={styles.note_text}><sup className={styles.note}>*</sup> Обязательные к заполнению поля</div>
        </div>
      </form>
      <ModalWindows active={modalActive} setActive={setModalActive} children={modalChild}/>
    </main>
    <Footer />
    </>
  )
}

export default Search