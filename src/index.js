import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {BrowserRouter} from 'react-router-dom';
import configureStore from './redux/reducers/configureStore'
import {Provider} from 'react-redux'
import 'rsuite/dist/styles/rsuite-default.css'

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
