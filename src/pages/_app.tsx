import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import ThemeLayout from '../components/ThemeLayout';

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ThemeLayout>
        <Component {...pageProps} />
      </ThemeLayout>
    </Provider>
  );
};

export default MyApp;