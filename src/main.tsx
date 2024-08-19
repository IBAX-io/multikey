import { store } from '@/store';
import ThemeContent from '@/theme/content/content';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    {/*  <React.StrictMode> */}
    <ThemeContent>
      <App />
    </ThemeContent>
    {/*  </React.StrictMode> */}
  </Provider>
);
