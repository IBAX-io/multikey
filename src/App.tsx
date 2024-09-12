import '@/lang/i18n';
import Router from '@/router';
import { ThemeSchemeContext } from '@/theme';
import { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';

function App() {
  const { t } = useTranslation();
  const { generateScheme } = useContext(ThemeSchemeContext);
  const handleGenerateScheme = useCallback(() => {
    // generateScheme('#4241f0');
    // generateScheme('#0b57d0');
  }, [generateScheme]);
  useEffect(() => {
    handleGenerateScheme();
    document.title = t('home.multi');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);
  return <RouterProvider router={Router}></RouterProvider>;
}

export default App;
