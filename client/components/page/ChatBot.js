import React from 'react';
import Bot from 'react-simple-chatbot';
import './css/page.css';
import PropTypes from 'prop-types';
import axios from 'axios';
import history from '../../history';

class Review extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items : [],
            type: '',
            deposit_period: '',
            deposit_amount: '',
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
        const { type, deposit_period, deposit_amount, join_way } = steps;

        this.setState({ type, deposit_period, deposit_amount, join_way });

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

    handleClickBaroLink(productNo){
        let empcode = location.pathname.split('/')[1];
        let option = 'deposit_info';
        let no = productNo;
        history.push(`/${empcode}/products/${option}/${no}`);
    }

    renderFirstProduct(){
        let index = 0;
        let filteredItems = this.state.items.filter((item)=>{
            if(item["NO"] === 171){
                return item;
            }
        });
       // console.dir(this.state.items);
        console.dir(filteredItems);
        //let intr_rate = filteredItems[0]["INTR_RATE"];
        //let intr_rate2 = filteredItems[0]["INTR_RATE2"].toFixed(2);

        return (filteredItems.length !== 0 ?
            <div>
                <p>[{filteredItems[0]["KOR_CO_NM"]}] </p>
                <p> {filteredItems[0]["FIN_PRDT_NM"]}상품이 딱이네요!</p>
                <ul>
                    {<li> 기본금리 : {filteredItems[0]["INTR_RATE"]}</li>}
                    {<li> 최대금리 : {filteredItems[0]["INTR_RATE2"]}</li>}
                    <li> 우대조건 : {filteredItems[0]["SPCL_CND"]}</li>
                </ul>
                <p>해당 상품을 {this.state.deposit_period.value}동안 {this.state.deposit_amount.value}원을 예치시 총 {this.state.deposit_amount.value*filteredItems[0]["INTR_RATE"]/100}원 이자가 붙는다</p>
                <a onClick={this.handleClickBaroLink.bind(this, filteredItems[0]["NO"])}>바로가기</a>
            </div>
            : undefined);
    }


    render() {
        const { type, deposit_period, deposit_amount, join_way, items } = this.state;
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
                                { value: '예금', label: '예금', trigger: 'deposit' },
                                { value: '적금', label: '적금 ', trigger: 'savings' },
                                { value: '3', label: '이전', trigger: '1' },
                            ],
                        },
                        {
                            id: 'deposit',
                            message: '예금을 선택하셨군요. 예치기간을 선택해 주세요.',
                            trigger:'deposit_period',
                        },
                        {
                            id: 'deposit_period',
                            options: [
                                { value: '3', label: '3개월이하', trigger: '5' },
                                { value: '6', label: '6개월 ', trigger: '5' },
                                { value: '12', label: '1년', trigger: '5' },
                                { value: '24', label: '2년', trigger: '5' },
                                { value: '36', label: '3년', trigger: '5' },
                                { value: '60', label: '5년이상', trigger: '5' },
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
                                {value:'8',label:'이전',trigger:'deposit_amount'},
                                {value:'9',label:'처음',trigger:'1'},
                            ],
                        },

                        {
                            id: 'savings',
                            message: '적금을 선택하셨군요. 가입기간을 선택해 주세요.',
                            trigger:'21',
                        },
                        // {
                        //     id: '21',
                        //     options: [
                        //         { value: '1', label: '3개월이하', trigger: '22' },
                        //         { value: '2', label: '6개월 ', trigger: '23' },
                        //         { value: '3', label: '1년', trigger: '24' },
                        //         { value: '5', label: '2년', trigger: '25' },
                        //         { value: '6', label: '3년', trigger: '26' },
                        //         { value: '7', label: '5년이상', trigger: '27' },
                        //         { value: '8', label: '이전', trigger: '3' },
                        //         { value: '9', label: '처음', trigger: '1' },
                        //     ],
                        // },
                        {
                            id: '21',
                            options: [
                                { value: '1', label: '3개월이하', trigger: '1' },
                                { value: '2', label: '6개월 ', trigger: '1' },
                                { value: '3', label: '1년', trigger: '1' },
                                { value: '5', label: '2년', trigger: '1' },
                                { value: '6', label: '3년', trigger: '1' },
                                { value: '7', label: '5년이상', trigger: '1' },
                                { value: '8', label: '이전', trigger: '1' },
                                { value: '9', label: '처음', trigger: '1' },
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