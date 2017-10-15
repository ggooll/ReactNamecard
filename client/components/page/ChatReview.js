/**
 * Created by imgyucheol on 2017. 10. 10..
 */
import React from 'react';
import Loader from 'react-loader';
import history from '../../history';
import resource from './StaticResource';
import axios from 'axios';
import async from 'async';
import './css/page.css';
import './css/ChatBot.css';

export default class ChatReview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            type: '',
            period: '',
            amount: '',
            join_way: '',
            loaded : false
        };
    }

    getItems(param, callback) {
        axios.post(`/api/chat/recommend`, {data: param}).then((items) => {
            callback(null, items.data, param);
        }).catch((error) => {
            console.log(error);
        });
    }

    getParameter(steps, callback) {
        let param = null;
        console.log(steps);
        if (steps.type.value === "1") {
            const {type, deposit_period, deposit_amount, join_way, input_val} = steps;
            param = {type: type, period: deposit_period, amount: deposit_amount.value==0 ? input_val : deposit_amount, join_way: join_way};
        } else {
            const {type, savings_period, savings_amount, join_way, input_val} = steps;
            param = {type: type, period: savings_period, amount: savings_amount.value==0 ? input_val : savings_amount, join_way: join_way};
        }
        callback(null, param);
    }

    componentDidMount() {
        let tasks = [
            async.apply(this.getParameter, this.props.steps),
            this.getItems
        ];

        async.waterfall(tasks, (err, items, param) => {
            this.setState({
                items: items,
                type: param.type.value,
                period: param.period.value,
                amount: param.amount.value,
                join_way: param.join_way.value,
                loaded: true
            })
        });
    }

    handleClickBaroLink(productNo, type) {
        let empCode = location.pathname.split('/')[1];
        let option = '';
        if (type === "1") {
            option = 'deposit_info';
        } else {
            option = 'savings_info';
        }
        let no = productNo;
        history.push(`/${empCode}/products/${option}/${no}`);
    }

    calculateDepositValue(intrRate, type) {
        let depositAmount = Number(this.state.amount);
        let depositPeriod = Number(this.state.period);

        let resValue = type === 'S' ?
            (depositAmount * (1 + intrRate * 0.01 * depositPeriod / 12)).toFixed(0)
            : (depositAmount * (1 + intrRate * 0.01 / 12) ** (depositPeriod * 12 / 12)).toFixed(0);

        return resource.moneyWithComma(resValue);
    }

    calculateSavingsValue(intrRate, type) {
        let amount = Number(this.state.amount);
        let period = Number(this.state.period);

        let resValue = type === 'S' ?
            (amount * period) + (amount * period * (period + 1) / 2 * intrRate * 0.01 / 12)
            : 0;

        return resource.moneyWithComma(resValue);
    }

    renderFirstProduct() {
        let index = 0;
        let filteredItems = this.state.items.filter((item) => {
            return item;
        });

        return (filteredItems.length !== 0 ?
                <div>
                    <div className="result-bank-title"> {filteredItems[0]["KOR_CO_NM"]} </div>
                    <div className="result-product-title">
                        {`${filteredItems[0]["FIN_PRDT_NM"]}
                        상품이 딱이네요!`}
                    </div>
                    <div className="result-special-exp">
                        <ul>
                            {<li> 기본금리 : {(filteredItems[0]["INTR_RATE"]).toFixed(2)}%</li>}
                            {<li> 최대금리 : {(filteredItems[0]["INTR_RATE2"]).toFixed(2)}%</li>}
                            {<li> 우대조건 :
                                {filteredItems[0]["SPCL_CND"].split('\n').map((special)=>{
                                    return <span><br/>{special}</span>
                                })}
                            </li>}
                        </ul>
                    </div>
                    {this.state.type === "1" ?
                        <div>
                            <div className="result-detail-exp">
                                <div>해당 상품을 <span>{this.state.period}</span> 개월동안</div>
                                <div><span>{resource.moneyWithComma(this.state.amount)}</span> 원을 예치시</div>
                                <div>
                                    세전 실수령액은 총 <span>{this.calculateDepositValue(Number(filteredItems[0]["INTR_RATE"]), filteredItems[0]["INTR_RATE_TYPE"])}</span> 원 입니다
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="result-detail-exp">
                                <div>해당 상품을 <span>{this.state.period}</span> 개월동안</div>
                                <div>월 <span>{resource.moneyWithComma(this.state.amount)}</span> 원을 저금시</div>
                                <div>
                                    세전 실수령액은 총 <span>{this.calculateSavingsValue(Number(filteredItems[0]["INTR_RATE"]), filteredItems[0]["INTR_RATE_TYPE"])}</span> 원 입니다
                                </div>
                            </div>
                        </div>
                    }
                    <div className="result-baro-link" onClick={this.handleClickBaroLink.bind(this, filteredItems[0]["NO"], this.state.type)}>
                        {'상품을 자세히 보시겠어요?'}
                    </div>
                </div> :
                <div>
                    <p>상품이 없습니다 T_T</p>
                </div>
        );
    }

    render() {
        return (
            <div style={{width: '100%'}}>
                <Loader loaded={this.state.loaded} color="#008485"  length={10} width={1} radius={10} shadow={true} hwaccel={true} >
                    {this.renderFirstProduct()}
                </Loader>
            </div>

        );
    }
}