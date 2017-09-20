/**
 * Created by imgyucheol on 2017. 9. 8..
 */

import React from 'react';
import axios from 'axios';
import history from '../../history';
import cookie from 'react-cookies';
import {Timeline, TimelineEvent} from 'react-event-timeline';
import TopNavigator from '../common/TopNavigator';
import './css/Consult.css';
import './css/page.css';

export default class Consult extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            consults: [],
            cardHeaderStyle: {
                backgroundColor: "#FCFCFC",
                color: "#030303",
                height: "6vh",
                maxHeight: "6vh"
            },
            contentStyle: {
                backgroundColor: "#D3D3D3",
                color: "#030303",
                maxHeight: "6vh",
                overflow: "hidden"
            }
        };
    }

    componentDidMount() {
        //window.scrollTo(0, 1);
        let empCode = location.pathname.split('/')[1];

        // cookie
        let userNo = cookie.load('user');

        // axios -> array로 받아옴
        axios.get(`/api/consult/${empCode}/${userNo}`, {}).then((consults) => {
            console.log(consults);
            console.log(typeof consults);
            if ((typeof consults.data) !== 'string') {
                this.setState({
                    consults: consults.data
                });
            } else {
                // 등록된 상품이 없거나, 잘못 접근함 -> redirect
                history.push(`/fail`);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    handleClickCard(consultNo) {
        let urlParse = location.pathname.split('/');
        let empCode = urlParse[1];
        history.push(`/${empCode}/private/consult/detail/${consultNo}`);
    }

    getIcon() {
        return <i className="fa fa-commenting fa-lg" aria-hidden="true"/>
    }

    render() {
        return (
            <div className="item-whole-div">
                <TopNavigator title="Consult"/>
                <div className="clear-div-2"/>

                <div className="search-div">
                    <input type="text"/>
                </div>

                <div className="clear-div-2"/>

                <div className="item-section-div">
                    <Timeline>
                        {this.state.consults.map((consult, idx) => {
                            return <TimelineEvent
                                title=""
                                createdAt={consult["REG_DATE"]}
                                iconColor="#008485"
                                container="card"
                                key={idx}
                                icon={this.getIcon()}
                                cardHeaderStyle={this.state.cardHeaderStyle}
                                contentStyle={this.state.contentStyle}
                                onClick={this.handleClickCard.bind(this, consult["NO"])}>
                                {consult["TITLE"]}
                            </TimelineEvent>
                        })}
                    </Timeline>
                </div>

                <div className="clear-div-4">{''}</div>
            </div>
        );
    }
}





