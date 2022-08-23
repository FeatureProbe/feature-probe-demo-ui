import { useCallback, useEffect, useState, useRef, SyntheticEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FeatureProbe, FPUser } from 'featureprobe-client-sdk-js';
import { Modal, Form, InputOnChangeData } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { getProjectList, login } from 'services';
import { IProject } from 'interfaces';
import Icon from 'components/Icon';
import Header from 'components/Header';
import Button from 'components/Button';
import logo from 'images/logo.svg';
import styles from './index.module.scss';

const Home = () => {
  const [ isScroll, setIsScroll ] = useState<boolean>(false);
  const [ firstTaskStatusOn, saveFirstTaskStatus ] = useState<boolean>(false);
  const [ secondTaskStatusOn, saveSecondTaskStatus ] = useState<boolean>(false);
  const [ thirdTaskStatusOn, saveThirdTaskStatus ] = useState<boolean>(false);
  const [ fourthTaskStatusOn, saveFourthTaskStatus ] = useState<number>(0);
  const [ fourthTaskResultShow, saveFourthTaskResult ] = useState<boolean>(false);

  const [ loginOpen, setLoginOpen ] = useState<boolean>(false);
  const intl = useIntl();
  const INTERVAVL_TIME = 1000;

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
  } = useForm();

  let FP: FeatureProbe;
  const timer: { current: NodeJS.Timeout | null } = useRef(null);

  const getTaskStatus = useCallback(() => {
    const fisrtTaskResult = FP.boolValue('campaign_enable', false);
    const secondTaskResult = FP.boolValue('campaign_allow_list', false);
    const thirdTaskResult = FP.boolValue('campaign_percentage_rollout', false);
    const fourthTaskResult = FP.numberValue('promotion_campaign', 0);

    saveFirstTaskStatus(fisrtTaskResult);
    saveSecondTaskStatus(secondTaskResult);
    saveThirdTaskStatus(thirdTaskResult);
    saveFourthTaskStatus(fourthTaskResult);
    saveFourthTaskResult(true);
  }, []);

  const initSDK = useCallback((sdkKey: string) => {
    const user = new FPUser('featureprobe');
    user.with('userId', '00003');
    FP = new FeatureProbe({
      remoteUrl: 'https://featureprobe.io/server',
      clientSdkKey: sdkKey,
      user,
      refreshInterval: INTERVAVL_TIME,
    });

    FP.start();

    FP.on('ready', () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
      getTaskStatus();
      timer.current = setInterval(getTaskStatus, INTERVAVL_TIME);
      return () => {
        clearInterval(timer.current as NodeJS.Timeout);
      };
    });
  }, []);
  
  const init = useCallback(async () => {
    const res = await getProjectList<IProject[]>();
    const { data, code, success } = res;
    if (('' + code) === '401') {
      setLoginOpen(true);
      return;
    }
    if (success && data) {
      if (data && data[0] && data[0].environments && data[0].environments[0]) {
        initSDK(data[0].environments[0].clientSdkKey);
      }
    }
  }, [intl]);

  useEffect(() => {
    init();
  }, [init]);

  const scrollChange = useCallback(() => {
    const top = document.getElementById('start')?.getBoundingClientRect().top;

    if (top === 0) {
      setIsScroll(false);
    } else {
      setIsScroll(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', scrollChange, false);
    scrollChange();

    return () => {
      window.removeEventListener('scroll', scrollChange, false);
    };
  }, [scrollChange]);

  const gotoStart = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  const gotoFirstTask = useCallback(() => {
    const firstTask = document.getElementById('firstTask')?.offsetTop || 0;
    const header = document.getElementById('header')?.clientHeight || 0;
    setTimeout(() => {
      window.scrollTo(0, firstTask - header);
    }, 400);
  }, []);

  const onSubmit = useCallback(async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await login(data);
    const { success } = res;
    if (success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('organizeId', res.data.organizeId);
      setLoginOpen(false);
      init();
    }
  }, []);

	return (
		<div className={styles.home}>
      <Header 
        isScroll={isScroll}
      />

      {/* start task */}
      <div className={styles.start} id='start'>
        <div className={styles['start-box']}>
          <div className={styles['start-box-title']}>
            <img className={styles['start-title-ball-left']} src={require('images/ball-left.png')} alt='ball' />
            <FormattedMessage id='demo.title' />
            <img className={styles['start-title-ball-right']} src={require('images/ball-right.png')} alt='ball' />
          </div>
          <div className={styles['start-box-desc']}>
            <FormattedMessage id='demo.description' />
          </div>
          <div className={styles['start-box-link']}>
            <a href='https://featureprobe.io' target='_blank'>
              https://featureprobe.io
            </a>
          </div>
          <div className={styles['start-box-user']}>
            <FormattedMessage id='demo.userid' />
          </div>
        </div>
        <div className={styles.down} onClick={gotoFirstTask}>
          <Icon type='angle-down' customClass={styles['down-icon']} />
        </div>
      </div>

      {/* first task */}
      <div id='firstTask'>
        <div className={styles.task}>
          <div className={styles['task-left']}>
            <img className={styles['task-logo']} src={require('images/task1.png')} alt='task' />
          </div>
          <div className={styles['task-right']}>
            <div className={styles['task-title']}>
              <FormattedMessage id='demo.task1.title' />
            </div>
            <div className={styles['task-desc']}>
              <FormattedMessage id='demo.task1.description' />
            </div>
            <div className={styles['task-desc']}>
              <FormattedMessage id='demo.task1.task.left' />
              <a href='https://featureprobe.io/My_Project/online/campaign_enable/targeting' target='_blank'>
                Campaign Enable
              </a>
              <FormattedMessage id='demo.task1.task.right' />
            </div>
            {
              firstTaskStatusOn ? (
                <div className={styles['task-result-on']}>
                  <div>
                    <FormattedMessage id='demo.task1.status.on' />
                  </div>
                  <div>
                    {
                      localStorage.getItem('i18n')?.replaceAll('"', '') === 'en-US' 
                        ? <img className={styles['task-result-img']} src={require('images/task-result-en.png')} alt='result' />
                        : <img className={styles['task-result-img']} src={require('images/task-result.png')} alt='result' />
                    }
                  </div>
                </div>
              ) : (
                <div className={styles['task-result-off']}>
                  <FormattedMessage id='demo.task1.status.off' />
                </div>
              )
            }
          </div>
        </div>
      </div>

      {/* second task */}
      <div id='secondTask' className={styles['task-bg']}>
        <div className={styles.task}>
          <div className={styles['task-left']}>
            <img className={styles['task-logo']} src={require('images/task2.png')} alt='task' />
          </div>
          <div className={styles['task-right']}>
            <div className={styles['task-title']}>
              <FormattedMessage id='demo.task2.title' />
            </div>
            <div className={styles['task-desc']}>
              <FormattedMessage id='demo.task2.description' />
            </div>
            <div className={styles['task-desc']}>
              <FormattedMessage id='demo.task2.task.left' />
              <a href='https://featureprobe.io/My_Project/online/campaign_allow_list/targeting' target='_blank'>
                Campaign Allow List
              </a>
              <FormattedMessage id='demo.task2.task.right' />
            </div>
            {
              secondTaskStatusOn ? (
                <div className={styles['task-result-on']}>
                  <div>
                    <FormattedMessage id='demo.task2.status.on' />
                  </div>
                  <div>
                    {
                      localStorage.getItem('i18n')?.replaceAll('"', '') === 'en-US' 
                        ? <img className={styles['task-result-img']} src={require('images/task-result-en.png')} alt='result' />
                        : <img className={styles['task-result-img']} src={require('images/task-result.png')} alt='result' />
                    }
                  </div>
                </div>
              ) : (
                <div className={styles['task-result-off']}>
                  <FormattedMessage id='demo.task2.status.off' />
                </div>
              )
            }
          </div>
        </div>
        <img className={styles['decoration-coin-first']} src={require('images/corn1.png')} />
        <img className={styles['decoration-coin-second']} src={require('images/corn2.png')} />
      </div>

      {/* third task */}
      <div id='thirdTask'>
        <div className={styles.task}>
          <div className={styles['task-left']}>
            <img className={styles['task-logo']} src={require('images/task3.png')} alt='task' />
          </div>
          <div className={styles['task-right']}>
            <div className={styles['task-title']}>
              <FormattedMessage id='demo.task3.title' />
            </div>
            <div className={styles['task-desc']}>
              <FormattedMessage id='demo.task3.description' />
            </div>
            <div className={styles['task-desc']}>
              <FormattedMessage id='demo.task3.task.left' />
              <a href='https://featureprobe.io/My_Project/online/campaign_percentage_rollout/targeting' target='_blank'>
                Campaign Percentage Rollout
              </a>
              <FormattedMessage id='demo.task3.task.right' />
            </div>
            {
              thirdTaskStatusOn ? (
                <div className={styles['task-result-on']}>
                  <div>
                    <FormattedMessage id='demo.task3.status.on' />
                  </div>
                  <div>
                    {
                      localStorage.getItem('i18n')?.replaceAll('"', '') === 'en-US' 
                        ? <img className={styles['task-result-img']} src={require('images/task-result-en.png')} alt='result' />
                        : <img className={styles['task-result-img']} src={require('images/task-result.png')} alt='result' />
                    }
                  </div>
                </div>
              ) : (
                <div className={styles['task-result-off']}>
                  <FormattedMessage id='demo.task3.status.off' />
                </div>
              )
            }
          </div>
        </div>
      </div>

      {/* fourth task */}
      <div id='fourthTask' className={styles['task-bg']}>
        <div className={styles.task}>
          <div className={styles['task-left']}>
            <img className={styles['task-logo']} src={require('images/task4.png')} alt='task' />
          </div>
          <div className={styles['task-right']}>
            <div className={styles['task-title']}>
              <FormattedMessage id='demo.task4.title' />
            </div>
            <div className={styles['task-desc']}>
              <FormattedMessage id='demo.task4.description' />
            </div>
            <div className={styles['task-desc']}>
              <FormattedMessage id='demo.task4.task.left' />
              <a href='https://featureprobe.io/My_Project/online/promotion_campaign/targeting' target='_blank'>
                Promotion Campaign
              </a>
              <FormattedMessage id='demo.task4.task.right' />
            </div>
            <div className={styles['task-result-on']}>
              <div>
                {
                  intl.formatMessage({ id: 'demo.task4.status' })
                }
                {
                  fourthTaskResultShow && <span>{ fourthTaskStatusOn }</span>
                }
              </div>
              <div>
                {
                  localStorage.getItem('i18n')?.replaceAll('"', '') === 'en-US' 
                    ? <img className={styles['task-result-img']} src={require('images/task4-result-en.png')} alt='result' />
                    : <img className={styles['task-result-img']} src={require('images/task4-result.png')} alt='result' />
                }
                {
                  fourthTaskResultShow && (
                    <div className={styles.price}>
                      { fourthTaskStatusOn } 
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
        <img className={styles['decoration-coin-third']} src={require('images/corn3.png')} />
      </div>

      <div className={styles.footer}>
        <div className={styles.up} onClick={gotoStart}>
          <Icon type='angle-up' customClass={styles['up-icon']} />
        </div>
        <div>
          <img className={styles['footer-logo']} src={logo} alt='logo' />
        </div>
        <div className={styles['footer-text']}>
          <FormattedMessage id='demo.ready' />
        </div>
      </div>

      {/* login modal */}
      <Modal
        open={loginOpen}
        closeOnDimmerClick={false}
        onClose={() => setLoginOpen(false)}
        onOpen={() => setLoginOpen(true)}
        className={styles['modal-container']}
      >
        <div className={styles.modal}>
          <div className={`${styles['demo-login-card']} login-card`}>
            <div className={styles['demo-login-text']}>
              <FormattedMessage id='login.demo.text' />
            </div>
            <div className={styles['demo-login-tip']}>
              <FormattedMessage id='login.demo.tip' />
            </div>
            <div className={styles['demo-form']}>
              <Form 
                autoComplete='off'
                onSubmit={handleSubmit(onSubmit)} 
              >
                <Form.Field className={styles.field}>
                  <label className={styles.label}>
                    <Icon type='email' />
                    <span className={styles['label-text']}>
                      <FormattedMessage id='login.email.text' />
                    </span>
                  </label>
                  <Form.Input
                    placeholder={intl.formatMessage({id: 'login.email.placeholder.text'})}
                    error={ errors.account ? true : false }
                    {
                      ...register('account', { 
                        required: {
                          value: true,
                          message: intl.formatMessage({id: 'login.email.placeholder.text'})
                        },
                        maxLength: {
                          value: 30,
                          message: intl.formatMessage({id: 'login.email.placeholder.text'})
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i,
                          message: intl.formatMessage({id: 'login.email.invalid.text'})
                        }
                      })
                    }
                    onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                      setValue(detail.name, detail.value);
                      await trigger('account');
                    }}
                  />
                  { errors.account && <div className={styles['error-text']}>{ errors.account.message }</div> }
                </Form.Field>

                <div className={styles['demo-footer']}>
                  <Button className={styles['demo-btn']} type='submit' primary disabled={!!errors.account || !!errors.password}>
                    <FormattedMessage id='login.signin' />
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
