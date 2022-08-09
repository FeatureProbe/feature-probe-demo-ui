import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';
import { I18NContainer } from './hooks';
import Intl from './locales/intl';
import 'iconfont/iconfont.css';
import 'semantic-ui-less/semantic.less';
import 'dayjs/locale/zh-cn';

import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <I18NContainer.Provider>
      <Intl>
        <Router />
      </Intl>
    </I18NContainer.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
