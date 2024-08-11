import React, {useState} from 'react';
import { decode } from 'html-entities'
import styles from './Articles.module.css';

const Articles = (item) => {
    item = item.item
    const [imgChecked, setImgChecked] = useState()

    const checkImage = (el) => {
        const img = new Image();
        img.src = el
        img.onload = function() {
            setImgChecked(true)
        }
        img.onerror = function() {
            setImgChecked(false)
        }
    }

    const decodeContent = markup => {
        return decode(markup);
    }

    const removeAllTags = content => {
        return content.replace(/<p>/g, '\n').replace(/<.*?>/g, '').replace(/\/.*?\//g, '').replace(/\(добавлен.*?\)/g, '')
    }

    const getContent = markup => {
        const decodedContent = decodeContent(markup);
        const content = removeAllTags(decodedContent);
        return content
    }
  
    let formattedDate
    if (item.issueDate) {
        const date = new Date(item.issueDate)
        formattedDate = `${date.getDate().toString().length === 2 ? date.getDate() : '0' + date.getDate()}.${(date.getMonth() + 1).toString().length === 2 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}.${date.getFullYear()}`
    } 
    const regexLogo = /<\/sentence>&lt;br&gt;&lt;img src="(.*?)"&gt;<\/scandoc>/gm
    const contentSentences = item?.content?.markup;
    const content = getContent(contentSentences)
    let src = regexLogo.exec(contentSentences)
    if (src) {
        src = src[1]
        checkImage(src)
    }
    let attribute 
    if (item.attributes.isAnnouncement) {
        attribute = 'Анонсы и события'
    } else if (item.attributes.isTechNews) {
        attribute = 'Технические новости'
    } else if (item.attributes.isDigest) {
        attribute = 'Cводки новостей'
    } else {
        attribute = false
    }
    let word
    if (item.attributes.wordCount % 10 === 1) {
        word = 'слово'
    } else if (item.attributes.wordCount % 10 === 2 || item.attributes.wordCount % 10 ===  3 || item.attributes.wordCount % 10 === 4) {
        if (item.attributes.wordCount.toString().slice(-2) === '12' || item.attributes.wordCount.toString().slice(-2) === '13' || item.attributes.wordCount.toString().slice(-2) === '13'){
        word = 'слов'
      }
      word = 'слова'
    } else {
        word = 'слов'
    }

          return (
          <div className={styles.articles_card} key={item.id}>
            <div className={styles.articles_header}>
                <span className={styles.articles_date}>{formattedDate}</span>
                <a href={item.url} target='_blank' rel="noreferrer" className={styles.articles_source}>{item.source.name}</a>
            </div>
            <h3 className={attribute ? `${styles.articles_title}` : `${styles.articles_title} ${styles.articles_no_attribute}`}>{item.title.text}</h3>
            <span className={styles.articles_attribute} style={!attribute ? {display: 'none'} : {display: 'blocks'}}>{attribute}</span>
            <img className={styles.articles_img} src={src && imgChecked ? src : '/Logo/Search_result/notDownload.svg'} style={src && imgChecked ? {objectFit: 'cover'} : {border: '1px solid #94949445'}} alt="article illustration"/>
            <p className={styles.articles_text}>{content}</p>
            <div className={styles.articles_footer}>
              <a href={item.url} target='_blank' rel="noreferrer">
                <button className={styles.article_btn}>Читать в источнике</button>
              </a>
            <span className={styles.articles_wordcount}>{item.attributes.wordCount} {word}</span>
            </div>
          </div>
        )
    }  

export default Articles