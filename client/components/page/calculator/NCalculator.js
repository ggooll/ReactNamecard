/**
 * Created by imgyucheol on 2017. 10. 9..
 */

import React from 'react';
import resource from '../StaticResource';
import '../css/NCalculator.css';

export default class SavingsCalculator extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            visible: 'fund-div2',
            nMoney : '',
            nPeople : '1',
            resultNDivState : 'result-n-div hide-div',
            divMoney : ''
        };

        this.handleDownMenu = this.handleDownMenu.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleRefreshN = this.handleRefreshN.bind(this);
        this.handleSubmitNDiv = this.handleSubmitNDiv.bind(this);
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

    handleSubmitNDiv(){
        let submitState = this.state.resultNDivState;
        if (submitState !== 'result-n-div') {
            if (this.state.nMoney === '') {
                window.alert('값을 입력해주세요!');
                return false;
            }
            if (this.state.nPeople === '1') {
                window.alert('값을 입력해주세요!');
                return false;
            }

            let money = this.state.nMoney.replace(/\,/g, '');
            let divMoney = Math.round(Number(money)/Number(this.state.nPeople));
            this.setState({
                resultNDivState: 'result-n-div',
                divMoney : divMoney
            });
        }
    }

    handleRefreshN(){
        this.setState({
            nMoney: '',
            nPeople: '1',
            resultNDivState: 'result-n-div hide-div'
        })
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

    handleClickPlusMoneyTwo(money){
        let beforeValue = this.state.nMoney.replace(/\,/g, '');
        this.setState({
            nMoney: resource.moneyWithComma(Number(beforeValue) + Number(money))
        });
    };

    handleClickPlusPeople(value){
        let people = this.state.nPeople;
        let nPeople = eval(`${people}${value}`);
        this.setState({
            nPeople : nPeople < 1 ? '1' : nPeople
        });
    };

    handleDownMenu(){
        let visible = this.state.visible === 'fund-div2' ? 'fund-div2 visible' : 'fund-div2';

        this.setState({
            visible : visible
        });
        if(visible === 'fund-div2 visible'){
            window.scrollTo(0, 300);
        } else {
            window.scrollTo(0, 0);
        }
    }

    render(){
        return(
          <div>
              <div className="fund-cal-title" onClick={this.handleDownMenu}>
                  N분의1 계산기
                  {this.state.visible === 'fund-div2' ?
                          <i className="fa fa-chevron-down" aria-hidden="true"/> :
                          <i className="fa fa-chevron-up" aria-hidden="true"/>}
              </div>
              <div className={this.state.visible}>
                  <div className="n-div-value">
                      <div className="n-div-input-div">
                        총액 <input name="nMoney" onFocus={this.makeNoneComma} onBlur={this.makeComma}
                                   onChange={this.handleChangeInput} value={this.state.nMoney}/> 원
                      </div>
                      <div className="n-value-btn-div">
                          <div onClick={this.handleClickPlusMoneyTwo.bind(this, '100000')}>{'+ 십만원'}</div>
                          <div onClick={this.handleClickPlusMoneyTwo.bind(this, '10000')}>{'+ 만원'}</div>
                          <div onClick={this.handleClickPlusMoneyTwo.bind(this, '1000')}>{'+ 천원'}</div>
                          <div onClick={this.handleClickPlusMoneyTwo.bind(this, '100')}>{'+ 백원'}</div>
                      </div>
                  </div>

                  <div className="n-div-value">
                      <div className="n-div-input-div">
                        인원 <input value={this.state.nPeople}/> 명
                      </div>
                      <div className="n-value-btn-div">
                          <div onClick={this.handleClickPlusPeople.bind(this, '+1')}>{'+ 1명'}</div>
                          <div onClick={this.handleClickPlusPeople.bind(this, '-1')}>{'- 1명'}</div>
                      </div>
                  </div>
                  <div>
                      <div className="n-div-submit" onClick={this.handleSubmitNDiv}>
                        N분의 1
                      </div>
                  </div>

                  <div className={this.state.resultNDivState}>
                      {/*계산 결과(hide - drop)*/}
                      <div className="result-n">
                          <div>
                              {resource.moneyWithComma(this.state.divMoney)} 원씩
                          </div>
                      </div>
                  </div>


                  <div>
                      <div className="n-div-refresh" onClick={this.handleRefreshN}>
                        초기화
                      </div>
                  </div>

              </div>
          </div>
        );
    }

}