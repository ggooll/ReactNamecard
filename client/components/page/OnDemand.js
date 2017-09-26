/**
 * Created by imgyucheol on 2017. 9. 7..
 */

import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import './css/OnDemand.css';
import './css/page.css';
import TopNavigator from '../common/TopNavigator';

export default class OnDemand extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('ageGroup component did mount');
        window.scrollTo(0, 1);
    }

    renderInputDemand(title, right, states) {
        return (
            <div>
                <h4>{title}</h4>
                <div className="clear-div-2"/>
                <div className="list-input-div">
                    <input type="text" placeholder="haha1"/>
                    <div>{right}</div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="item-whole-div">
                <TopNavigator title="나에게 맞는 예.적금 찾기"/>

                <div className="clear-div-2"/>
                <div className="item-top-introduce">
                    <div className="top-introduce-frame">
                        참고참고


                    </div>
                </div>

                <div className="item-section-div">
                    <Grid>
                        <Row className="show-grid">
                            <Col xs={12} md={8} className="panel panel-default some-div">
                                <ul className="list-demand">
                                    <li className="list-input-demand">
                                        {this.renderInputDemand('가입기간', '개월')}
                                    </li>
                                    <li className="list-input-demand">
                                        {this.renderInputDemand('예상 예치 금액', '원')}
                                    </li>
                                    <li className="list-input-demand">
                                        {this.renderInputDemand('나이', '살')}
                                    </li>
                                    <li className="list-input-demand">
                                        <div>
                                            <h4>성별</h4>
                                            <div className="clear-div-2"/>
                                            <div className="gender-div">남자</div>
                                            <div className="gender-div">여자</div>
                                            <div className="clear-div-2"/>
                                        </div>
                                    </li>
                                    <li className="list-input-demand">
                                        <div>
                                            <h4>분석껀덕지</h4>
                                            <div className="clear-div-2"/>
                                            <div className="list-input-div">
                                                <div>개월</div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                    </Grid>
                </div>
                <div className="clear-div-2"/>
                <div className="search-ondemand-commodities">
                    상품 찾기
                </div>
            </div>
        );
    }
}