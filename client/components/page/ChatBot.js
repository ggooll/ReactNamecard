import React from 'react';
import Bot from 'react-simple-chatbot';
import './css/page.css';
import PropTypes from 'prop-types';
import axios from 'axios';
import history from '../../history';
import async from 'async';

class Review extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items : [],
            type: '',
            period: '',
            amount: '',
            // deposit_period: '',
            // deposit_amount: '',
            join_way:'',
            // NO:'',
            // KOR_CO_NM:'',
            // FIN_PRDT_NM:'',
            // SPCL_CND:'',
            // INTR_RATE:'',
            // INTR_RATE2:'',
            // commodity: {
            //     NO: '',
            //     DCLS_MONTH: '',
            //     FIN_CO_NO: '',
            //     KOR_CO_NM: '',
            //     FIN_PRDT_CD: '',
            //     FIN_PRDT_NM: '',
            //     JOIN_WAY: '',
            //     MTRT_INT: '',
            //     SPCL_CND: '',
            //     JOIN_DENY: '',
            //     JOIN_MEMBER: '',
            //     ETC_NOTE: '',
            //     MAX_LIMIT: '',
            //     DCLS_STRT_DAY: '',
            //     DCLS_END_DAY: '',
            //     FIN_CO_SUBM_DAY: ''
            // },
            // option: [{},]
        };
    }

    componentWillMount() {
        const { steps } = this.props;
        console.dir("willMount : "+steps);
        if(steps.type.value==1){
            const { type, deposit_period, deposit_amount, join_way } = steps;
            this.setState({ type:type, period:deposit_period, amount:deposit_amount, join_way:join_way });
        }else{
            const { type, savings_period, savings_amount, join_way } = steps;
            this.setState({ type:type, period:savings_period, amount:savings_amount, join_way:join_way });
        }
        // this.setState({ type, deposit_period, deposit_amount, join_way });
        axios.post(`/api/chat/recommend`, {data: this.state}).then((items) => {
            console.log("return");
            console.dir(items.data);
            this.setState({
                // NO: items.data.NO,
                // KOR_CO_NM:items.data.KOR_CO_NM,
                // FIN_PRDT_NM:items.data.FIN_PRDT_NM,
                // SPCL_CND:items.data.SPCL_CND,
                // INTR_RATE:items.data.INTR_RATE,
                // INTR_RATE2:items.data.INTR_RATE2,
                items: items.data
            });
            console.log(this.state.items);
            //callback();
        }).catch((error) => {
            console.log(error);
        });

    }
    componentDidMount(){
        console.log('==========');
        console.dir(this.state);

        axios.post(`/api/chat/recommend`, {data: this.state}).then((items) => {
            console.log("return");
            console.dir(items.data);
            this.setState({
                // NO: items.data.NO,
                // KOR_CO_NM:items.data.KOR_CO_NM,
                // FIN_PRDT_NM:items.data.FIN_PRDT_NM,
                // SPCL_CND:items.data.SPCL_CND,
                // INTR_RATE:items.data.INTR_RATE,
                // INTR_RATE2:items.data.INTR_RATE2,
                items: items.data
            });
            console.log(this.state.items);
            //callback();
        }).catch((error) => {
            console.log(error);
        });
    }

    // getCommodityOptions(component, commodity, category, callback) {
    //     axios.post(`/api/commodity/search/option`, {
    //         category: resource.getOptionName(category),
    //         commodity: commodity
    //     }).then((option) => {
    //         component.setState({
    //             option: option
    //         });
    //     }).catch((error) => {
    //         console.log(error);
    //     });
    //     callback();
    // }

    handleClickBaroLink(productNo, type){
        let empcode = location.pathname.split('/')[1];
        let option ='';
        if(type==1){
            option='deposit_info';
        }else{
            option='savings_info';
        }
        let no = productNo;
        history.push(`/${empcode}/products/${option}/${no}`);
    }

    renderFirstProduct(){
        let index = 0;
        let filteredItems = this.state.items.filter((item)=>{
            // if(item["NO"] === 171){
            //     return item;
            // }
            return item;
        });

        // async.waterfall([
        //     function(callback){
        //     console.log(tt);
        //         filteredItems = this.state.items.filter((item)=>{
        //             // if(item["NO"] === 171){
        //             //     return item;
        //             // }
        //             return item;
        //         });
        //         callback(null,filteredItems);
        //     }],
        //     function(err,result){
        //         let intr_rate = result[0]["INTR_RATE"];
        //         let temp = (()=>{
        //             let intr_rate = Number(result[0]["INTR_RATE"]);
        //             let amount = Number(this.state.amount.value);
        //             let period = Number(this.state.period.value);
        //             if(result[0]["INTR_RATE_TYPE"]==='S'){
        //                 //월납 적금 만기수령액(세전) = 적립 원금 + 이자
        //                 //적립 원금: 월납입금 * n(개월수)
        //                 //이자(단리): 월납입금 * n(n+1)/2 * r/12
        //                 console.log('단리');
        //                 return (amount*period)+(amount*period(period+1)/2*intr_rate*0.01/12);
        //             }else{
        //                 //매월 복리: 원금*(1+r/12)(n×12/12)
        //                 console.log('복리');
        //                 return 0;//(deposit_amount*(1+intr_rate*0.01/12)**(deposit_period*12/12)).toFixed(0);
        //             }
        //         })();
        //         let intr_rate2 = result[0]["INTR_RATE2"].toFixed(2);
        //         str = '해당 상품을'+ this.state.period.value+'개월동안 월'+this.state.amount.value+'원을 저금시 세전 실수령액은 총'+temp+'원입니다';
        //     });

        if(this.state.type.value==1){
            return (filteredItems.length !== 0 ?
                <div>
                    <p>[{filteredItems[0]["KOR_CO_NM"]}] </p>
                    <p> {filteredItems[0]["FIN_PRDT_NM"]}상품이 딱이네요!</p>
                    <ul>
                        {<li> 기본금리 : {(filteredItems[0]["INTR_RATE"]).toFixed(2)}%</li>}
                        {<li> 최대금리 : {(filteredItems[0]["INTR_RATE2"]).toFixed(2)}%</li>}
                        <li> 우대조건 : {filteredItems[0]["SPCL_CND"]}</li>
                    </ul>

                    <p>해당 상품을 {this.state.period.value}개월동안 {this.state.amount.value}원을 예치시 세전 실수령액은 총
                        {(()=>{
                            let intr_rate = Number(filteredItems[0]["INTR_RATE"]);
                            let deposit_amount = Number(this.state.amount.value);
                            let deposit_period = Number(this.state.period.value);
                            if(filteredItems[0]["INTR_RATE_TYPE"]==='S'){
                                //단리(單利): 원금*(1+r*n/12)
                                console.log('단리');
                                return (deposit_amount*(1+intr_rate*0.01*deposit_period/12)).toFixed(0);
                            }else{
                                //매월 복리: 원금*(1+r/12)(n×12/12)
                                console.log('복리');
                                return (deposit_amount*(1+intr_rate*0.01/12)**(deposit_period*12/12)).toFixed(0);
                            }
                        })()}원 입니다</p>
                    <a onClick={this.handleClickBaroLink.bind(this, filteredItems[0]["NO"], this.state.type.value)}>바로가기</a>
                </div>
                : <div><p>상품이 없습니다.</p></div>);
        }else{
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
                        {(()=>{
                            let intr_rate = Number(filteredItems[0]["INTR_RATE"]);
                            let amount = Number(this.state.amount.value);
                            let period = Number(this.state.period.value);
                            if(filteredItems[0]["INTR_RATE_TYPE"]==='S'){
                                //월납 적금 만기수령액(세전) = 적립 원금 + 이자
                                //적립 원금: 월납입금 * n(개월수)
                                //이자(단리): 월납입금 * n(n+1)/2 * r/12
                                console.log('단리');
                                return (amount*period)+(amount*period*(period+1)/2*intr_rate*0.01/12);
                            }else{
                                //매월 복리: 원금*(1+r/12)(n×12/12)
                                console.log('복리');
                                return 0;//(deposit_amount*(1+intr_rate*0.01/12)**(deposit_period*12/12)).toFixed(0);
                            }
                        })()}원 입니다</p>
                    <a onClick={this.handleClickBaroLink.bind(this, filteredItems[0]["NO"], this.state.type.value)}>바로가기</a>
                </div>
                :  <div><p>상품이 없습니다.</p></div>);
        }
    }
    render() {
        //const { type, deposit_period, deposit_amount, join_way, items } = this.state;
        return (
            <div style={{ width: '100%' }}>
                <h3>추천상품</h3>
                <div>
                    {this.renderFirstProduct()}
                </div>

                {/*<table>*/}
                    {/*<tbody>*/}
                    {/*<tr>*/}
                        {/*<td>type</td>*/}
                        {/*<td>{type.value}</td>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                        {/*<td>deposit_period</td>*/}
                        {/*<td>{deposit_period.value}</td>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                        {/*<td>deposit_amount</td>*/}
                        {/*<td>{deposit_amount.value}</td>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                        {/*<td>join_way</td>*/}
                        {/*<td>{join_way.value}</td>*/}
                    {/*</tr>*/}
                    {/*/!*<tr>*!/*/}
                        {/*/!*<td>join_way</td>*!/*/}
                        {/*/!*<td>{item !== 'undefined' ? item["NO"] : 'T_T'}</td>*!/*/}
                    {/*/!*</tr>*!/*/}
                    {/*<tr>*/}
                        {/*<td>join_way</td>*/}
                        {/*<td>{this.renderFirstProduct()}</td>*/}
                    {/*</tr>*/}

                    {/*/!*<tr>*!/*/}
                        {/*/!*<td>NO</td>*!/*/}
                        {/*/!*<td>{items[0].NO.value}</td>*!/*/}
                    {/*/!*</tr>*!/*/}
                    {/*/!*<tr>*!/*/}
                        {/*/!*<td>FIN_PRDT_NM</td>*!/*/}
                        {/*/!*<td>{items[0].FIN_PRDT_NM}</td>*!/*/}
                    {/*/!*</tr>*!/*/}
                    {/*/!*<tr>*!/*/}
                        {/*/!*<td>KOR_CO_NM</td>*!/*/}
                        {/*/!*<td>{items[0].KOR_CO_NM}</td>*!/*/}
                    {/*/!*</tr>*!/*/}
                    {/*/!*<tr>*!/*/}
                        {/*/!*<td>SPCL_CND</td>*!/*/}
                        {/*/!*<td>{items[0].SPCL_CND}</td>*!/*/}
                    {/*/!*</tr>*!/*/}
                    {/*/!*<tr>*!/*/}
                        {/*/!*<td>INTR_RATE</td>*!/*/}
                        {/*/!*<td>{items[0].INTR_RATE}</td>*!/*/}
                    {/*/!*</tr>*!/*/}
                    {/*/!*<tr>*!/*/}
                        {/*/!*<td>INTR_RATE2</td>*!/*/}
                        {/*/!*<td>{items[0].INTR_RATE2}</td>*!/*/}
                    {/*/!*</tr>*!/*/}
                    {/*</tbody>*/}
                {/*</table>*/}
            </div>

        );
    }
}
Review.propTypes = {
    steps: PropTypes.object,
};

Review.defaultProps = {
    steps: undefined,
};
export default class ChatBot extends React.Component{

    componentDidMount() {
        this.handleEnd = this.handleEnd.bind(this);
    }
    handleEnd({ steps, values }) {
        console.log("step:"+steps);
        console.log("value: "+values);
        console.log(`Chat handleEnd callback! Number: ${values[0]}`);
        console.log(this.state);
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
                                { value: '1', label: '상품 추천', trigger: '3' },
                                { value: '2', label: '자주 묻는 질문(FAQ) ', trigger: '4' },
                            ],
                        },
                        {
                            id: '3',
                            message: '패턴 및 스타일을 선택해주시면 "내게 맞는 상품"을 추천해 드리겠습니다',
                            trigger:'type',
                        },
                        {
                            id: '4',
                            message: 'FAQ',
                            trigger:'1',
                        },
                        {
                            id: 'type',
                            options: [
                                { value: '1', label: '예금', trigger: 'deposit' },
                                { value: '2', label: '적금 ', trigger: 'savings' },
                                { value: '3', label: '이전', trigger: '1' },
                            ],
                        },
                        {
                            id: 'deposit',
                            message: '예금을 선택하셨군요. 예치기간을 선택해 주세요.',
                            trigger:'deposit_period',
                        },
                        {
                            id: 'savings',
                            message: '적금을 선택하셨군요. 가입기간을 선택해 주세요.',
                            trigger:'savings_period',
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
                                { value: '3', label: '3개월이하', trigger: '21' },
                                { value: '6', label: '6개월 ', trigger: '21' },
                                { value: '12', label: '1년', trigger: '21' },
                                { value: '24', label: '2년', trigger: '21' },
                                { value: '36', label: '3년', trigger: '21' },
                                { value: '60', label: '5년이상', trigger: '21' },
                                { value: '8', label: '이전', trigger: '3' },
                                { value: '9', label: '처음', trigger: '1' },
                            ],
                        },
                        {
                            id: '5',
                            message: '{previousValue}개월을 선택하셨군요. 예치금액을 선택해 주세요.',
                            trigger:'deposit_amount',
                        },
                        {
                            id: '21',
                            message: '{previousValue}개월을 선택하셨군요. 월저금액을 선택해 주세요.',
                            trigger:'savings_amount',
                        },
                        {
                            id: 'deposit_amount',
                            options: [
                                { value: '1000000', label: '백만원', trigger: '7' },
                                { value: '5000000', label: '오백만원', trigger: '7' },
                                { value: '10000000', label: '천만원', trigger: '7' },
                                { value: '30000000', label: '삼천만원', trigger: '7' },
                                { value: '50000000', label: '오천만원', trigger: '7' },
                                { value: '100000000', label: '일억원', trigger: '7' },
                                { value: '8', label: '직접입력', trigger: '6' },
                                { value: '9', label: '이전', trigger: 'deposit' },
                                { value: '10', label: '처음', trigger: '1' },
                            ],
                        },
                        {
                            id: 'savings_amount',
                            options: [
                                { value: '10000', label: '만원', trigger: '7' },
                                { value: '50000', label: '오만원', trigger: '7' },
                                { value: '100000', label: '십만원', trigger: '7' },
                                { value: '300000', label: '삽십만원', trigger: '7' },
                                { value: '500000', label: '오십만원', trigger: '7' },
                                { value: '1000000', label: '백만원', trigger: '7' },
                                { value: '8', label: '직접입력', trigger: '6' },
                                { value: '9', label: '이전', trigger: 'savings' },
                                { value: '10', label: '처음', trigger: '1' },
                            ],
                        },
                        {
                            id: '6',
                            user:true,
                            trigger:'7',
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
                            trigger:'join_way',
                        },
                        {
                            id: 'join_way',
                            options:[
                                {value:'인터넷',label:'인터넷',trigger:'final'},
                                {value:'스마트폰',label:'스마트폰',trigger:'final'},
                                {value:'영업점',label:'영업점',trigger:'final'},
                                {value:'8',label:'이전',trigger:'3'},
                                {value:'9',label:'처음',trigger:'1'},
                            ],
                        },
                        {
                            id:'final',
                            component: <Review />,
                            end:true
                        },
                    ]}
                />
            </div>
        );
    }
}