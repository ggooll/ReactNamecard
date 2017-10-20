/**
 * Created by imgyucheol on 2017. 10. 18..
 */

import React from 'react';
import TopNavigator from '../common/TopNavigator';
import './css/BestCommodities.css';
import axios from 'axios';
import async from 'async';
import history from '../../history';
import Loader from 'react-loader';

export default class BestCommodities extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            empCode: location.pathname.split('/')[1],
            bestDeposits: [],
            bestSavings: [],
            loaded: false
        };
        this.handleClickOverAll = this.handleClickOverAll.bind(this);
        this.handleClickOnDemand = this.handleClickOnDemand.bind(this);
    }

    handleClickOverAll(){
        history.push(`/${this.state.empCode}/products`);
    }

    handleClickOnDemand(){
        history.push(`/${this.state.empCode}/onDemand`);
    }

    handleClickDeposit(idx) {
        history.push(`/${this.state.empCode}/products/deposit_info/${this.state.bestDeposits[idx]["NO"]}`);
    }

    handleClickSavings(idx) {
        history.push(`/${this.state.empCode}/products/savings_info/${this.state.bestSavings[idx]["NO"]}`);
    }


    getBestDeposits(callback) {
        axios.post(`/api/rank/bestDeposit`, {}).then((bestDeposits) => {
            console.log(bestDeposits.data);
            callback(null, bestDeposits.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    getBestSavings(bestDeposits, callback) {
        axios.post(`/api/rank/bestSavings`, {}).then((bestSavings) => {
            console.log(bestSavings.data);
            callback(null, bestDeposits, bestSavings.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        let tasks = [this.getBestDeposits, this.getBestSavings];
        async.waterfall(tasks, (err, bestDeposits, bestSavings) => {
            this.setState({
                bestDeposits: bestDeposits,
                bestSavings: bestSavings,
                loaded: true
            })
        });
        window.scrollTo(0, 1);
    }

    render() {
        return (
            <div className="best-whole-container">
                <TopNavigator title="Best 추천 상품"/>


                <Loader loaded={this.state.loaded} color="#008485" length={10} width={1} radius={10}
                        shadow={true} hwaccel={true} top="50%">

                    <div className="best-deposit-whole">
                        <div className="best-intro">{'예금 Top 5'}</div>
                        {this.state.bestDeposits.map((deposit, idx) => {
                            return (
                                <div key={idx} className="best-commodity-one"
                                     onClick={this.handleClickDeposit.bind(this, idx)}>
                                    <div className="rank-badge">
                                        {`${idx+1}위`}
                                    </div>
                                    <div className="best-bank-name">
                                        {deposit["FIN_PRDT_NM"]}
                                    </div>
                                    <span className="best-title">
                                        {/*{savings["KOR_CO_NM"]}*/}
                                        <img src={`/images/bank_logos/${deposit["FIN_CO_NO"]}.png`}/>
                                    </span>
                                    <div className="best-rate">
                                        <span>최저</span>{`${deposit["INTR_RATE"].toFixed(2)}`}%
                                         ~ <span>최고</span>{`${deposit["INTR_RATE2"].toFixed(2)}`}%
                                    </div>
                                </div>
                            );
                        })}
                        <div className="best-detail-exp">
                            {'제1금융권 정기예금, 예치기간 12개월 기준'}
                        </div>
                    </div>

                    <div className="best-savings-whole">
                        <div className="best-intro">{'적금 Top 5'}</div>
                        {this.state.bestSavings.map((savings, idx) => {
                            return (
                                <div key={idx} className="best-commodity-one"
                                     onClick={this.handleClickSavings.bind(this, idx)}>
                                    <div className="rank-badge">
                                        {`${idx+1}위`}
                                    </div>
                                    <div className="best-bank-name">
                                        {savings["FIN_PRDT_NM"]}
                                    </div>
                                    <span className="best-title">
                                        {/*{savings["KOR_CO_NM"]}*/}
                                        <img src={`/images/bank_logos/${savings["FIN_CO_NO"]}.png`}/>
                                    </span>
                                    <span className="best-rate">
                                        <span>최저</span>{`${savings["INTR_RATE"].toFixed(2)}`}%
                                         ~ <span>최고</span>{`${savings["INTR_RATE2"].toFixed(2)}`}%
                                    </span>
                                </div>
                            );
                        })}
                        <div className="best-detail-exp">
                            {'제1금융권, 자유적립식, 적립기간 12개월 기준'}
                        </div>
                    </div>

                    <div className="best-to-overall-div" onClick={this.handleClickOverAll}>
                        더 많은 상품을 보시겠어요??
                    </div>

                    <div className="best-to-ondemand-div" onClick={this.handleClickOnDemand}>
                        내게 알맞는 상품을 찾아볼까요??
                    </div>

                    <div className="clear-div-4"/>
                </Loader>
            </div>

        );
    }

}
