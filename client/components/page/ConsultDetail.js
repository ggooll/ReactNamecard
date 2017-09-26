/**
 * Created by imgyucheol on 2017. 9. 12..
 */

import React from 'react';
import axios from 'axios';
import async from 'async';
import history from '../../history';
import {Grid, Row, Col} from 'react-bootstrap';
import './css/page.css';
import './css/ConsultDetail.css';
import TopNavigator from '../common/TopNavigator';

export default class ConsultDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            consultNo: '',
            consult: {},
            deposits: [],
            savings: []
        };

        this.handleClickInquire = this.handleClickInquire.bind(this);
    }

    componentDidMount() {
        let consultNo = location.pathname.split('/')[3];
        let component = this;

        let tasks = [
            async.apply(this.getConsultData, consultNo),
            this.getConsultCommodities
        ];

        async.waterfall(tasks, function (err, result) {
            component.setState(result);
            window.scrollTo(0, 1);
        });
    }

    getConsultData(consultNo, callback) {
        axios.get(`/api/consult/findOne/${consultNo}`, {}).then((consult) => {
            if ((typeof consult.data[0]) !== 'string') {
                callback(null, consult.data[0]);
            } else {
                history.push(`/fail`);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getConsultCommodities(consult, callback) {
        axios.get(`/api/consult/findProducts/${consult["NO"]}`, {}).then((commoditySet) => {
            let result = {
                consultNo: consult["NO"],
                consult: consult,
                deposits: commoditySet.data["depositProducts"],
                savings: commoditySet.data["savingsProducts"]
            };
            callback(null, result);
        }).catch((error) => {
            console.log(error);
        });
    }

    handleClickInquire() {
        window.alert('문의는 불가');
    }

    handleClickLink(productNo, category) {
        let option = category === '예금' ? 'deposit_info' : 'savings_info';
        let empCode = location.pathname.split('/')[1];
        history.push(`/${empCode}/consult/${option}/${productNo}`)
    }

    renderConsult() {
        return (
            <Col>
                <div className="consult-header-div">
                    <span>{this.state.consult["TITLE"]}</span>
                </div>

                <div className="consult-header-div">
                    <span>{this.state.consult["REG_DATE"]}</span>
                </div>

                <div className="consult-header-div">
                    <span>{'상담내용'}</span>
                </div>

                <div className="consult-content-div">
                    {this.state.consult["CONTENT"]}
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                </div>
            </Col>
        );
    }

    renderProducts(category, products) {
        if (products.length !== 0) {
            let linkStyle = category === '예금' ? 'deposit-link' : 'savings-link';
            linkStyle += ' consult-product-link-div';

            return (
                <div>
                    <div>다음 {category} 상품에 대해 상담받았습니다.</div>
                    <div className="clear-div-2"/>
                    {products.map((product, idx) => {
                        return (
                            <Col key={idx}>
                                <div className="consult-div">
                                    <div className="consult-product-div">
                                        <div className="consult-product-intro">
                                            <span>{product["KOR_CO_NM"]}</span>
                                        </div>
                                        <div className="consult-product-intro">
                                            <span>{product["FIN_PRDT_NM"]}</span>
                                        </div>
                                    </div>

                                    <div className={linkStyle}
                                         onClick={this.handleClickLink.bind(this, product["NO"], category)}>
                                        {'상세보기'}
                                    </div>
                                </div>
                                <div className="clear-div"/>
                            </Col>
                        );
                    })}
                    <div className="clear-div-4"/>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="item-whole-div">
                <TopNavigator title={"상담 상세 정보"}/>
                <Grid>
                    <Row className="header-grid">
                        {this.renderConsult()}
                    </Row>
                </Grid>
                <hr />

                <div className="item-section-div">
                    <Grid>
                        <Row className="show-grid">
                            <div className="clear-div-2"/>
                            {this.renderProducts('예금', this.state.deposits)}
                            {this.renderProducts('적금', this.state.savings)}
                        </Row>
                    </Grid>
                </div>

                <div className="consult-inquire-div" onClick={this.handleClickInquire}>
                    {`이 상담내용에 대해 문의하기`}
                </div>
            </div>
        );
    }
}
