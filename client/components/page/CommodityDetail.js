/**
 * Created by imgyucheol on 2017. 9. 11..
 */

import React from 'react';
import axios from 'axios';
import history from '../../history';
import TopNavigator from '../common/TopNavigator';
import resource from './StaticResource';
import async from 'async';
import './css/Commodities.css';

export default class CommodityDetail extends React.Component {

    constructor(props) {
        super(props);

        this.defaultState = {
            category: undefined,
            commodity: {
                NO: '',
                DCLS_MONTH: '',
                FIN_CO_NO: '',
                KOR_CO_NM: '',
                FIN_PRDT_CD: '',
                FIN_PRDT_NM: '',
                JOIN_WAY: '',
                MTRT_INT: '',
                SPCL_CND: '',
                JOIN_DENY: '',
                JOIN_MEMBER: '',
                ETC_NOTE: '',
                MAX_LIMIT: '',
                DCLS_STRT_DAY: '',
                DCLS_END_DAY: '',
                FIN_CO_SUBM_DAY: ''
            },
            option: [],
            processedInfo: {},
            special: []
        };
        this.state = this.defaultState;
        this.handleClickBack = this.handleClickBack.bind(this);
    }

    handleClickBack() {
        history.go(-1);
    }

    getCommodityDetail(params, callback) {
        axios.post(`/api/commodity/search/detail`, params).then((commodity) => {
            if ((typeof commodity.data) !== 'string') {
                callback(null, commodity.data[0], params.category);
            } else {
                // 등록된 상품이 없거나, 잘못 접근함 -> redirect
                history.push(`/fail`);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getCommodityOptions(commodity, category, callback) {
        axios.post(`/api/commodity/search/option`, {
            category: resource.getOptionName(category),
            commodity: commodity
        }).then((option) => {
            console.log(option.data);
            callback(null, commodity, category, option.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    getCommodityProcessedInfo(commodity, category, option, callback) {
        axios.post('/api/commodity/search/processedInfo', {
            category: category,
            commodity: commodity
        }).then((processedInfo) => {
            console.log(processedInfo);
            callback(null, commodity, category, option, processedInfo.data[0]);
        }).catch((error) => {
            console.log(error);
        });
    }

    getCommoditySpecial(commodity, category, option, processedInfo, callback) {
        axios.post('/api/commodity/search/special', {
            category: category,
            commodity: commodity
        }).then((special) => {
            console.log(special);
            callback(null, commodity, category, option, processedInfo, special.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        let parseUrl = window.location.pathname.split('/');
        let param = {
            category: parseUrl[3],
            paramNo: parseUrl[4]
        };

        // axios.post('//freegeoip.net/json/', {}).then((location)=>{
        //     console.log(location);
        // }).catch((error)=>{
        //     console.log(error);
        // });

        let tasks = [
            async.apply(this.getCommodityDetail, param),
            this.getCommodityOptions,
            this.getCommodityProcessedInfo,
            this.getCommoditySpecial
        ];

        async.waterfall(tasks, (err, commodity, category, option, processedInfo, special) => {
            this.setState({
                commodity: commodity,
                category: category,
                option: option,
                processedInfo: processedInfo,
                special: special
            });
            window.scrollTo(0, 1);
        });

        axios.post('/api/commodity/insert/visitLog', param).then((result)=>{
            console.log(result);
        }).catch((error)=>{
            console.log(error);
        });
    }

    renderSplitLineIntro(title, multiLineValue) {
        if (multiLineValue === '') {
            return undefined;
        }
        return (
            <div className="commodity-detail-sub-div">
                <div className="commodity-lined-title"><strong>{title}</strong></div>
                <div className="commodity-multiple-lined-div">
                    {multiLineValue.split('\n').map((item, key) => {
                        if (item !== '')
                            return <span key={key}>{item}<br/></span>
                    })}
                </div>
            </div>
        );
    }

    renderMainSubIntro(title, value) {
        return (
            <div>
                <div className="main-sub-title">{title}</div>
                <div className="main-sub-content">{value}</div>
            </div>
        );
    }

    render() {
        let bankIndex = resource.bankCodes.indexOf(this.state.commodity['FIN_CO_NO']);

        return (
            <div className="item-whole-div">
                <div className="commodity-main-background" />
                <div className="commodity-detail-main-title-div">
                    <div className="nav-icon-div detail-back" onClick={this.handleClickBack}>
                        <i className="fa fa-chevron-left fa-lg" aria-hidden="true"/>
                    </div>

                    <div className="commodity-detail-bank-title">
                        {this.state.commodity['KOR_CO_NM']}
                    </div>
                    <div className="commodity-detail-product-title">
                        {`< ${this.state.commodity['FIN_PRDT_NM']} >`}
                    </div>

                    <div className="clear-div-3"/>
                    <div className="title-min-money">
                        {`${this.state.category === 'savings_info' ? '월 ' : ''}
                        최소 ${this.state.processedInfo['MIN_MONEY'] === null ?
                        '1,000원' : (resource.moneyWithComma(this.state.processedInfo['MIN_MONEY']) + "원")}부터 ~`}
                    </div>
                    <div className="title-max-money">
                        {`최대 ${this.state.processedInfo['MAX_MONEY'] === null ?
                        '제한없이' : (resource.moneyWithComma(this.state.processedInfo['MAX_MONEY']) + "원까지")}
                        ${this.state.category === 'savings_info' ? '적립' : '예치'}가능`}
                    </div>
                    <div className="title-intr-type">
                        {`이 상품은
                        ${this.state.commodity['INTR_RATE_TYPE'] !== 'M' ? '단리' : '복리'}
                         방식입니다.`}
                    </div>

                    <div className="item-section-div commodity-section">
                        <div className="commodity-detail-wrap">
                            <div className="commodity-detail-sub-div">
                                <div>{'가입대상'}</div>
                                <div className="detail-join-member-div">
                                    {this.state.commodity['JOIN_MEMBER'].split('\n').map((item, key) => {
                                        if (item !== '')
                                            return <span key={key}>{item}<br/></span>
                                    })}
                                </div>
                            </div>

                            {/* 적금의경우 자유적립식과 정액적립식이 같이나오는 경우가 존재한다. */}
                            <div className="commodity-detail-sub-div">
                                <div>{'개월별 기본금리'}</div>
                                <table className="commodity-detail-table">
                                    <thead>
                                    <tr>
                                        <td><strong>{'개월'}</strong></td>
                                        <td><strong>{'금리'}</strong></td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.option.length !== 0 ? this.state.option.map((option, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{option['SAVE_TRM']}</td>
                                                <td>{`${resource.getRoundThirdDecimalPlace(option['INTR_RATE'])} %`}</td>
                                            </tr>
                                        );
                                    }) : undefined}
                                    </tbody>
                                </table>
                            </div>

                            {this.state.category === 'savings_info' ?
                                this.renderMainSubIntro('적금적립방식', this.state.processedInfo['RSRV_TYPE'] === 'F' ? '자유적립식' : '정액적립식')
                                : undefined}
                            {this.renderMainSubIntro('이자계산방법', this.state.commodity['INTR_RATE_TYPE'] !== 'M' ? '단리' : '복리')}
                            {this.renderMainSubIntro('최소금액', this.state.processedInfo['MIN_MONEY'] === null ?
                                '1,000원' : (resource.moneyWithComma(this.state.processedInfo['MIN_MONEY']) + "원"))}
                            {this.renderMainSubIntro('최대금액', this.state.processedInfo['MAX_MONEY'] === null ?
                                '제한없음' : (resource.moneyWithComma(this.state.processedInfo['MAX_MONEY']) + "원"))}


                            {this.state.special.length !== 0 ?
                                <div className="commodity-detail-sub-div">
                                    <div>{'우대조건'}</div>
                                    <table className="commodity-detail-table special-table">
                                        <thead>
                                        <tr>
                                            <td><strong>{'조건'}</strong></td>
                                            <td><strong>{'추가금리'}</strong></td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.special.map((special, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{special['SPECIAL_CONDITION']}</td>
                                                    <td>{`+ ${special['SPECIAL_INTR']} %`}</td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <td colSpan="2">
                                                <strong>{`이 상품의 최대금리는 `}
                                                    <mark>{this.state.special[0]['MAX_INTR']}</mark>
                                                    {`%입니다`}</strong>
                                            </td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                : undefined
                            }

                            <div className="commodity-detail-sub-div">
                                <div>가입경로</div>
                                <div className="detail-join-member-div">
                                    {this.state.commodity['JOIN_WAY']}
                                </div>
                            </div>

                            {this.renderSplitLineIntro('만기 후 처리', this.state.commodity['MTRT_INT'])}
                            {this.renderSplitLineIntro('기타 유의사항', this.state.commodity['ETC_NOTE'])}

                            {/*{this.renderSimpleIntro('가입제한', this.state.commodity['JOIN_DENY'] === 1 ? '제한없음' : '제한있음')}*/}
                            {/*{this.renderSimpleIntro('시작일', this.state.commodity['DCLS_STRT_DAY'])}*/}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * 가입대상
 * 최소금액 최대금액
 *
 * 이자계산방법
 *
 * 만기후 처리 (금리 변동)
 *
 * 기타유의사항
 *
 * 개월별 금리
 * 우대금리
 * 최대금리
 */
