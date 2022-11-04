import { useCallback, useState, useEffect, SyntheticEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import classNames from 'classnames';
import Icon from 'components/Icon';
import { I18NContainer } from 'hooks';
import styles from './index.module.scss';

interface IProps {
  isScroll?: boolean
  isLogin: boolean;
}

const Header = (props: IProps) => {
  const { isScroll, isLogin } = props;
  const [ showMenus, setShowMenus ] = useState<boolean>(false);
  const [ i18nMenuOpen, setI18nMenuOpen ] = useState<boolean>(false);
  const history = useHistory();
  const { i18n, setI18n } = I18NContainer.useContainer();

  useEffect(() => {
    const handler = () => {
      if (i18nMenuOpen) {
        setI18nMenuOpen(false);
      }
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [i18nMenuOpen]);

  const gotoStart = useCallback(() => {
    window.scrollTo(0, 0);
    setShowMenus(false);
  }, [history]);

  const gotoFirstTask = useCallback(() => {
    const firstTask = document.getElementById('firstTask')?.offsetTop || 0;
    const header = document.getElementById('header')?.clientHeight || 0;
    setTimeout(() => {
      window.scrollTo(0, firstTask - header);
    }, 400);
  }, [history]);

  const gotoSecondtTask = useCallback(() => {
    const firstTask = document.getElementById('secondTask')?.offsetTop || 0;
    const header = document.getElementById('header')?.clientHeight || 0;
    setTimeout(() => {
      window.scrollTo(0, firstTask - header);
    }, 400);
  }, [history]);

  const gotoThirdTask = useCallback(() => {
    const firstTask = document.getElementById('thirdTask')?.offsetTop || 0;
    const header = document.getElementById('header')?.clientHeight || 0;
    setTimeout(() => {
      window.scrollTo(0, firstTask - header);
    }, 400);
  }, [history]);

  const gotoFourthTask = useCallback(() => {
    const firstTask = document.getElementById('fourthTask')?.offsetTop || 0;
    const header = document.getElementById('header')?.clientHeight || 0;
    setTimeout(() => {
      window.scrollTo(0, firstTask - header);
    }, 400);
  }, [history]);

  const cls = classNames(styles.container, {
    [styles['container-scroll']]: isScroll
  });

  return (
    <div className={cls}>
      <div className={styles.header} id='header'>
        <div className={styles.logo}>
          {
            isScroll 
              ? <img className={styles['logo-image']} src={require('images/logo-text-dark.png')} alt='logo' />
              : <img className={styles['logo-image']} src={require('images/logo-text-light.png')} alt='logo' />
          }
        </div>
        {
          isLogin && (
            <div className={styles.navs}>
              <span className={styles['nav-item']} onClick={() => { gotoStart(); }}>
                <FormattedMessage id='header.start' />
              </span>
              <span className={styles['nav-item']} onClick={() => { gotoFirstTask(); }}>
                <FormattedMessage id='header.status' />
              </span>
              <span className={styles['nav-item']} onClick={() => { gotoSecondtTask(); }}>
                <FormattedMessage id='header.user' />
              </span>
              <span className={styles['nav-item']} onClick={() => { gotoThirdTask(); }}>
                <FormattedMessage id='header.percentage' />
              </span>
              <span className={styles['nav-item']} onClick={() => { gotoFourthTask(); }}>
                <FormattedMessage id='header.variation' />
              </span>
            </div>
          )
        }
        
        <Popup
          basic
          open={i18nMenuOpen}
          on='click'
          position='bottom right'
          className={styles.popup}
          trigger={
            <div 
              onClick={(e: SyntheticEvent) => {
                document.body.click();
                e.stopPropagation();
                setI18nMenuOpen(true);
              }}
              className={styles['language-popup']}
            >
              {i18n === 'en-US' ? 'English' : '中文'}
              <Icon customClass={styles['angle-down']} type='angle-down' />
            </div>
          }
        >
          <div className={styles['dropdown-menu']} onClick={() => { setI18nMenuOpen(false); }}>
            <div className={styles['dropdown-menu-item']} onClick={()=> { setI18n('en-US'); }}>
              English
            </div>
            <div className={styles['dropdown-menu-item']} onClick={()=> { setI18n('zh-CN'); }}>
              中文
            </div>
          </div>
        </Popup>
        <div className={styles['menu-btn']} onClick={() => { setShowMenus(!showMenus); }}>
          { showMenus ? <Icon customClass={styles.icon} type='close' /> : <Icon customClass={styles.icon} type='menu' />  }
        </div>
        {
          showMenus && (
            <div className={styles.menus}>
              <div className={styles['menu-item']} onClick={() => { 
                gotoStart(); 
                setShowMenus(false);
              }}>
                <FormattedMessage id='header.start' />
              </div>
              <div className={styles['menu-item']} onClick={() => { 
                gotoFirstTask(); 
                setShowMenus(false);
              }}>
                <FormattedMessage id='header.status' />
              </div>
              <div className={styles['menu-item']} onClick={() => { 
                gotoSecondtTask(); 
                setShowMenus(false);
              }}>
                <FormattedMessage id='header.user' />
              </div>
              <div className={styles['menu-item']} onClick={() => { 
                gotoThirdTask(); 
                setShowMenus(false);
              }}>
                <FormattedMessage id='header.percentage' />
              </div>
              <div className={styles['menu-item']} onClick={() => { 
                gotoFourthTask(); 
                setShowMenus(false);
              }}>
                <FormattedMessage id='header.variation' />
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Header;