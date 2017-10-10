/**
 * Created by imgyucheol on 2017. 10. 10..
 */
import React from 'react';
import Bot from 'react-simple-chatbot';
import './css/page.css';
import axios from 'axios';
import history from '../../history';
import async from 'async';

class Review extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            type: '',
            period: '',
            amount: '',
            join_way: '',
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
        if (steps.type.value === "1") {
            const {type, deposit_period, deposit_amount, join_way} = steps;
            param = {type: type, period: deposit_period, amount: deposit_amount, join_way: join_way};
        } else {
            const {type, savings_period, savings_amount, join_way} = steps;
            param = {type: type, period: savings_period, amount: savings_amount, join_way: join_way};
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
                type: param.type,
                period: param.period,
                amount: param.amount,
                join_way: param.join_way
            })
        });
    }

    handleClickBaroLink(productNo, type) {
        let empcode = location.pathname.split('/')[1];
        let option = '';
        if (type === "1") {
            option = 'deposit_info';
        } else {
            option = 'savings_info';
        }
        let no = productNo;
        history.push(`/${empcode}/products/${option}/${no}`);
    }

    renderFirstProduct() {
        let index = 0;
        let filteredItems = this.state.items.filter((item) => {
            return item;
        });

        if (this.state.type.value === "1") {
            return (filteredItems.length !== 0 ?
                <div>
                    <p> {filteredItems[0]["KOR_CO_NM"]} </p>
                    <p> {filteredItems[0]["FIN_PRDT_NM"]}상품이 딱이네요!</p>
                    <ul>
                        {<li> 기본금리 : {(filteredItems[0]["INTR_RATE"]).toFixed(2)}%</li>}
                        {<li> 최대금리 : {(filteredItems[0]["INTR_RATE2"]).toFixed(2)}%</li>}
                        <li> 우대조건 : {filteredItems[0]["SPCL_CND"]}</li>
                    </ul>

                    <p>해당 상품을 {this.state.period.value}개월동안 {this.state.amount.value}원을 예치시 세전 실수령액은 총
                        {(() => {
                            let intr_rate = Number(filteredItems[0]["INTR_RATE"]);
                            let deposit_amount = Number(this.state.amount.value);
                            let deposit_period = Number(this.state.period.value);
                            if (filteredItems[0]["INTR_RATE_TYPE"] === 'S') {
                                console.log('단리');
                                return (deposit_amount * (1 + intr_rate * 0.01 * deposit_period / 12)).toFixed(0);
                            } else {
                                console.log('복리');
                                return (deposit_amount * (1 + intr_rate * 0.01 / 12) ** (deposit_period * 12 / 12)).toFixed(0);
                            }
                        })()}원 입니다</p>
                    <a onClick={this.handleClickBaroLink.bind(this, filteredItems[0]["NO"], this.state.type.value)}>바로가기</a>
                </div>
                : <div><p>상품이 없습니다.</p></div>);
        } else {
            return (filteredItems.length !== 0 ?
                <div>
                    <p>[{filteredItems[0]["KOR_CO_NM"]}] </p>
                    <p> {filteredItems[0]["FIN_PRDT_NM"]}상품이 딱이네요!</p>
                    <ul>
                        {<li> 기본금리 : {(filteredItems[0]["INTR_RATE"]).toFixed(2)}%</li>}
                        {<li> 최대금리 : {(filteredItems[0]["INTR_RATE2"]).toFixed(2)}%</li>}
                        <li> 우대조건 : {filteredItems[0]["SPCL_CND"]}</li>
                    </ul>

                    <p>해당 상품을 {this.state.period.value}개월동안 월{this.state.amount.value}원을 저금시 세전 실수령액은 총
                        {(() => {
                            let intr_rate = Number(filteredItems[0]["INTR_RATE"]);
                            let amount = Number(this.state.amount.value);
                            let period = Number(this.state.period.value);
                            if (filteredItems[0]["INTR_RATE_TYPE"] === 'S') {
                                console.log('단리');
                                return (amount * period) + (amount * period * (period + 1) / 2 * intr_rate * 0.01 / 12);
                            } else {
                                console.log('복리');
                                return 0;
                            }
                        })()}원 입니다</p>
                    <a onClick={this.handleClickBaroLink.bind(this, filteredItems[0]["NO"], this.state.type.value)}>바로가기</a>
                </div>
                : <div><p>상품이 없습니다.</p></div>);
        }
    }

    render() {
        return (
            <div style={{width: '100%'}}>
                <h3>추천상품</h3>
                <div>
                    {this.state.items.length !== 0 ? this.renderFirstProduct() : undefined}
                </div>
            </div>

        );
    }
}

export default class ChatBot extends React.Component {

    componentDidMount() {
        this.handleEnd = this.handleEnd.bind(this);
    }

    handleEnd({steps, values}) {
        // console.log("step:" + steps);
        // console.log("value: " + values);
        // console.log(`Chat handleEnd callback! Number: ${values[0]}`);
        // console.log(this.state);
    }

    render() {
        return (
            <div className="docs-example-1">
                <Bot
                    handleEnd={this.handleEnd}
                    steps={[
                        {
                            id: '1',
                            message: '상품 추천, 자주 묻는 질문(FAQ) 중 하나를 선택해 주세요.',
                            trigger: '2',
                        },
                        {
                            id: '2',
                            options: [
                                {value: '1', label: '상품 추천', trigger: '3'},
                                {value: '2', label: '자주 묻는 질문(FAQ) ', trigger: '4'},
                            ],
                        },
                        {
                            id: '3',
                            message: '패턴 및 스타일을 선택해주시면 "내게 맞는 상품"을 추천해 드리겠습니다',
                            trigger: 'type',
                        },
                        {
                            id: '4',
                            message: 'FAQ',
                            trigger: '1',
                        },
                        {
                            id: 'type',
                            options: [
                                {value: '1', label: '예금', trigger: 'deposit'},
                                {value: '2', label: '적금 ', trigger: 'savings'},
                                {value: '3', label: '이전', trigger: '1'},
                            ],
                        },
                        {
                            id: 'deposit',
                            message: '예금을 선택하셨군요. 예치기간을 선택해 주세요.',
                            trigger: 'deposit_period',
                        },
                        {
                            id: 'savings',
                            message: '적금을 선택하셨군요. 가입기간을 선택해 주세요.',
                            trigger: 'savings_period',
                        },
                        {
                            id: 'deposit_period',
                            options: [
                                {value: '3', label: '3개월이하', trigger: '5'},
                                {value: '6', label: '6개월 ', trigger: '5'},
                                {value: '12', label: '1년', trigger: '5'},
                                {value: '24', label: '2년', trigger: '5'},
                                {value: '36', label: '3년', trigger: '5'},
                                {value: '60', label: '5년이상', trigger: '5'},
                                {value: '8', label: '이전', trigger: '3'},
                                {value: '9', label: '처음', trigger: '1'},
                            ],
                        },
                        {
                            id: 'savings_period',
                            options: [
                                {value: '3', label: '3개월이하', trigger: '21'},
                                {value: '6', label: '6개월 ', trigger: '21'},
                                {value: '12', label: '1년', trigger: '21'},
                                {value: '24', label: '2년', trigger: '21'},
                                {value: '36', label: '3년', trigger: '21'},
                                {value: '60', label: '5년이상', trigger: '21'},
                                {value: '8', label: '이전', trigger: '3'},
                                {value: '9', label: '처음', trigger: '1'},
                            ],
                        },
                        {
                            id: '5',
                            message: '{previousValue}개월을 선택하셨군요. 예치금액을 선택해 주세요.',
                            trigger: 'deposit_amount',
                        },
                        {
                            id: '21',
                            message: '{previousValue}개월을 선택하셨군요. 월저금액을 선택해 주세요.',
                            trigger: 'savings_amount',
                        },
                        {
                            id: 'deposit_amount',
                            options: [
                                {value: '1000000', label: '백만원', trigger: '7'},
                                {value: '5000000', label: '오백만원', trigger: '7'},
                                {value: '10000000', label: '천만원', trigger: '7'},
                                {value: '30000000', label: '삼천만원', trigger: '7'},
                                {value: '50000000', label: '오천만원', trigger: '7'},
                                {value: '100000000', label: '일억원', trigger: '7'},
                                {value: '8', label: '직접입력', trigger: '6'},
                                {value: '9', label: '이전', trigger: 'deposit'},
                                {value: '10', label: '처음', trigger: '1'},
                            ],
                        },
                        {
                            id: 'savings_amount',
                            options: [
                                {value: '10000', label: '만원', trigger: '7'},
                                {value: '50000', label: '오만원', trigger: '7'},
                                {value: '100000', label: '십만원', trigger: '7'},
                                {value: '300000', label: '삽십만원', trigger: '7'},
                                {value: '500000', label: '오십만원', trigger: '7'},
                                {value: '1000000', label: '백만원', trigger: '7'},
                                {value: '8', label: '직접입력', trigger: '6'},
                                {value: '9', label: '이전', trigger: 'savings'},
                                {value: '10', label: '처음', trigger: '1'},
                            ],
                        },
                        {
                            id: '6',
                            user: true,
                            trigger: '7',
                            validator: (value) => {
                                if (isNaN(value)) {
                                    return 'value must be a number';
                                } else if (value < 0) {
                                    return 'value must be positive';
                                }

                                return true;
                            },
                        },
                        {
                            id: '7',
                            message: '가입 방법을 선택하세요.',
                            trigger: 'join_way',
                        },
                        {
                            id: 'join_way',
                            options: [
                                {value: '인터넷', label: '인터넷', trigger: 'final'},
                                {value: '스마트폰', label: '스마트폰', trigger: 'final'},
                                {value: '영업점', label: '영업점', trigger: 'final'},
                                {value: '8', label: '이전', trigger: '3'},
                                {value: '9', label: '처음', trigger: '1'},
                            ],
                        },
                        {
                            id: 'final',
                            component: <Review />,
                            end: true
                        }
                    ]}
                />
            </div>
        );
    }
}