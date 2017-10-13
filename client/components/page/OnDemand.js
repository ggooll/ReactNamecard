/**
 * Created by imgyucheol on 2017. 9. 7..
 */

import React from 'react';
import history from '../../history';
import {Grid, Row, Col} from 'react-bootstrap';
import TopNavigator from '../common/TopNavigator';
import resource from './StaticResource';
import './css/OnDemand.css';
import './css/page.css';

export default class OnDemand extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectMan: 'gender-div',
            selectWoman: 'gender-div',
            selectedItem: 'ondemand-deposit',
            selectedProducts: 'deposit_info',
            gender: 'M',
            depositMoney: '',
            savingMoney: '',
            age: '',
            period: '',
            checkboxToggler: 'checkboxes',
            special: [],
            rsrvTypeS: '',
            rsrvTypeF: ''
        };

        this.handleChangeProducts = this.handleChangeProducts.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleToggleCheckBoxes = this.handleToggleCheckBoxes.bind(this);
        this.makeComma = this.makeComma.bind(this);
        this.makeNoneComma = this.makeNoneComma.bind(this);
    }

    componentWillMount() {
        let preSelected = window.localStorage.getItem('userOnDemand');
        if (preSelected !== null) {
            let preObject = JSON.parse(preSelected);
            preObject.checkboxToggler = 'checkboxes';
            this.setState(preObject);
        }
    }

    componentDidMount() {
        window.scrollTo(0, 1);
    }

    handleClickGender(gender) {
        if (gender === 'man') {
            this.setState({
                selectMan: 'gender-div gender-selected',
                selectWoman: 'gender-div',
                gender: 'M'
            });
        } else {
            this.setState({
                selectWoman: 'gender-div gender-selected',
                selectMan: 'gender-div',
                gender: 'W'
            });
        }
    }

    handleClickRsrvType(type) {
        if (type === 'S') {
            let rsrvTypeS = this.state.rsrvTypeS === 'rsrvType-selected' ? '' : 'rsrvType-selected';
            this.setState({
                rsrvTypeS: rsrvTypeS
            });
        } else {
            let rsrvTypeF = this.state.rsrvTypeF === 'rsrvType-selected' ? '' : 'rsrvType-selected';
            this.setState({
                rsrvTypeF: rsrvTypeF
            });
        }
    }

    handleChangeSpecial(value) {
        let currentSpecial = this.state.special;
        let index = currentSpecial.indexOf(value);
        if (index > -1) {
            currentSpecial.splice(index, 1);
        } else {
            currentSpecial.push(value);
        }
        this.setState({
            special: currentSpecial
        });
    }

    handleChangeProducts(event) {
        let selected = event.target.value;
        this.setState({
            selectedProducts: selected
        });
    }

    handleChangeInput(event) {
        let numberRegex = /^[0-9]*$/;
        let value = event.target.value;

        if (numberRegex.test(value)) {
            let result = {};
            result[event.target.name] = event.target.value;
            this.setState(result);
        }
    }

    handleClickPeriodButton(period) {
        this.setState({
            period: period
        });
    }

    handleClickMoneyButton(money){
        let type = this.state.selectedProducts;
        let preInputMoney = type === 'deposit_info' ? this.state.depositMoney : this.state.savingMoney;
        let plusMoney = resource.moneyWithComma(Number(preInputMoney.replace(/\,/g, '')) + Number(money));
        type === 'deposit_info' ? this.setState({depositMoney: plusMoney}) : this.setState({savingMoney: plusMoney});
    }

    handleToggleCheckBoxes() {
        let toggle = this.state.checkboxToggler === 'checkboxes' ? 'checkboxes visible' : 'checkboxes';
        if (toggle !== 'checkboxes') {
            document.body.height += 40;
            window.setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
            }, 0);
        }

        this.setState({
            checkboxToggler: toggle
        });
    }

    checkSubmit() {
        if (this.state.age === '') {
            return false;
        }
        if (this.state.period === '') {
            return false;
        }
        if (this.state.selectedProducts === 'deposit_info' && this.state.depositMoney === '') {
            return false;
        } else if (this.state.selectedProducts === 'savings_info' && this.state.savingMoney === '') {
            return false;
        }
        return true;
    }

    handleOnDemandSubmit() {
        if (this.checkSubmit() !== false) {
            let passParam = {
                product: this.state.selectedProducts,
                gender: this.state.gender,
                age: this.state.age,
                period: this.state.period,
                special: this.state.special
            };

            if (this.state.selectedProducts === 'deposit_info') {
                passParam.money = this.state.depositMoney.replace(/\,/g, '');
            } else {
                let typeS = this.state.rsrvTypeS;
                let typeF = this.state.rsrvTypeF;
                let paramType = '';
                if (!(typeS === '' && typeF === '') || (typeS !== '' && typeF !== '')) {
                    paramType = typeS !== '' ? 'S' : 'F';
                }
                passParam.type = paramType;
                passParam.money = this.state.savingMoney.replace(/\,/g, '');
            }

            window.localStorage.setItem('userOnDemand', JSON.stringify(this.state));
            history.push({
                pathname: '/ggooll/onDemand/result',
                state: {passParam: passParam}
            })
        }
    }

    renderGenderDemand() {
        return (
            <div>
                <h4>성별</h4>
                <div className="clear-div-2"/>
                <div className={this.state.selectWoman}
                     onClick={this.handleClickGender.bind(this, 'woman')}>
                    {'여자'}
                </div>
                <div className={this.state.selectMan}
                     onClick={this.handleClickGender.bind(this, 'man')}>
                    {'남자'}
                </div>
                <div className="clear-div-2"/>
            </div>
        );
    }

    makeNoneComma(event) {
        let result = {};
        let value = event.target.value;
        result[event.target.name] = value.replace(/\,/g, '');
        this.setState(result);
    }

    makeComma(event) {
        let result = {};
        result[event.target.name] = resource.moneyWithComma(event.target.value);
        this.setState(result);
    }

    renderInputDemand(params, states, readOnly) {
        return (
            <div>
                <h4>{params.title}</h4>
                <div className="clear-div-2"/>
                <div className="list-input-div">
                    {
                        readOnly === undefined ?
                            <input type="text" pattern="[0-9]*" onFocus={this.makeNoneComma} onBlur={this.makeComma}
                                   name={params.targetName} placeholder={`ex) ${params.defaultValue}`}
                                   value={states}
                                   onChange={this.handleChangeInput}/> :
                            <input type="text" placeholder={params.defaultValue} value={states} {...readOnly}/>
                    }

                    <div>{params.right}</div>
                </div>
            </div>
        );
    }

    renderSavingsType() {
        if (this.state.selectedProducts === 'deposit_info') {
            return undefined;
        }
        return (
            <li className="list-input-demand">
                <div>
                    <h4>적금적립유형</h4>
                    <div className="clear-div-2"/>
                    <div className="rsrv-type-button-div">
                        <div className={this.state.rsrvTypeS} onClick={this.handleClickRsrvType.bind(this, 'S')}>
                            정액적립식
                        </div>
                        <div className={this.state.rsrvTypeF} onClick={this.handleClickRsrvType.bind(this, 'F')}>
                            자유적립식
                        </div>
                    </div>
                    <div className="clear-div-2"/>
                </div>
            </li>
        );
    }

    renderSpecialCheckBox(name, value, title) {
        return (
            <label htmlFor={name}>
                <input type="checkbox" id={name} onClick={this.handleChangeSpecial.bind(this, value)}/>{title}</label>
        );
    }

    render() {
        const periodParams = {
            title: '가입기간',
            right: '개월',
            defaultValue: '6',
            targetName: 'period'
        };

        const depositMoneyParams = {
            title: '예상 예치 금액',
            right: '원',
            defaultValue: '1000000',
            targetName: 'depositMoney'
        };

        const savingMoneyParams = {
            title: '월 납입금액',
            right: '원',
            defaultValue: '100000',
            targetName: 'savingMoney'
        };

        const ageParams = {
            title: '나이',
            right: '세 ',
            defaultValue: '20',
            targetName: 'age'
        };

        return (
            <div className="item-whole-div">
                <TopNavigator title="나에게 맞는 예.적금 찾기"/>

                <div className="item-top-introduce">
                    <div className="top-introduce-frame">
                        <div>{this.state.selectedProducts === 'deposit_info' ? '목돈 보관하는 방법! 예금' : '목돈을 모으고 싶다면? 적금'}</div>
                        <div className="ondemand-selected-product">
                            <select className="form-control" onChange={this.handleChangeProducts}
                                    value={this.state.selectedProducts}>
                                <option value="deposit_info">예금찾기</option>
                                <option value="savings_info">적금찾기</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="item-section-div">
                    <Grid>
                        <Row className="show-grid">
                            <Col xs={12} md={8} className="panel panel-default some-div">
                                <ul className="list-demand">
                                    <li className="list-input-demand">
                                        {this.state.selectedProducts === 'deposit_info' ?
                                            this.renderInputDemand(depositMoneyParams, this.state.depositMoney) :
                                            this.renderInputDemand(savingMoneyParams, this.state.savingMoney)}
                                        <div className="plus-money-button-div">
                                            <div onClick={this.handleClickMoneyButton.bind(this, '100000')}>+십만원</div>
                                            <div onClick={this.handleClickMoneyButton.bind(this, '1000000')}>+백만원</div>
                                            <div onClick={this.handleClickMoneyButton.bind(this, '10000000')}>+천만원</div>
                                            <div onClick={this.handleClickMoneyButton.bind(this, '100000000')}>+1억원</div>
                                        </div>
                                    </li>

                                    <li className="list-input-demand">
                                        {this.renderInputDemand(periodParams, this.state.period, {readOnly: 'readOnly'})}
                                        <div className="period-button-div">
                                            <div onClick={this.handleClickPeriodButton.bind(this, '36')}>36개월</div>
                                            <div onClick={this.handleClickPeriodButton.bind(this, '24')}>24개월</div>
                                            <div onClick={this.handleClickPeriodButton.bind(this, '12')}>12개월</div>
                                            <div onClick={this.handleClickPeriodButton.bind(this, '6')}>6개월</div>
                                        </div>
                                    </li>

                                    <li className="list-input-demand">
                                        {this.renderInputDemand(ageParams, this.state.age)}
                                    </li>

                                    <li className="list-input-demand">
                                        {this.renderGenderDemand()}
                                    </li>

                                    {this.renderSavingsType()}

                                    <li className="list-input-demand">
                                        <div className="multiselect">
                                            <div className="selectBox" onClick={this.handleToggleCheckBoxes}>
                                                저소득층 우대 적용
                                                <div className="overSelect"/>
                                            </div>
                                            <div className={this.state.checkboxToggler}>
                                                {this.renderSpecialCheckBox('one', '기초생활', '기초생활수급자')}
                                                {this.renderSpecialCheckBox('two', '차상위', '차상위계층')}
                                                {this.renderSpecialCheckBox('three', '한부모', '한부모가족지원대상자')}
                                                {this.renderSpecialCheckBox('four', '근로장려금', '근로장려금수급자')}
                                                {this.renderSpecialCheckBox('five', '소년소녀가장', '소년소녀가장')}
                                                {this.renderSpecialCheckBox('six', '장애인', '장애인')}
                                                {this.renderSpecialCheckBox('seven', '이민', '결혼이민(여성)')}
                                                {this.renderSpecialCheckBox('eight', '북한', '북한이탈주민')}
                                            </div>
                                        </div>
                                        <div className="clear-div-2"/>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                    </Grid>
                </div>

                <div className={`${this.state.checkboxToggler} decoy-div`}/>
                <div className="search-ondemand-commodities" onClick={this.handleOnDemandSubmit.bind(this)}>
                    {'상품 찾기'}
                </div>
            </div>
        );
    }
}