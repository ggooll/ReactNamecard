/**
 * Created by imgyucheol on 2017. 10. 9..
 */

import React from 'react';
import resource from './StaticResource';
import './css/SavingsCalculator.css';

export default class SavingsCalculator extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            visible: 'fund-div1 hide-div',
            plusMoneyOne: '',
            plusPeriodOne: '',
            plusRateOne: '',
            resultDivState: 'result-calculate-div hide-div',
            monthlyCost: '',
            investCost: '',
            taxPre: '',
            taxAfter: '',
            maxCost: ''
        };

        this.handleDownMenu = this.handleDownMenu.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleSubmitPlusOne = this.handleSubmitPlusOne.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    makeNoneComma(event) {
        let result = {};
        let value = event.target.value;
        result[event.target.name] = value.replace(/\,/g, '');
        this.setState(result);
    }

    makeComma(event) {
        let result = {};
        result[event.target.name] = resource.moneyWithComma(event.target.value);
        this.setState(result);
    }

    handleChangeInput(event) {
        let numberRegex = /^(\d{1,3}([.]\d{0,2})?)?$/;
        let value = event.target.value;

        if (numberRegex.test(value)) {
            let result = {};
            result[event.target.name] = event.target.value;
            this.setState(result);
        }
    }

    handleRefresh() {
        this.setState({
            plusMoneyOne: '',
            plusPeriodOne: '',
            plusRateOne: '',
            resultDivState: 'result-calculate-div hide-div'
        })
    }

    handleSubmitPlusOne() {
        let submitState = this.state.resultDivState;

        if (submitState !== 'result-calculate-div') {
            if (this.state.plusMoneyOne === '') {
                window.alert('값을 입력해주세요!');
                return false;
            }
            if (this.state.plusPeriodOne === '') {
                window.alert('값을 입력해주세요!');
                return false;
            }
            if (this.state.plusRateOne === '') {
                this.setState({
                    plusRateOne: '1.0'
                })
            }

            // all number
            let money = Number(this.state.plusMoneyOne.replace(/\,/g, ''));
            let period = Number(this.state.plusPeriodOne);
            let rate = Number(this.state.plusRateOne !== '' ? this.state.plusRateOne : '1.0') / 100;

            // 필요 월 납입액
            let monthlyCost = 0;
            let type = 1;
            if (type === 1) {
                monthlyCost = money / (period + rate / 12 * period * (period + 1) / 2 * (1 - 0.154));
            } else if (type === 2) {
                monthlyCost = money / (((1 + rate / 12) * (1 - (Math.pow((1 + rate / 12), period))) * (-12 / rate) - period) * (1 - 0.154) + period);
            }

            // 투자원금
            let investCost = monthlyCost * period;
            let taxPre = 0;
            if (type === 1) {
                taxPre = monthlyCost * rate / 12 * period * (period + 1) / 2;
            } else if (type === 2) {
                taxPre = monthlyCost * (1 + rate / 12) * (1 - (Math.pow((1 + rate / 12), period))) / (1 - (1 + rate / 12)) - monthlyCost * period;
            }

            // 세후 이자
            let taxAfter = taxPre * (1 - 0.154);	//일반세율, g_tex_normal
            let maxCost = investCost + taxAfter;

            this.setState({
                resultDivState: 'result-calculate-div',
                monthlyCost: resource.moneyWithComma(Math.round(monthlyCost)),
                taxPre: resource.moneyWithComma(Math.round(taxPre)),
                taxAfter: resource.moneyWithComma(Math.round(taxAfter)),
                investCost: resource.moneyWithComma(Math.round(investCost)),
                maxCost: resource.moneyWithComma(Math.round(maxCost))
            });
        }
    }

    handleClickPlusMoneyOne(money) {
        let beforeValue = this.state.plusMoneyOne.replace(/\,/g, '');
        this.setState({
            plusMoneyOne: resource.moneyWithComma(Number(beforeValue) + Number(money))
        });
    }

    handleClickPlusPeriodOne(period) {
        let beforeValue = this.state.plusPeriodOne;
        this.setState({
            plusPeriodOne: Number(beforeValue) + Number(period)
        });
    }

    handleClickPlusRateOne(rate) {
        let beforeValue = this.state.plusRateOne;
        this.setState({
            plusRateOne: Number(beforeValue) + Number(rate)
        });
    }

    handleDownMenu(){
        let visible = this.state.visible === 'fund-div1' ? 'fund-div1 hide-div' : 'fund-div1';

        this.setState({
            visible : visible
        });
        if(visible === 'fund-div1'){
            window.scrollTo(0, 200);
        } else {
            window.scrollTo(0, 0);
        }
    }

    render(){
        return(
            <div>
                <div className="fund-cal-title" onClick={this.handleDownMenu}>
                    얼마 모으기 위해 얼마
                    {this.state.visible === 'fund-div1' ?
                            <i className="fa fa-chevron-up" aria-hidden="true"/> :
                            <i className="fa fa-chevron-down" aria-hidden="true"/>}
                </div>
                <div className={this.state.visible}>
                    <div className="plus-value">
                        <div className="plus-value-input-div">
                            얼마나
                            <input onFocus={this.makeNoneComma} onBlur={this.makeComma}
                                   onChange={this.handleChangeInput} value={this.state.plusMoneyOne}/>원
                        </div>
                        <div className="plus-value-btn-div">
                            <div onClick={this.handleClickPlusMoneyOne.bind(this, '10000000')}>{'+ 천만원'}</div>
                            <div onClick={this.handleClickPlusMoneyOne.bind(this, '1000000')}>{'+ 백만원'}</div>
                            <div onClick={this.handleClickPlusMoneyOne.bind(this, '100000')}>{'+ 십만원'}</div>
                            <div onClick={this.handleClickPlusMoneyOne.bind(this, '10000')}>{'+ 만원'}</div>
                        </div>
                    </div>

                    <div className="plus-value">
                        <div className="plus-value-input-div">
                            얼마동안
                            <input onChange={this.handleChangeInput} value={this.state.plusPeriodOne}/>개월
                        </div>
                        <div className="plus-value-btn-div">
                            <div onClick={this.handleClickPlusPeriodOne.bind(this, '24')}>{'+ 24개월'}</div>
                            <div onClick={this.handleClickPlusPeriodOne.bind(this, '12')}>{'+ 12개월'}</div>
                            <div onClick={this.handleClickPlusPeriodOne.bind(this, '6')}>{'+ 6개월'}</div>
                            <div onClick={this.handleClickPlusPeriodOne.bind(this, '1')}>{'+ 1개월'}</div>
                        </div>
                    </div>

                    <div className="plus-value">
                        <div className="plus-value-input-div">
                            예상 금리
                            <input name='plusRateOne' onChange={this.handleChangeInput}
                                   value={this.state.plusRateOne}/>%
                        </div>
                    </div>

                    <div className="calculate-submit" onClick={this.handleSubmitPlusOne}>
                        {'계산하기'}
                    </div>

                    <div className={this.state.resultDivState}>
                        {/*계산 결과(hide - drop)*/}
                        <div className="result-calculate">
                            <div>목표금액 <span>{this.state.maxCost}</span> 원, 금리 <span>{this.state.plusRateOne}%</span>
                            </div>
                            <div>월 <span>{this.state.monthlyCost}</span> 원씩</div>
                            <div><span>{this.state.plusPeriodOne}</span> 개월 동안</div>
                            <div>총 <span>{this.state.investCost}</span> 원 적립으로</div>
                            <div>이자 <span>{this.state.taxAfter}</span> 원(세후) 발생</div>
                        </div>
                    </div>

                    <div className="refresh-submit" onClick={this.handleRefresh}>
                        초기화
                    </div>
                </div>
            </div>
        );
    }

}