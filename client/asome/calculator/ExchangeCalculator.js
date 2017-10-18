/**
 * Created by imgyucheol on 2017. 10. 15..
 */
import React from 'react';
import '../../components/page/css/ExcnahgeCalculator.css';
import $ from 'jquery';
import async from 'async';
import {isoArray} from './ISOArray';

export default class ExchangeCalculator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : 'fund-div3',
            exchangeMoney: '',
            resultMoney: '',
            results : '',
            fromCode : '',
            toCode : '',
            ask: '',
            bid: '',
            rate: '',
            date: ''
        };

        this.handleDownMenu = this.handleDownMenu.bind(this);
        this.handleCalculate = this.handleCalculate.bind(this);
        this.handleChangeFromTo = this.handleChangeFromTo.bind(this);
    }

    getExchange(code, callback){
        $.ajax({
            type: 'GET',
            url: `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20%3D%20%22
                    ${code}%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
            success : function(result){
                console.log(result);
                callback(null, result.query.results.rate)
            },
            error : function(error){
                callback(error, null);
            }
        });
    }

    handleCalculate(){
        let code = this.state.fromCode + this.state.toCode;
        let tasks = [async.apply(this.getExchange, code)];
        async.waterfall(tasks, (err, results)=>{
            if(err){
                console.log(err);
            } else {
                console.log(results);

                // 매수가격 (고객이 A로 B를 살때)
                let ask = results['Ask'];
                // 매도가격 (고객이 A를 B로 팔 떄)
                let bid = results['Bid'];
                let rate = results['Rate'];
                let date = results['Date'];

                let money = this.state.exchangeMoney;
                let resultMoney = (money * rate).toFixed(2);

                this.setState({
                    results : results,
                    resultMoney : resultMoney
                })
            }
        });
    }

    handleDownMenu(){
        let visible = this.state.visible === 'fund-div3' ? 'fund-div3 visible' : 'fund-div3';
        this.setState({
            visible : visible
        });

        if(visible === 'fund-div3 visible'){
            window.scrollTo(0, 600);
        } else {
            window.scrollTo(0, 0);
        }
    }

    handleChangeFromTo(event){
        let result = {};
        result[event.target.name] = event.target.value;
        this.setState(result);
        console.log(result);
    }

    handleClickExchangeMoney(money){
        this.setState({
            exchangeMoney : money
        })
    }

    render() {
        return (
            <div>
                <div className="fund-cal-title" onClick={this.handleDownMenu}>
                    환율 계산기
                    {this.state.visible === 'fund-div3' ?
                        <i className="fa fa-chevron-down" aria-hidden="true"/> :
                        <i className="fa fa-chevron-up" aria-hidden="true"/>}
                </div>

                <div className={this.state.visible}>
                    <div className="n-div-value">
                        <div className="n-div-input-div">
                            총액 <input name="nMoney" onFocus={this.makeNoneComma} onBlur={this.makeComma}
                                      value={this.state.exchangeMoney} readOnly/> 원
                        </div>
                        <div className="n-value-btn-div">
                            <div onClick={this.handleClickExchangeMoney.bind(this, '10000000')}>{'+ 천만원'}</div>
                            <div onClick={this.handleClickExchangeMoney.bind(this, '1000000')}>{'+ 백만원'}</div>
                            <div onClick={this.handleClickExchangeMoney.bind(this, '100000')}>{'+ 십만원'}</div>
                            <div onClick={this.handleClickExchangeMoney.bind(this, '10000')}>{'+ 만원'}</div>
                        </div>
                    </div>
                    <div>
                        <select name="fromCode" onChange={this.handleChangeFromTo}>
                            {isoArray.map((iso, idx)=>{
                                return <option key={idx} value={iso.code}>{iso.name}</option>
                            })};
                        </select>
                    </div>
                    <div>
                        <select name="toCode" onChange={this.handleChangeFromTo}>
                            {isoArray.map((iso, idx)=>{
                                return <option key={idx} value={iso.code}>{iso.name}</option>
                            })};
                        </select>
                    </div>

                    <div>
                        <div onClick={this.handleCalculate}>계산하기</div>
                    </div>

                    <div>
                        {this.state.resultMoney}
                    </div>
                </div>
            </div>
        );
    }

}