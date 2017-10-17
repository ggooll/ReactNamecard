/**
 * Created by imgyucheol on 2017. 10. 7..
 */

import React from 'react';
import TopNavigator from '../../common/TopNavigator';
import SavingsCalculator from '../calculator/SavingsCalculator';
import NCalculator from '../calculator/NCalculator';
import ExchangeCalculator from '../calculator/ExchangeCalculator';
import '../css/FundCalculator.css';

export default class FundCalculator extends React.Component {

    constructor(props) {
        super(props);
    }

    // 얼마 모으려면 얼마나 걸릴까 - 그냥모으는 것 / 이자와 함께 모으는 것
    // 1. 뿜빠이 금액 (1000, 10000, 100000, 1000000),  인원 (-1, +1)
    // 2. 얼마 모으기 위해 걸리는 시간

    render() {
        return (
            <div className="item-whole-div">
                <TopNavigator title="자금 계산기"/>
                <div className="fund-intro-div"/>
                <div className="fund-intro-title">
                    <span>계산...기..</span>
                    <span>N분의 1 계산</span>
                    <span>대출 매달 이자는 얼마일까?</span>
                    <span>얼마 모으려면 몇 달이 걸릴까?</span>
                </div>

                <div className="fund-section-div">
                    <SavingsCalculator/>
                    <NCalculator/>
                    <ExchangeCalculator/>


                    <div className="fund-cal-title">연봉계산기?</div>
                    <div className="fund-div3">
                        흠..
                    </div>
                </div>

            </div>
        );
    }

}