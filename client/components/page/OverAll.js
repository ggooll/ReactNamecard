/**
 * Created by imgyucheol on 2017. 9. 7..
 */
import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import Loader from 'react-loader';
import axios from 'axios';
import IntroduceImages from './StaticResource';
import TopNavigator from '../common/TopNavigator';
import history from '../../history';
import resource from './StaticResource';
import './css/page.css';

export default class OverAll extends React.Component {

    constructor(props) {
        super(props);

        this.defaultState = {
            loaded: false,
            empCode: location.pathname.split('/')[1],
            selectedProducts: 'deposit_info',
            selectedImage: IntroduceImages.deposit_info[0],
            bankCodes: resource.bankCodes,
            bankNames: resource.bankNames,
            selectedBanksIndex: 0,
            overAllItems: []
        };

        this.state = this.defaultState;
        this.handleChangeItem = this.handleChangeItem.bind(this);
        this.handleChangeBank = this.handleChangeBank.bind(this);
    }

    componentWillMount() {
        console.log('will mount');
        let preSelectedQuery = window.localStorage.getItem('overAllQuery');
        if (preSelectedQuery !== null) {
            let queryObject = JSON.parse(preSelectedQuery);
            console.log(queryObject);
            this.setState(queryObject);
        }
    }

    componentDidMount() {
        console.log('did mount');
        let searchParam = this.state.selectedProducts;
        if (this.state.overAllItems.length === 0) {
            setTimeout(function () {
                axios.post(`/api/commodity/overall`, {selectedItem: searchParam}).then((items) => {
                    this.setState({
                        overAllItems: items.data,
                        loaded: true
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }.bind(this), 700);
        }
        window.scrollTo(0, 1);
    }

    handleChangeItem(event) {
        let selected = event.target.value;
        if (selected !== this.state.selectedProducts) {
            this.setState({
                loaded: false
            });
            setTimeout(function () {
                axios.post(`/api/commodity/overall`, {selectedItem: selected}).then((items) => {
                    this.setState({
                        selectedBanksIndex: 0,
                        overAllItems: items.data,
                        loaded: true,
                        selectedProducts: selected,
                        selectedImage: IntroduceImages[`${selected}`][0]
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }.bind(this), 700);
            window.localStorage.setItem('overAllQuery', JSON.stringify(this.state));
        }
    }

    handleChangeBank(event) {
        let selected = event.target.value;
        if (this.state.selectedBanksIndex !== selected) {
            let selectedBankCode = resource.bankCodes[selected];
            let nonFilteredItems = this.state.overAllItems;

            let overAllItems = selectedBankCode !== '' ? nonFilteredItems.map((item) => {
                item['VISIBLE'] = item['FIN_CO_NO'] === selectedBankCode ? 1 : 0;
                return item;
            }) : nonFilteredItems.map((item) => {
                item['VISIBLE'] = 1;
                return item;
            });

            this.setState({
                selectedBanksIndex: selected,
                overAllItems: overAllItems
            });

            // async??;;
            window.localStorage.setItem('overAllQuery', JSON.stringify(this.state));
        }
    }

    handleClickProduct(productNo) {
        window.localStorage.setItem('overAllQuery', JSON.stringify(this.state));
        history.push(`/${this.state.empCode}/products/${this.state.selectedProducts}/${productNo}`);
    }

    render() {
        return (
            <div className="item-whole-div">
                <TopNavigator title="전체 예,적금 상품"/>

                <div className="item-top-introduce">
                    <img src={this.state.selectedImage}/>
                </div>

                <div className="item-section-div">
                    <div className="clear-div-1"/>
                    <div>
                        <select className="form-control" onChange={this.handleChangeItem}
                                value={this.state.selectedProducts}>
                            <option value="deposit_info">예금</option>
                            <option value="savings_info">적금</option>
                        </select>
                    </div>
                    <div className="clear-div-1"/>
                    <div>
                        <select className="form-control"
                                value={this.state.selectedBanksIndex} onChange={this.handleChangeBank}>
                            {this.state.bankNames.map((name, index) => {
                                return <option value={index} key={index}>{name}</option>
                            })}
                        </select>
                    </div>
                    <div className="clear-div-1"/>

                    <Grid>
                        <Loader loaded={this.state.loaded} color="#008485" length={10} width={1} radius={10}
                                shadow={true} hwaccel={true} top="70%">
                            <Row className="show-grid">
                                {this.state.overAllItems.map((item, idx) => {
                                    if (item['VISIBLE'] === 1) {
                                        return (
                                            <Col xs={12} md={8} key={idx} className="panel panel-default item-div"
                                                 onClick={this.handleClickProduct.bind(this, item["NO"])}>
                                                <div className="commodity-popular-desc">
                                                    {item['PRODUCT_COUNT'] !== null ? <span>
                                                        <div className="popular-product-count"/>
                                                        {`${item['PRODUCT_COUNT']}명이 상담`}
                                                    </span> : undefined}
                                                    {this.state.selectedProducts === 'deposit_info' ?
                                                        item['DEPOSIT_COUNT'] !== null ? <span>
                                                        <div className="popular-click-count"/>
                                                            {`${item['DEPOSIT_COUNT']}명이 관심`}
                                                        </span> : undefined :
                                                        item['SAVINGS_COUNT'] !== null ? <span>
                                                        <div className="popular-click-count"/>
                                                            {`${item['SAVINGS_COUNT']}명이 관심`}
                                                        </span> : undefined
                                                    }
                                                </div>

                                                <div className="clear-div-1"/>


                                                <div><img className="bank-logo-img"
                                                          src={`/images/bank_logos/${item["FIN_CO_NO"]}.png`}/></div>
                                                <div className="clear-div-1"/>

                                                <div>
                                                    <h4>{item["FIN_PRDT_NM"]}</h4>
                                                </div>
                                                <hr/>
                                                <div className="clear-div-1"/>

                                                <div className="item-separate-div">
                                                    <div>가입대상</div>
                                                    <span>
                                                    {item["JOIN_MEMBER"].split('\n').map((item, key) => {
                                                        if (item !== '')
                                                            return <span key={key}>{`${item}`}<br/></span>
                                                    })}
                                                </span>
                                                </div>

                                                <div className="item-separate-div">
                                                    <div>이자방식</div>
                                                    <span>{item["INTR_RATE_TYPE"] === 'S' ? '단리' : '복리'}</span>
                                                </div>

                                                <div className="item-separate-div">
                                                    <div>가입경로</div>
                                                    <span>{item["JOIN_WAY"]}</span>
                                                </div>

                                                <div className="item-separate-div">
                                                    <div>{this.state.selectedProducts === 'deposit_info' ? '최대예치금액' : '월 최대 납입금액'}</div>
                                                    <span>{(item["MAX_LIMIT"] <= 0) ? '제한없음' : `${resource.moneyWithComma(item["MAX_LIMIT"])} 원`}</span>
                                                </div>
                                            </Col>
                                        );
                                    } else {
                                        return undefined;
                                    }
                                })}
                            </Row>
                            {this.state.overAllItems.length === 0 ? <h5>조회하신 데이터가 없습니다</h5> : undefined}
                        </Loader>
                    </Grid>
                </div>
                <div className="clear-div-4">{''}</div>
            </div>
        );
    }
}
