/**
 * Created by imgyucheol on 2017. 9. 8..
 */
import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import TopNavigator from '../common/TopNavigator';
import './css/Survey.css';
import './css/page.css';
import $ from 'jquery';

export default class Survey extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        // ajax

        $.ajax({
            url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%3D%22USDKRW%22&format=xml&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
            // url: 'https://api.manana.kr/exchange/rate/KRW/JPY,KRW,USD.json',
            dataType: 'jsonp',
            success : function(result){
                console.log(result);
            }
        });
    }

    render() {
        return (
            <div className="item-whole-div">
                <TopNavigator title="Survey"/>

                <div className="item-section-div">
                    <Grid>
                        <Row className="show-grid">
                            <Col xs={12} md={8} className="panel panel-default item-div">
                                <p></p>
                                <p>{'asdf'}</p>
                                <p>{'test'}</p>
                            </Col>
                        </Row>
                    </Grid>
                </div>

                <div className="clear-div-4">{''}</div>
            </div>
        );
    }
}