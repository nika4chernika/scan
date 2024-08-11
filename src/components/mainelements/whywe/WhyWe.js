import React, {useState, useEffect} from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styles from './WhyWe.module.css';

const WhyWe = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const WhyWeTitle = [
        {
            title: 'Высокая и оперативная скорость обработки заявки',
            logo: '(/Logo/Main_elements/Whywe/timer.svg)'
        }, 
        {
            title: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос',
            logo: '(/Logo/Main_elements/Whywe/loupe.svg)'
        }, 
        {
            title: '  Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству',
            logo: '(/Logo/Main_elements/Whywe/lock.svg)'
        }, 
        {
            title: 'Высокая и оперативная скорость обработки заявки',
            logo: '(/Logo/Main_elements/Whywe/timer.svg)'
        }, 
        {
            title: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос',
            logo: '(/Logo/Main_elements/Whywe/loupe.svg)'
        }, 
        {
            title: '  Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству',
            logo: '(/Logo/Main_elements/Whywe/lock.svg)'
        }
    ]

    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1099 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1099, min: 670 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 670, min: 0 },
          items: 1
        }
      };

      const CustomLeftArrow = ({ onClick, ...restArrowProps }) => (
        <button
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          style={{ backgroundImage: 'url(/Logo/Main_elements/Whywe/leftarrow.svg)' }}
          className={styles.left_arrow}
          {...restArrowProps}
        ></button>
      );
    
      const CustomRightArrow = ({ onClick, ...restArrowProps }) => (
        <button
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          style={{ backgroundImage: 'url(/Logo/Main_elements/Whywe/rightarrow.svg)' }}
          className={styles.right_arrow}
          {...restArrowProps}
        ></button>
      );
    
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
  <section className={styles.whywe_main}>
    <h2 className={styles.whywe_title}>Почему именно мы</h2>
    <div className={styles.whywe}>
      <Carousel
        infiniteLoop={true}
        responsive={responsive}
        className={styles.whywe_list}
        customLeftArrow={<CustomLeftArrow></CustomLeftArrow>}
        customRightArrow={<CustomRightArrow></CustomRightArrow>}
      >
        {WhyWeTitle.map((item, index) => (
  <div
    key={index}
    className={styles.whywe_item}
    style={{
      backgroundImage: `url${item.logo}`,
    }}
  >
    <span>{item.title}</span>
  </div>
        ))}
      </Carousel>
    </div>
    <div
      className={styles.whywe_background}
      style={
        windowWidth > 800
          ? {
              backgroundImage: 'url(/Logo/Main_elements/Whywe/sitsman.svg)',
            }
          : {
              backgroundImage: 'url(/Logo/Main_elements/Whywe/sitsman-adapt.svg)',
            }
      }
    ></div>
  </section>
);

}

export default WhyWe;