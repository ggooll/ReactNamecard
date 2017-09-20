/**
 * Created by imgyucheol on 2017. 9. 7..
 */

import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
// import axios from 'axios';
import './css/AgeGroup.css';
import './css/page.css';
import TopNavigator from '../common/TopNavigator';

export default class AgeGroup extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('ageGroup component did mount');
        //window.scrollTo(0, 1);
    }

    render() {
        return (
            <div className="item-whole-div">
                <TopNavigator title="AgeGroup Ranking"/>

                {/*<div className="item-top-introduce">*/}
                    {/*<img src="xx"/>*/}
                {/*</div>*/}

                <div className="item-section-div">
                    <Grid>
                        <Row className="show-grid">
                            <Col xs={12} md={8} className="panel panel-default item-div">
                                <p>adsf</p>
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