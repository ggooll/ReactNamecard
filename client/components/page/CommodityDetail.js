/**
 * Created by imgyucheol on 2017. 9. 11..
 */

import React from 'react';
import axios from 'axios';
import history from '../../history';
import TopNavigator from '../common/TopNavigator';
import resource from './StaticResource';
import async from 'async';

export default class CommodityDetail extends React.Component {

    constructor(props) {
        super(props);

        // 상품 구분
        // 상품 obj
        this.state = {
            category: undefined,
            commodity: {
                NO : '',
                DCLS_MONTH : '',
                FIN_CO_NO : '',
                KOR_CO_NM : '',
                FIN_PRDT_CD : '',
                FIN_PRDT_NM : '',
                JOIN_WAY : '',
                MTRT_INT : '',
                SPCL_CND : '',
                JOIN_DENY : '',
                JOIN_MEMBER : '',
                ETC_NOTE : '',
                MAX_LIMIT : '',
                DCLS_STRT_DAY : '',
                DCLS_END_DAY : '',
                FIN_CO_SUBM_DAY : ''
            },
            option: [{},]
        }
    }

    getCommodityDetail(component, params, callback) {
        axios.post(`/api/commodity/search/detail`, params).then((commodity) => {
            if ((typeof commodity.data) !== 'string') {
                component.setState({
                    commodity: commodity.data[0],
                    category: params.category
                });

                callback(null, component, commodity.data[0], params.category);
            } else {
                // 등록된 상품이 없거나, 잘못 접근함 -> redirect
                history.push(`/fail`);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getCommodityOptions(component, commodity, category, callback) {
        axios.post(`/api/commodity/search/option`, {
            category: resource.getOptionName(category),
            commodity: commodity
        }).then((option) => {
            component.setState({
                option: option
            });
        }).catch((error) => {
            console.log(error);
        });
        callback();
    }

    componentWillMount() {
        let parseUrl = window.location.pathname.split('/');
        let param = {
            category: parseUrl[3],
            paramNo: parseUrl[4]
        };

        let getAuthTask = [
            async.apply(this.getCommodityDetail, this, param),
            this.getCommodityOptions
        ];

        async.waterfall(getAuthTask, function (err, result) {
            console.log('waterfall : ' + result);
            console.log('waterfall : ' + err);
        });

        //window.scrollTo(0, 1);
    }

    render() {
        return (
            <div className="item-whole-div">
                <TopNavigator title={"상품 상세정보"}/>

                <div className="clear-div-2"/>

                <div className="item-section-div">
                    <h4> {this.state.commodity['FIN_PRDT_NM']} </h4>
                    <hr/>
                    <div className="clear-div-2"/>
                    <div>
                        <div>
                            <strong>금융 회사명 : </strong>
                            {this.state.commodity['KOR_CO_NM']}
                        </div>
                        <div>
                            <strong>가입 방법 : </strong>
                            {this.state.commodity['JOIN_WAY']}
                        </div>
                        <div>
                            <strong>만기 후 이자율</strong>
                            <hr/>
                            {(this.state.commodity['MTRT_INT']).split('\n').map((item, key) => {
                                if(item !== '')
                                    return <span key={key}>{item}<br/></span>
                            })}
                        </div>
                        <div>
                            <strong>우대조건</strong>
                            <hr/>
                            {this.state.commodity['SPCL_CND'].split('\n').map((item, key) => {
                                if(item !== '')
                                    return <span key={key}>{item}<br/></span>
                            })}
                        </div>
                        <div>
                            <strong>가입제한 : </strong>
                            {this.state.commodity['JOIN_DENY'] === 1 ? '제한없음' : '제한있음'}
                        </div>
                        <div>
                            <strong>가입대상 : </strong>
                            {this.state.commodity['JOIN_MEMBER']}
                        </div>
                        <div>
                            <strong>기타 유의사항</strong>
                            <hr/>
                            {this.state.commodity['ETC_NOTE'].split('\n').map((item, key) => {
                                if(item !== '')
                                    return <span key={key}>{item}<br/></span>
                            })}
                        </div>
                        <div>
                            <strong>저축 금리 유형 : </strong>
                            {/*{this.state.option.map((option)=>{*/}
                                {/*return option['INTR_RATE_TYPE_NM']*/}
                            {/*})}*/}
                        </div>
                        <div>
                            <strong>시작일 : </strong>
                            {this.state.commodity['DCLS_STRT_DAY']}
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

    // NO,
    // TO_CHAR(DCLS_MONTH, 'yyyy-mm-dd') DCLS_MONTH,
    // FIN_CO_NO,
    // KOR_CO_NM,
    // FIN_PRDT_CD,
    // FIN_PRDT_NM,
    // JOIN_WAY,
    // MTRT_INT,
    // SPCL_CND,
    // JOIN_DENY,
    // JOIN_MEMBER,
    // ETC_NOTE,
    // MAX_LIMIT,
    // TO_CHAR(DCLS_STRT_DAY, 'yyyy-mm-dd') DCLS_STRT_DAY,
    // TO_CHAR(DCLS_END_DAY, 'yyyy-mm-dd') DCLS_END_DAY,
    // FIN_CO_SUBM_DAY

