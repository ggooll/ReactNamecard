import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

window.detectingHistory = {
    isModal: false,
    modalFunc: undefined
};

let rootElement = document.getElementById('root');
ReactDOM.render(<App location={location}/>, rootElement);
