import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Ga from 'react-ga';

Ga.initialize('UA-107048577-1');

window.detectingHistory = {
    isModal: false,
    modalFunc: undefined
};

let rootElement = document.getElementById('root');
ReactDOM.render(<App location={location}/>, rootElement);

if (module.hot) {
    module.hot.accept();
}
