import { createContainer } from 'unstated-next';
import { useLocalStorage } from 'utils/hooks';

export const useI18N = () => {
  const [ i18n, setI18n ] = useLocalStorage('i18n', 'zh-CN');

  return { 
    i18n, 
    setI18n, 
  };
};

export const I18NContainer = createContainer(useI18N);
