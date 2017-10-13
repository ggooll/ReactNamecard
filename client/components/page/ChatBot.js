/**
 * Created by imgyucheol on 2017. 10. 10..
 */
import React from 'react';
import Bot from 'react-simple-chatbot';
import ChatReview from './ChatReview';
import {ThemeProvider} from 'styled-components';
import './css/page.css';
import './css/ChatBot.css';

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
                component: <ChatReview />,
                end: true
            }
        ];

        return (
            <div className="docs-example-1">
                <ThemeProvider theme={theme}>
                    <Bot headerTitle={'채팅'} handleEnd={this.handleEnd} steps={steps}/>
                </ThemeProvider>
            </div>
        );
    }
}