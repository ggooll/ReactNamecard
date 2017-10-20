/**
 * Created by imgyucheol on 2017. 9. 7..
 */

import React from 'react';
import TopNavigator from '../common/TopNavigator';
import OnDemandDeposit from './OnDemandDeposit';
import OnDemandSavings from './OnDemandSavings';
import OnDemandMonthly from './OnDemandMonthly';
import './css/OnDemand.css';
import './css/page.css';

export default class OnDemand extends React.Component {

    constructor(props) {
        super(props);

        let title = {
            deposit_info : '목돈 보관하는 방법! 예금',
            savings_info : '목돈을 모으고 싶다면? 적금',
            monthly_info : '목표금액.. 얼마나 모아야 할까'
        };


        this.state = {
            selectedItem: 'ondemand-deposit',
            selectedProducts: 'deposit_info',
            title: title
        };

        this.handleChangeProducts = this.handleChangeProducts.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 1);
    }


    handleChangeProducts(event) {
        let selected = event.target.value;
        this.setState({
            selectedProducts: selected
        });
    }

    render() {

        return (
            <div className="item-whole-div">
                <TopNavigator title="나에게 맞는 예.적금 찾기"/>

                <div className="item-top-introduce">
                    <div className="top-introduce-frame">
                        <div>{this.state.title[`${this.state.selectedProducts}`]}</div>
                        <div className="ondemand-selected-product">
                            <select className="form-control" onChange={this.handleChangeProducts}
                                    value={this.state.selectedProducts}>
                                <option value="deposit_info">내게맞는 예금찾기</option>
                                <option value="savings_info">내게맞는 적금찾기</option>
                                <option value="monthly_info">월적금액계산</option>
                            </select>
                        </div>
                    </div>
                </div>

                {this.state.selectedProducts === 'deposit_info' ?
                    <OnDemandDeposit/> : undefined}
                {this.state.selectedProducts === 'savings_info' ?
                    <OnDemandSavings/> : undefined}
                {this.state.selectedProducts === 'monthly_info' ?
                    <OnDemandMonthly/> : undefined}

            </div>
        );
    }
}