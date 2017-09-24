/**
 * Created by imgyucheol on 2017. 9. 8..
 */
import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import TopNavigator from '../common/TopNavigator';
import './css/Survey.css';
import './css/page.css';

export default class Survey extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.scrollTo(0, 1);
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