/**
 * Created by imgyucheol on 2017. 10. 10..
 */
import React from 'react';
import Bot from 'react-simple-chatbot';
import ChatReview from './ChatReview';
import {ThemeProvider} from 'styled-components';
import './css/page.css';
import './css/ChatBot.css';
import TopNavigator from "../common/TopNavigator";

export default class ChatBot extends React.Component {

    constructor(props){
        super(props);


        this.handleEnd = this.handleEnd.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 1);
    }

    handleEnd({steps, values}) {
        // console.log("step:" + steps);
        // console.log("value: " + values);
        // console.log(`Chat handleEnd callback! Number: ${values[0]}`);
        // console.log(this.state);
    }

    render() {
        const theme = {
            background: '#f5f8fb',
            headerBgColor: '#008485',
            headerFontColor: '#fff',
            headerFontSize: '15px',
            botBubbleColor: '#008485',
            botFontColor: '#fff',
            userBubbleColor: '#fff',
            userFontColor: '#4a4a4a',
        };

        let steps = [
            {
                id: '1',
                message: '안녕하세요! 상품 추천, 자주 묻는 질문(FAQ) 중 하나를 선택해 주세요.',
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
                trigger: '50',
            },
            {
                id: 'type',
                options: [
                    {value: '1', label: '예금상품', trigger: 'deposit'},
                    {value: '2', label: '적금상품', trigger: 'savings'},
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
                    {value: '6', label: '6개월', trigger: '5'},
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
                    {value: '6', label: '6개월', trigger: '21'},
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
                message: '{previousValue}개월을 선택하셨습니다. 예치금액을 선택해 주세요.',
                trigger: 'deposit_amount',
            },
            {
                id: '21',
                message: '{previousValue}개월을 선택하셨습니다. 월 저금액을 선택해 주세요.',
                trigger: 'savings_amount',
            },
            {
                id: 'deposit_amount',
                options: [
                    {value: '1000000', label: '100만원', trigger: '8'},
                    {value: '5000000', label: '500만원', trigger: '8'},
                    {value: '10000000', label: '1000만원', trigger: '8'},
                    {value: '30000000', label: '3000만원', trigger: '8'},
                    {value: '50000000', label: '5000만원', trigger: '8'},
                    {value: '100000000', label: '1억원', trigger: '8'},
                    {value: '0', label: '직접입력', trigger: 'input_val'},
                    {value: '9', label: '이전', trigger: 'deposit'},
                    {value: '10', label: '처음', trigger: '1'},
                ],
            },
            {
                id: 'savings_amount',
                options: [
                    {value: '100000', label: '10만원', trigger: '8'},
                    {value: '300000', label: '30만원', trigger: '8'},
                    {value: '500000', label: '50만원', trigger: '8'},
                    {value: '1000000', label: '100만원', trigger: '8'},
                    {value: '0', label: '직접입력', trigger: 'input_val'},
                    {value: '9', label: '이전', trigger: 'savings'},
                    {value: '10', label: '처음', trigger: '1'},
                ],
            },
            {
                id: 'input_val',
                user: true,
                trigger: '8',
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
                id: '8',
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
                id: '50',
                component: (
                    <div className="faq-div">
                        <div className="faq-question-div"> (FAQ) 아래 중에 궁금하신 내용이 있나요? </div>
                        <div> 1. 예금 상품 해지시 방문하여야 할 영업점은 꼭 개설점인가요? </div>
                        <div> 2. 적금을 이체 날짜보다 늦게 입금한다면 불이익이 있나요? </div>
                        <div> 3. 입출금형 예금 이율을 알려주세요. </div>
                        <div> 4. 세금우대 통장에 대해 알려주세요. </div>
                        <div> 5. 입출금 통장의 이자는 언제 나오나요? </div>
                        <div> 번호를 클릭하시면 상세 내용을 보여드립니다. </div>
                    </div>
                ),
                trigger: '101',
            },
            {
                id: '101',
                options: [
                    {value: '1', label: '1번', trigger: '102'},
                    {value: '2', label: '2번', trigger: '103'},
                    {value: '3', label: '3번', trigger: '104'},
                    {value: '4', label: '4번', trigger: '105'},
                    {value: '5', label: '5번', trigger: '106'},
                    {value:'1000', label:'이전', trigger: '50'},
                    {value:'1001', label:'처음', trigger:'1'}
                ],
            },
            {
                id:'102',
                component: (
                    <div className="faq-div">
                        <div className="faq-question-div"> Q. 예금 상품 해지시 방문하여야 할 영업점은 꼭 개설점인가요? </div>
                        <div> A. 예금 및 적금 상품을 가입하신 후 해지시에는 가까운 당행 영업점에서 해지처리를 하실 수 있습니다 </div>
                    </div>
                ),
                trigger:'110',
            },
            {
                id:'103',
                component: (
                    <div className="faq-div">
                        <div className="faq-question-div"> Q. 적금을 이체 날짜보다 늦게 입금한다면 불이익이 있나요?? </div>
                        <div> A. 현재 예금주의 사정에 의해 납입 기일을 경과하여 납입한 경우에는 만기일을 이연할 수가 있습니다. </div>
                        <div> 납기기일이 공유힐인 경우에는 공휴일에 이은 익영업일에 납부하여도 납입지연으로 보지 않고 있습니다. </div>
                        <div> 그러므로 만약 손님께서 납입 하시는 날짜를 늦게 입금하셨다면 다음 입금시에 지연일수 만큼 더 일찍 넣으시면 이연되는 날짜가 줄어들게 됩니다. </div>
                        <div> 만약 계속해서 늦게 입금처리가 되는 경우에는 만기일을 약정하셨던 날에서 지연한 날짜 만큼 경과한 후 해지 하시면 됩니다. </div>
                    </div>
                ),
                trigger:'110',
            },
            {
                id:'104',
                component: (
                    <div className="faq-div">
                        <div className="faq-question-div"> Q. 입출금형 예금 이율을 알려주세요. </div>
                        <div> A. 시장금리의 변동에 따라 금리의 변화가 있을 수 있습니다. </div>
                        <div> 입출금형 통장의 종류와 적용이율 확인은 당행 홈페이지 메인화면에서 금융상품몰 클릭 후 하단에 금리안내 클릭하여 자유입출금 선택하여 확인할 수 있습니다. </div>
                    </div>
                ),
                trigger:'110',
            },
            {
                id:'105',
                component: (
                    <div className="faq-div">
                        <div className="faq-question-div"> Q. 세금우대 통장에 대해 알려주세요. </div>
                        <div> A. 세금우대제도는 만기시 지급받는 이자 소득에 과세되는 소득세를 우대해 주는 내용으로 주민세를 면제하고 소득세 9% 및 농특세 0.5%를 원천징수함으로</div>
                        <div> 실제 손님께서 받게 되는 만기 원리금이 늘어나는 효과를 가져오는 제도 입니다. </div>
                        <div> 세금우대 혜택을 받으면 일반세율 15.4%가 아니라 우대세율 9.5%를 적용받습니다. </div>
                    </div>
                ),
                trigger:'110',
            },
            {
                id:'106',
                component: (
                    <div className="faq-div">
                        <div className="faq-question-div"> Q. 입출금 통장의 이자는 언제 나오나요 ? </div>
                        <div> A. 보통예금: 연 2회 제공됩니다.</div>
                        <div> (6,12월 제3금요일에 결산하여 토요일에 지급) </div>
                        <div> 저축예금 기업자유예금 가계당좌예금 : 연 4회 제공됩니다. </div>
                        <div> (3,6,9,12월 제3금요일에 결산하여 토요일에 지급) </div>
                    </div>
                ),
                trigger:'110',
            },
            {
                id:'110',
                options:[
                    {value: '1002', label: '이전', trigger: '50'},
                    {value: '1003', label: '처음', trigger: '1'},
                ],
            },
            {
                id: 'final',
                component: <ChatReview />,
                end: true
            }
        ];

        return (
            <div className="docs-example-1">
                <TopNavigator title={'채팅'}/>
                <ThemeProvider theme={theme}>
                    <Bot headerTitle={'채팅'} handleEnd={this.handleEnd} steps={steps}/>
                </ThemeProvider>
            </div>
        );
    }
}