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
            searchValue: '',
            sorting: ''
        };

        this.handleSortSelect = this.handleSortSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        // window.scrollTo(0, 1);
        let empCode = location.pathname.split('/')[1];
        let userNo = cookie.load('user');

        // axios -> array로 받아옴
        axios.get(`/api/consult/${empCode}/${userNo}`, {}).then((consults) => {
            if ((typeof consults.data) !== 'string') {
                consults.data.sort(this.dateDescSort);
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

    dateDescSort(a, b) {
        if (a["REG_DATE"] === b["REG_DATE"]) {
            return 0
        }
        return a["REG_DATE"] < b["REG_DATE"] ? 1 : -1;
    }

    dateAscSort(a, b) {
        if (a["REG_DATE"] === b["REG_DATE"]) {
            return 0
        }
        return a["REG_DATE"] > b["REG_DATE"] ? 1 : -1;
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
            let sortFunc = selected === 'desc' ? this.dateDescSort : this.dateAscSort;
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
        history.push(`/${empCode}/private/consult/detail/${consultNo}`);
    }

    getIcon() {
        return <i className="fa fa-commenting fa-lg" aria-hidden="true"/>
    }

    render() {
        let headerStyle = {
            backgroundColor: "#FCFCFC",
            color: "#030303",
            height: "6vh",
            maxHeight: "6vh"
        };
        let contentStyle = {
            backgroundColor: "#D3D3D3",
            color: "#030303",
            maxHeight: "6vh",
            overflow: "hidden"
        };

        return (
            <div className="item-whole-div">
                <TopNavigator title="내 상담기록"/>
                <div className="clear-div-2"/>

                <div className="search-div">
                    <select onChange={this.handleSortSelect} value={this.state.sorting}>
                        <option value="desc">{'최근부터'}</option>
                        <option value="asc">{'처음부터'}</option>
                    </select>

                    <input type="text" name="searchValue" value={this.state.searchValue} onChange={this.handleChange}/>
                </div>
                <div className="clear-div-2"/>

                <div className="item-section-div">
                    <Timeline>
                        {this.state.consults.map((consult, idx) => {
                            if (consult["VISIBLE"] === 1) {
                                return (
                                    <TimelineEvent
                                        title=""
                                        createdAt={consult["REG_DATE"]}
                                        iconColor="#D40B3A"
                                        container="card"
                                        key={idx}
                                        icon={this.getIcon()}
                                        cardHeaderStyle={headerStyle}
                                        contentStyle={contentStyle}
                                        onClick={this.handleClickCard.bind(this, consult["NO"])}>
                                        {consult["TITLE"]}
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

