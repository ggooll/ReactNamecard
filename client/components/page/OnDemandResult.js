/**
 * Created by imgyucheol on 2017. 9. 24..
 */

import React from 'react';
import axios from 'axios';
import async from 'async';
import {Grid, Row, Col} from 'react-bootstrap';
import Loader from 'react-loader';
import TopNavigator from '../common/TopNavigator';
import resource from './StaticResource';
import history from '../../history';
import './css/OnDemandResult.css';

export default class OnDemandResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            param: this.props.location.state.passParam,
            commodities: [],
            processedCommodities: [],
            selectedLength: 0,
            sortingValue: 'byMaxRate',
            commoditiesDetailToggle: [],
            childElement: [],
            specialOptions: [],
            loaded: false,
            bankCodes: resource.bankCodes,
            bankNames: resource.bankNames
        };

        this.handleChangeSelectSort = this.handleChangeSelectSort.bind(this);
        this.handleChangeSelectBank = this.handleChangeSelectBank.bind(this);
    }

    handleClickProductLink(product){
        let field = this.state.param.product === 'deposit_info' ? 'DEPOSIT_NO' : 'SAVINGS_NO';

        let parseUrl = window.location.pathname.split('/');
        history.push(`/${parseUrl[1]}/products/${this.state.param.product}/${product[`${field}`]}`);
    }

    handleChangeSelectBank(event){
        let selected = event.target.value;
        let commodities = this.state.processedCommodities;
        let bankCode = resource.bankCodes[selected];
        let selectedCount = 0;

        if(bankCode === ''){
            commodities = commodities.map((commodity)=>{
                commodity['visible'] = 1;
                selectedCount++;
                return commodity;
            })
        } else {
            commodities = commodities.map((commodity)=>{
                if(commodity['FIN_CO_NO'] === bankCode){
                    commodity['visible'] = 1;
                    selectedCount++;
                } else {
                    commodity['visible'] = 0;
                }
                return commodity;
            })
        }

        console.log(selectedCount);
        console.log(commodities);

        this.setState({
            processedCommodities : commodities,
            selectedLength : selectedCount
        })
    }

    handleChangeSelectSort(event) {
        let selected = event.target.value;

        let commodities = this.state.processedCommodities;
        let sortFunc = selected === 'byMinRate' ? resource.minRateSort : resource.maxRateSort;
        commodities.sort(sortFunc);
        this.setState({
            sortingValue: selected,
            processedCommodities: commodities
        });
    }

    // db select
    getCommodities(param, callback) {
        axios.post('/api/ondemand/getResult', {passParam: param}).then((results) => {

            let commodities = results.data.map((result)=>{
                result['visible'] = 1;
                return result;
            });

            callback(null, param, commodities);
        }).catch((error) => {
            console.log(error);
        });
    }

    // 사용자의 필수적인 요구로 1차 거름.. (filter)
    filterCommodities(param, commodities, callback) {
        let filteredCommodities = commodities.filter((commodity) => {
            let promise = true;
            if (commodity["GENDER_LIMIT"] !== null && param.gender !== commodity["GENDER_LIMIT"]) {
                promise = false;
            }
            if (commodity["MIN_AGE"] !== null && commodity["MIN_AGE"] > param.age) {
                promise = false;
            }
            if (commodity["MAX_AGE"] !== null && commodity["MAX_AGE"] < param.age) {
                promise = false;
            }
            if (commodity["MIN_MONEY"] !== null && commodity["MIN_MONEY"] > param.money) {
                promise = false;
            }
            if (commodity["MAX_MONEY"] !== null && commodity["MAX_MONEY"] < param.money) {
                promise = false;
            }
            // 적립 형태
            if (param.product === 'savings_info') {
                if (param.type !== 'M' && commodity["RSRV_TYPE"] !== param.type) {
                    promise = false;
                }
            }
            if (promise === true) {
                return commodity;
            }
        });

        callback(null, param, filteredCommodities);
    }

    applySpecialOption(param, filteredCommodities, callback) {
        axios.post('/api/ondemand/getSpecialOption', {passParam: param}).then((results) => {
            let specialOptions = results.data;
            let optionName = param.product === 'deposit_info' ? 'DEPOSIT_NO' : 'SAVINGS_NO';

            let appliedSpecialCommodities = filteredCommodities.map((commodity) => {

                console.log(commodity);
                commodity["specialOptions"] = specialOptions.filter((option) => {
                    if (option[`${optionName}`] === commodity[`${optionName}`]) {
                        return option;
                    }
                });

                /**
                 * 저소득층 적금의경우 불우이웃용 상품이 존재함,
                 **/
                if (param.special.length !== 0 && param.product === 'savings_info') {
                    let userSpecial = param.special;
                    commodity["appliedSpecial"] = userSpecial.filter((special) => {
                        // special이 commodity["specialOptions"]에 걸리는지 확인한다.
                        if(commodity["SPECIAL"] !== null && commodity["SPECIAL"].indexOf(special) > -1) {
                            return special;
                        }
                    });
                }
                return commodity;
            });
            callback(null, param, appliedSpecialCommodities);
        }).catch((error) => {
            console.log(error);
        });
    }

    makeOnDemandCommodities(param, filteredCommodities, callback) {
        console.log(filteredCommodities);
        // filtering 된 결과값을 가지고 값을 계산하여 추가한다.
        let processedCommodities = filteredCommodities.filter((commodity) => {
            let money = Number(param.money);
            let period = Number(param.period);
            const simple = 'S', compound = 'M';
            let interestType = commodity["INTR_RATE_TYPE"];
            let minRate = commodity["INTR_RATE"] = Math.floor(commodity["INTR_RATE"] * 100) / 100;
            let maxRate = commodity["INTR_RATE2"] = Math.floor(commodity["INTR_RATE2"] * 100) / 100;
            let minInterest = 0, maxInterest = 0;

            if (param.product === 'deposit_info') {
                if (interestType === simple) {
                    minInterest = Math.round((money * (minRate / 1200) * period));
                    maxInterest = Math.round((money * (maxRate / 1200) * period));
                } else if (interestType === compound) {
                    minInterest = Math.round(money * Math.pow((1 + minRate / 1200), (period * 12 / 12)) - money);
                    maxInterest = Math.round(money * Math.pow((1 + minRate / 1200), (period * 12 / 12)) - money);
                }
                commodity["passPeriodMoney"] = money;
            } else {
                // 일단 정액 저축식 / 자유 적립식 구분 필요 x
                let monthlyMoney = money * period;
                if (interestType === simple) {
                    minInterest = Math.round((money * (minRate / 1200) * period * (Number(period) + 1)) / 2);
                    maxInterest = Math.round((money * (maxRate / 1200) * period * (Number(period) + 1)) / 2);
                } else if (interestType === compound) {
                    minInterest = Math.round(money * (1 + minRate / 1200) * (1 - (Math.pow((1 + minRate / 1200), period))) / (1 - (1 + minRate / 1200)) - monthlyMoney);
                    maxInterest = Math.round(money * (1 + maxRate / 1200) * (1 - (Math.pow((1 + maxRate / 1200), period))) / (1 - (1 + maxRate / 1200)) - monthlyMoney);
                }
                commodity["passPeriodMoney"] = monthlyMoney;
            }

            let minTax = minInterest * 0.154;
            let maxTax = maxInterest * 0.154;
            commodity["minTax"] = minTax;
            commodity["maxTax"] = maxTax;
            commodity["minInterest"] = minInterest;
            commodity["maxInterest"] = maxInterest;
            commodity["finalMinMoney"] = commodity["passPeriodMoney"] + minInterest - minTax;
            commodity["finalMaxMoney"] = commodity["passPeriodMoney"] + maxInterest - maxTax;
            return commodity;
        });

        callback(null, processedCommodities);
    }

    componentDidMount() {
        window.scrollTo(0, 1);
        let param = this.props.location.state.passParam;
        let tasks = [
            async.apply(this.getCommodities, param),
            this.filterCommodities,
            this.applySpecialOption,
            this.makeOnDemandCommodities
        ];

        async.waterfall(tasks, (err, result) => {
            result.sort(resource.maxRateSort);
            this.setState({
                processedCommodities: result,
                selectedLength: result.length
            });
            let array = new Array(result.length);
            let childArr = new Array(result.length);
            for (let i = 0; i < array.length; i++) {
                array[i] = 'grid-detail-div';
                childArr[i] = '';
            }

            setTimeout(function(){
                this.setState({
                    commoditiesDetailToggle: array,
                    childElement: childArr,
                    loaded: true
                });
            }.bind(this), 1000);
        });
    }

    handleClickDetail(index) {
        let toggle = this.state.commoditiesDetailToggle;
        let childToggle = this.state.childElement;
        toggle[index] = toggle[index] === 'grid-detail-div' ? 'grid-detail-div visible' : 'grid-detail-div';
        childToggle[index] = childToggle[index] === 'visible' ? 'non-visible' : 'visible';
        this.setState({
            commoditiesDetailToggle: toggle,
            childElement: childToggle
        });
    }

    renderUserInputs() {
        return (
            <div className="result-user-input-div">
                <div className="result-param-title" />

                <div className="result-param-div">
                    <div>{'선택 상품군'}</div>
                    <span>{this.state.param.product === 'deposit_info' ? '예금' : '적금'}</span>
                </div>
                <div className="result-param-div">
                    <div>{'원금'}</div>
                    <span>{`${resource.moneyWithComma(this.state.param.money)}  원`}</span>
                </div>
                <div className="result-param-div">
                    <div>{'나이'}</div>
                    <span>{`${this.state.param.age}  세`}</span>
                </div>
                <div className="result-param-div">
                    <div>{'기간'}</div>
                    <span>{`${this.state.param.period}  개월`}</span>
                </div>
                <div className="result-param-div">
                    <div>{'성별'}</div>
                    <span>{this.state.param.gender === 'M' ? '남자' : '여자'}</span>
                </div>
                <div className="result-param-div">
                    <div>{'우대 고려사항'}</div>
                    <span>{`${this.state.param.special.length}  건`}</span>
                </div>
            </div>
        );
    }

    renderSpecialIntro(idx, bankName){
        return(
            <div className={`${this.state.childElement[idx]} special-intro-div`}>
                <div className="special_intro">{`${bankName}의 우대금리 조건입니다.`}</div>
                <div className="special_intro">{'항목별 적용되며, 최대금리를 넘을 수 없습니다.'}</div>
            </div>
        );
    }

    render() {
        return (
            <div className="ondemand-whole-container">
                <TopNavigator title={`${this.state.param.product === 'deposit_info' ? '예금' : '적금'} 맞춤 검색결과`}/>
                {this.renderUserInputs()}

                <div className="clear-div-1"/>
                <div className="commodities-result-title">
                    <div className="result-title">{`결과 ${this.state.selectedLength} 건`}</div>
                </div>

                <div className="sort-select-div">
                    <select onChange={this.handleChangeSelectBank}
                            value={this.state.selectedBank}>
                        {this.state.bankNames.map((name, index) => {
                            return <option value={index} key={index}>{name}</option>
                        })}
                    </select>

                    <select onChange={this.handleChangeSelectSort}
                            value={this.state.sortingValue}>
                        <option value="byMaxRate">{`우대금리 높은순`}</option>
                        <option value="byMinRate">{`일반금리 높은순`}</option>
                    </select>
                </div>
                <div className="clear-div-1"/>

                <div className="item-section-div">
                    <Grid>
                        <Loader loaded={this.state.loaded} color="#008485"  length={10} width={1} radius={10} shadow={true} hwaccel={true} top="60%">

                            <Row className="show-grid">
                                {this.state.processedCommodities.map((commodity, idx) => {
                                    if (commodity['visible'] === 1) {
                                        return (
                                            <Col xs={12} md={8} key={idx}
                                                 className="panel panel-default processed-commodity-intro">
                                                <div className="show-grid-top">
                                                    <img src={`/images/bank_logos/${commodity["FIN_CO_NO"]}.png`}/>
                                                    <span>{commodity["FIN_PRDT_NM"]}</span>
                                                </div>
                                                <div>
                                                    {/* 금리가 같을경우.. (우대금리가 없는경우) */}
                                                    <div className="show-grid-mid">
                                                        <div className="grid-mid-title">
                                                            <div className="intr-title">{'금리'}</div>
                                                            <div className="final-money-title">{'만기지급액'}</div>
                                                        </div>

                                                        <div className="grid-mid-section">
                                                            <div className="grid-mid-left">
                                                                <span className="min-intr-rate rate-numbering">{`최소  ${commodity["INTR_RATE"]}%`}</span>
                                                            </div>
                                                            <div className="grid-mid-right">
                                                                <span className="rate-numbering">{resource.moneyWithComma(Math.floor(commodity["finalMinMoney"]))}원</span>
                                                            </div>
                                                        </div>
                                                        <div className="clear-div"/>
                                                        <div className="grid-mid-section">
                                                            <div className="grid-mid-left">
                                                                <span className="max-intr-rate rate-numbering">{`최대  ${commodity["INTR_RATE2"]}%`}</span>
                                                            </div>
                                                            <div className="grid-mid-right">
                                                            <span className="rate-numbering">{resource.moneyWithComma(Math.floor(commodity["finalMaxMoney"]))}원</span>
                                                            </div>
                                                        </div>
                                                        <div className="clear-div"/>
                                                    </div>
                                                </div>

                                                <div className="show-grid-bottom"
                                                     onClick={this.handleClickDetail.bind(this, idx)}>
                                                    {'자세히보기'}
                                                </div>
                                                <div className={this.state.commoditiesDetailToggle[idx]}>
                                                    <div className="clear-div-1"/>
                                                    <div className={this.state.childElement[idx]}>
                                                        <span className="child-title">원금</span>
                                                        <span className="child-content">{`${resource.moneyWithComma(commodity["passPeriodMoney"])} 원`}</span>
                                                    </div>
                                                    <div className={this.state.childElement[idx]}>
                                                        <span className="child-title">일반금리 발생이자</span>
                                                        <span className="child-content">{`${resource.moneyWithComma(commodity["minInterest"])} 원`}</span>
                                                    </div>
                                                    <div className={this.state.childElement[idx]}>
                                                        <span className="child-title">일반금리 이자세금</span>
                                                        <span className="child-content">{`${resource.moneyWithComma(commodity["minTax"])} 원`}</span>
                                                    </div>
                                                    <div className={this.state.childElement[idx]}>
                                                        <span className="child-title">우대금리 발생이자</span>
                                                        <span className="child-content">{`${resource.moneyWithComma(commodity["maxInterest"])} 원`}</span>
                                                    </div>
                                                    <div className={this.state.childElement[idx]}>
                                                        <span className="child-title">우대금리 이자세금</span>
                                                        <span className="child-content">{`${resource.moneyWithComma(commodity["maxTax"])} 원`}</span>
                                                    </div>

                                                    {commodity.specialOptions.length !== 0 ? this.renderSpecialIntro(idx, commodity["FIN_PRDT_NM"]) : undefined}
                                                    {commodity.specialOptions.map((specialOption, subIndex) => {
                                                        return (
                                                            <div className={`${this.state.childElement[idx]} special-div-in`} key={subIndex}>
                                                                <div className="special_condition_title">{specialOption["SPECIAL_CONDITION"]}</div>
                                                                <div className="special_condition_rate">{`+ ${specialOption["SPECIAL_INTR"]} %`}</div>
                                                            </div>
                                                        );
                                                    })}
                                                    <div className={`${this.state.childElement[idx]} bank-link-div`}
                                                         onClick={this.handleClickProductLink.bind(this, commodity)}>
                                                        <span>해당 상품 자세히 보기</span>
                                                    </div>
                                                </div>

                                                <div className="clear-div-2"/>
                                            </Col>
                                        );
                                    } else {
                                        return undefined;
                                    }})}

                            </Row>
                        </Loader>
                    </Grid>
                </div>
            </div>
        );
    }
}