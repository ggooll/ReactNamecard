/**
 * Created by imgyucheol on 2017. 9. 4..
 */

import React from 'react';
import './css/modal.css';
import './css/authExistModal.css';
import axios from 'axios';
import async from 'async';

export default class AuthExistModal extends React.Component {

    constructor(props) {
        super(props);

        this.defaultState = {
            inputValue: 'modal-input',
            phone: '',
            errorToggleDiv: 'form-error-check hide-div',
            errorMessage: '',
            checkPhoneDiv: '',
            checkSMSMessageDiv: 'hide-div',
            inputNumber: '',
            refSaltedNumber: '',
            authTimer: 'hide-div',
        };

        this.state = this.defaultState;
        this.handleChange = this.handleChange.bind(this);
        this.checkPhoneNum = this.checkPhoneNum.bind(this);
        this.checkAuthNum = this.checkAuthNum.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState(this.defaultState);
        this.props.closeModal();
    }

    handleChange(event) {
        let result = {};
        result[event.target.name] = event.target.value;
        this.setState(result);
    }

    checkRegex(component, callback) {
        const phoneRegex = /(\d{3}).*(\d{3}).*(\d{4})/;
        if (!phoneRegex.test(component.state.phone)) {
            component.setState({
                inputValue: 'modal-error-input',
                errorToggleDiv: 'form-error-check',
                errorMessage: '올바르지 않은 입력입니다'
            });
        } else {
            component.setState({
                inputValue: 'modal-input',
                errorToggleDiv: 'form-error-check hide-div',
                errorMessage: ''
            });
            callback(null, component);
        }
    }

    getAuthNumber(component) {
        axios.post('/api/auth/existCustomer', {'phone': component.state.phone}).then((promiseNumber) => {
            if (promiseNumber.data !== false) {
                window.alert('요청하신 번호로 인증번호가 발송되었습니다');
                component.setState({
                    refSaltedNumber: promiseNumber.data.saltedNum,
                    checkSMSMessageDiv: '',
                    checkPhoneDiv: 'hide-div'
                });
            } else {
                window.alert('조회하신 정보가 없습니다!');
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    checkPhoneNum() {
        let getAuthTask = [
            async.apply(this.checkRegex, this),
            this.getAuthNumber
        ];
        async.waterfall(getAuthTask, null);
    }

    checkAuthNum() {
        let inputAuthNumber = this.state.inputNumber;

        axios.post('/api/auth/authNumber', {
            inputNum: inputAuthNumber, refSaltedNumber: this.state.refSaltedNumber
        }).then((success) => {
            if (success.data) {
                this.setState(this.defaultState);
                this.props.authSuccess();
            } else {
                window.alert('잘못된 번호입니다');
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    // rendering
    render() {
        return (
            <div>
                <div className="modal-container">
                    <div className="modal-logo-div">
                        {'something'}
                    </div>
                    <div className="clear-div-2"/>

                    <div>
                        {/* #  1 */}
                        <div className={this.state.checkPhoneDiv}>
                            <div className="modal-input-div">
                                <input type="number" name="phone" minLength={10} maxLength={11}
                                       className={this.state.inputValue}
                                       placeholder="-를 뺀 숫자만 입력해주세요"
                                       value={this.state.phone} onChange={this.handleChange}/>
                                <button className="modal-btn" onClick={this.checkPhoneNum}>인증번호 전송</button>
                            </div>

                            <div className={this.state.errorToggleDiv}>
                                {this.state.errorMessage}
                            </div>
                        </div>

                        <div className="clear-div-2"/>
                        {/* #  2 */}
                        <div className={this.state.checkSMSMessageDiv}>
                            <div className="send-notice-div panel col-md-6">
                                <div className="notice-icon-div">
                                    <img src="/images/SMS2.png"/>
                                </div>
                                <div className="notice-para-div">
                                    {/* notice */}
                                    <p>요청하신 번호로 </p>
                                    <p>인증번호가 발송되었습니다.</p>
                                </div>
                            </div>

                            <div className="modal-input-div">
                                <input type="text" name="inputNumber" maxLength={10}
                                       className={this.state.inputValue}
                                       value={this.state.inputNumber} onChange={this.handleChange}/>
                                <button className="modal-btn" onClick={this.checkAuthNum}>인증번호 확인</button>

                                {/*<div className={this.state.authTimer}>*/}
                                {/*<span>{''}</span>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className="clear-div-2"/>

                        <div className="modal-button-div">
                            <button className="btn" onClick={this.handleClose}>닫기</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

