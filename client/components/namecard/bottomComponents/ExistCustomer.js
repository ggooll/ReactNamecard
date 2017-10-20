/**
 * Created by imgyucheol on 2017. 9. 7..
 */

import React from 'react';
import AuthExistCustomer from '../../modal/AuthExistModal';
import Rodal from 'rodal';
import axios from 'axios';
import 'rodal/lib/rodal.css';
import './css/BottomItem.css';
import './css/NameCardBottom.css';
import history from '../../../history';

export default class ExistCustomer extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.defaultState = {
            empCode: this.props.name,
            modalVisible: false,
            downVisible: 'down-menu',
            isAuthorized: false,
            animation: 'slideUp'
        };

        this.state = this.defaultState;

        this.handleDownMenuShow = this.handleDownMenuShow.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleAuthSuccess = this.handleAuthSuccess.bind(this);
    }

    handleDownMenuShow() {
        // localStorage말고 세션을 검사하게끔 한다.
        axios.post('/api/auth/isExistSession', {}).then((exist) => {
            console.log(exist);
            if (exist.data !== false) {
                this.setState({
                    downVisible: this.state.downVisible === 'down-menu' ? 'down-menu visible' : 'down-menu'
                });
            } else {
                // 인증이 필요한 경우
                this.setState({
                    modalVisible: true
                });

                window.detectingHistory.isModal = true;
                window.detectingHistory.modalFunc = this.handleModalClose;
                window.history.pushState('forward', null, './existAuth');
                return false;
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    handleModalClose() {
        window.detectingHistory.isModal = false;
        this.setState({
            modalVisible: false
        });
    }

    handleAuthSuccess() {
        window.detectingHistory.isModal = false;
        this.setState({
            modalVisible: false,
            downVisible: this.state.downVisible === 'down-menu' ? 'down-menu visible' : 'down-menu'
        });
    }

    handleLinkMenu(linkUri) {
        // this.setState(this.defaultState);
        history.push(`/${this.state.empCode}/${linkUri}`);
    }

    render() {
        return (
            <div>
                {/* 타이틀 */}
                <div className="namecard-bottom-itemdiv" onClick={this.handleDownMenuShow}>
                    <span className="bottom-item-titlespan">
                        {this.props.menuTitle}
                        {this.state.downVisible === 'down-menu' ?
                            <i className="fa fa-chevron-down" aria-hidden="true"/> :
                            <i className="fa fa-chevron-up" aria-hidden="true"/>}
                    </span>
                </div>

                {/* dropdown 메뉴 */}
                <div className={this.state.downVisible}>
                    {/* 각 link가 붙음 */}
                    <div className="drop-down-item" onClick={this.handleLinkMenu.bind(this, 'consult')}>
                        <span className="down-menu-span">
                            <i className="fa fa-angle-right" aria-hidden="true"/>{'내상담내역'}
                        </span>
                    </div>

                    <div className="drop-down-item" onClick={this.handleLinkMenu.bind(this, 'reservationList')}>
                        <span className="down-menu-span">
                            <i className="fa fa-angle-right" aria-hidden="true"/>{'상담예약내역'}
                        </span>
                    </div>
                </div>

                {/* modal */}
                <Rodal
                    visible={this.state.modalVisible}
                    onClose={this.handleModalClose}
                    customStyles={{height: '100vh', width: '100vw', margin: 0, background: '#f9f9f9'}}
                    closeOnEsc={false}
                    animation={this.state.animation}
                    duration={300}
                    showCloseButton={false}>

                    <AuthExistCustomer authSuccess={this.handleAuthSuccess} closeModal={this.handleModalClose}/>
                </Rodal>

            </div>
        );
    }
}