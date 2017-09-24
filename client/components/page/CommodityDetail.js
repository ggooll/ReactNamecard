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
        console.log(props);

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
            option: [{},]
        };
        this.state = this.defaultState;
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

    renderSimpleIntro(title, value){
        return (
            <div className="commodity-detail-title">
                <strong>{`${title} : `}</strong>
                {value}
            </div>
        );
    }

    renderSplitLineIntro(title, multiLineValue){
        if(multiLineValue === ''){
            return undefined;
        }

        return(
            <div className="commodity-detail-title">
                <div className="commodity-lined-title"><strong>{title}</strong></div>
                <hr/>
                {multiLineValue.split('\n').map((item, key) => {
                    if (item !== '')
                        return <span key={key}>{item}<br/></span>
                })}
            </div>
        );
    }

    componentDidMount() {
        console.log(this.props.match);

        let parseUrl = window.location.pathname.split('/');
        let param = {
            category: parseUrl[3],
            paramNo: parseUrl[4]
        };

        let tasks = [
            async.apply(this.getCommodityDetail, this, param),
            this.getCommodityOptions
        ];

        async.waterfall(tasks, function (err, result) {
            // console.log('waterfall : ' + result);
            // console.log('waterfall : ' + err);
            window.scrollTo(0, 1);
        });
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

                    <div className="commodity-detail-wrap">

                        {this.renderSimpleIntro('금융회사명', this.state.commodity['KOR_CO_NM'])}
                        {this.renderSimpleIntro('가입방법', this.state.commodity['JOIN_WAY'])}
                        {this.renderSplitLineIntro('만기 후 이자율', this.state.commodity['MTRT_INT'])}
                        {this.renderSplitLineIntro('우대조건', this.state.commodity['SPCL_CND'])}
                        {this.renderSimpleIntro('가입제한', this.state.commodity['JOIN_DENY'] === 1 ? '제한없음' : '제한있음')}
                        {this.renderSimpleIntro('가입대상', this.state.commodity['JOIN_MEMBER'])}
                        {this.renderSplitLineIntro('기타 유의사항', this.state.commodity['ETC_NOTE'])}

                        <div>
                            <strong>저축 금리 유형 : </strong>
                            {/*{this.state.option.map((option)=>{*/}
                            {/*return option['INTR_RATE_TYPE_NM']*/}
                            {/*})}*/}
                        </div>

                        {this.renderSimpleIntro('시작일', this.state.commodity['DCLS_STRT_DAY'])}

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

