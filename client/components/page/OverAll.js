/**
 * Created by imgyucheol on 2017. 9. 7..
 */
import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
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

    componentWillUnmount() {
        this.setState(this.defaultState);
    }

    componentDidMount() {
        let searchParam = this.state.selectedProducts;
        this.getCommodityData(this, {selectedItem: searchParam});
        window.scrollTo(0, 1);
    }

    getCommodityData(component, param) {
        axios.post(`/api/commodity/overall`, param).then((items) => {
            component.setState({
                overAllItems: items.data,
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    handleChangeItem(event) {
        let selected = event.target.value;

        if (selected !== this.state.selectedProducts) {
            let bankCode = resource.bankCodes[this.state.selectedBanksIndex];
            this.getCommodityData(this, {
                selectedItem: selected, selectedBankCode: bankCode
            });
        }

        this.setState({
            selectedProducts: selected,
            selectedImage: IntroduceImages[`${selected}`][0]
        });
    }

    handleChangeBank(event) {
        let selected = event.target.value;
        let params = {
            selectedItem: this.state.selectedProducts
        };

        if (selected !== 0) {
            params.selectedBankCode = resource.bankCodes[selected];
        }
        this.getCommodityData(this, params);
        this.setState({
            selectedBanksIndex: selected
        });
    }

    handleClickProduct(productNo) {
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
                        <Row className="show-grid">
                            {this.state.overAllItems.map((item, idx) => {
                                return (
                                    <Col xs={12} md={8} key={idx} className="panel panel-default item-div"
                                         onClick={this.handleClickProduct.bind(this, item["NO"])}>
                                        <div><img className="bank-logo-img"
                                                  src={`/images/bank_logos/${item["FIN_CO_NO"]}.png`}/></div>
                                        <div className="clear-div-1"/>

                                        <div>
                                            <h4>{item["FIN_PRDT_NM"]}</h4>
                                        </div>
                                        <hr/>
                                        <div>
                                            <div>
                                                {item["MTRT_INT"].split('\n').map((item, key) => {
                                                    if (item !== '')
                                                        return <span key={key}>{item}<br/></span>
                                                })}
                                            </div>
                                        </div>
                                        <hr/>
                                        <div>
                                            <h5>가입대상</h5>
                                            <div>
                                                {item["JOIN_MEMBER"].split('\n').map((item, key) => {
                                                    if (item !== '')
                                                        return <span key={key}>{item}<br/></span>
                                                })}
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                        {this.state.overAllItems.length === 0 ? <h5>조회하신 데이터가 없습니다</h5> : undefined}
                    </Grid>
                </div>
                <div className="clear-div-4">{''}</div>
            </div>
        );
    }
}
//

// item["MTRT_INT"]

//
// NO
// DCLS_MONTH	공시 제출월 [YYYYMM]
// FIN_CO_NO	금융회사 코드
// KOR_CO_NM	금융회사명
// FIN_PRDT_CD	금융상품 코드
// FIN_PRDT_NM	금융 상품명
// JOIN_WAY	가입 방법
// MTRT_INT	만기 후 이자율
// SPCL_CND	우대조건
// JOIN_DENY	가입제한 Ex) 1:제한없음, 2:서민전용, 3:일부제한
// JOIN_MEMBER	가입대상
// ETC_NOTE	기타 유의사항
// MAX_LIMIT	최고한도
// DCLS_STRT_DAY	공시 시작일
// DCLS_END_DAY	공시 종료일
// FIN_CO_SUBM_DAY	금융회사 제출일 [YYYYMMDDHH24MI]
//

//
// NO
// DCLS_MONTH	공시제출월
// FIN_CO_NO	금융회사코드
// FIN_PRDT_CD	금융상품코드
// INTR_RATE_TYPE	저축금리유형
// INTR_RATE_TYPE_NM	저축금리유형명
// SAVE_TRM	저축 기간[개월]
// INTR_RATE	저축 금리소수점2자리]
// INTR_RATE2	최고 우대금리
//

// {/* listItem 사용시 */}
// {/*<div className="item-fs-div">*/}
// {/*<ul className="list-group">*/}
// {/*<li className="list-group-item">{'test1'}</li>*/}
// {/*<li className="list-group-item">{'test2'}</li>*/}
// {/*<li className="list-group-item">{'test3'}</li>*/}
// {/*<li className="list-group-item">{'test4'}</li>*/}
// {/*</ul>*/}
// {/*</div>*/}
