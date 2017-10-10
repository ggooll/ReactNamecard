/**
 * Created by imgyucheol on 2017. 9. 8..
 */

import React from 'react';
import axios from 'axios';
import history from '../../history';
import cookie from 'react-cookies';
import {Timeline, TimelineEvent} from 'react-event-timeline';
import TopNavigator from '../common/TopNavigator';
import staticResource from './StaticResource';
import './css/Consult.css';
import './css/page.css';

export default class Consult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            consults: [],
            searchValue: '',
            sorting: ''
        };

        this.handleSortSelect = this.handleSortSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        let empCode = location.pathname.split('/')[1];
        let userNo = cookie.load('user');

        // axios -> array로 받아옴
        axios.get(`/api/consult/${empCode}/${userNo}`, {}).then((consults) => {
            if ((typeof consults.data) !== 'string') {
                consults.data.sort(this.dateDescSort);
                this.setState({
                    consults: consults.data
                });
                window.scrollTo(0, 1);
            } else {
                // 등록된 상품이 없거나, 잘못 접근함 -> redirect
                history.push(`/fail`);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    handleChange(event) {
        let filterToken = event.target.value;
        let filteredConsults = this.state.consults.map((consult) => {
            if (consult["TITLE"].indexOf(filterToken) < 0) {
                consult["VISIBLE"] = 0;
            } else {
                consult["VISIBLE"] = 1;
            }
            return consult;
        });

        this.setState({
            consults: filteredConsults,
            searchValue: filterToken
        });
    }

    handleSortSelect(event) {
        let selected = event.target.value;
        console.log(selected);
        if (this.state.sorting !== selected) {
            let sortFunc = selected === 'desc' ? staticResource.dateDescSort : staticResource.dateAscSort;
            let sortedConsults = this.state.consults.sort(sortFunc);
            this.setState({
                consults: sortedConsults,
                sorting: selected
            });
        }
    }

    handleClickCard(consultNo) {
        let urlParse = location.pathname.split('/');
        let empCode = urlParse[1];
        history.push(`/${empCode}/consult/${consultNo}`);
    }

    getIcon() {
        // fa-sticky-note
        return <i className="fa fa-tasks fa-lg" aria-hidden="true"/>
    }

    render() {
        let headerStyle = {
            backgroundColor: "#d2dee4",
            color: "#030303",
            minHeight: "6vh",
        };
        let contentStyle = {
            backgroundColor: "#f9f9f9",
            color: "#030303",
            minHeight: "6vh",
            overflow: "hidden"
        };

        return (
            <div className="item-whole-div">
                <TopNavigator title="내 상담기록"/>

                <div className="consult-background-div"/>
                <div className="consult-introduce-div">테스트세트스테스</div>

                <div className="search-div">
                    <div>
                        <select onChange={this.handleSortSelect} value={this.state.sorting}>
                            <option value="desc">{'최근부터'}</option>
                            <option value="asc">{'처음부터'}</option>
                        </select>
                    </div>
                    <div>
                        <input type="text" name="searchValue" value={this.state.searchValue} onChange={this.handleChange}/>
                    </div>
                </div>
                <div className="clear-div-2"/>

                <div className="item-section-div">
                    <Timeline>
                        {this.state.consults.map((consult, idx) => {
                            if (consult["VISIBLE"] === 1) {
                                return (
                                    <TimelineEvent
                                        title={consult["TITLE"]}
                                        createdAt={consult["REG_DATE"]}
                                        iconColor="#4a6875"
                                        container="card"
                                        key={idx}
                                        icon={this.getIcon()}
                                        cardHeaderStyle={headerStyle}
                                        contentStyle={contentStyle}
                                        onClick={this.handleClickCard.bind(this, consult["NO"])}>
                                        {consult["CONTENT"]}
                                    </TimelineEvent>);
                            } else {
                                return undefined;
                            }
                        })}
                    </Timeline>
                </div>
                <div className="clear-div-4">{''}</div>
            </div>
        );
    }
}

