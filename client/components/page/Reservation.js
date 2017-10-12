import React from 'react';
import TopNavigator from '../common/TopNavigator';
import axios from 'axios';
import async from 'async';
import history from '../../history';
import cookie from 'react-cookies';
import './css/page.css';
import './css/OnDemand.css';
import './css/DatePicker.css';
import DatePicker from 'react-datepicker';
import moment from 'moment/min/moment-with-locales';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/en-ca';
moment.locale('en-ca');
//import moment from 'moment/min/moment-with-locales'

export default class Reservation extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            selectCall: 'gender-div',
            selectMeeting: 'gender-div',
            name:'',
            phone:'',
            location:'',
            type:'',
            msg:'',
            start_time:'',
            status:'',
            comments:'',
            startDate:'',
            availableTime : [],
            start_date:'',
            type:'',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClickType = this.handleClickType.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
    }

    getItems(param, callback) {
        console.log('getItems');
        console.log(param);
        //상담가능한시간체크

        axios.get(`/api/reservation/check/${param.empCode}/${param.day}/${param.type}`, {}).then((list) => {
            console.log(list);
            callback(null, list.data, param);
            //this.setState({availableTime:list.data})
        }).catch((error) => {
            console.log(error);
        });
    }

    getParameter(data, callback) {
        let empCode = location.pathname.split('/')[1];
        let param={day:data.day, type:data.type, empCode:empCode};
        callback(null, param);
    }
    handleChange(date) {
        let day = moment(date._d).format('YYYY-MM-DD');
        let data = {day:day, type:this.state.type};
        console.log(data);

        let tasks = [
            async.apply(this.getParameter, data),
            this.getItems
        ];

        async.waterfall(tasks, (err, result, param) => {
            this.setState({
                availableTime: result,
                start_date:param.day,
            });
            console.log(this.state);
        });
    }
    // handleClickTypeButton(type) {
    //     this.setState({
    //         type: type
    //     });
    // }
    handleClickType(type) {
        if (type == 'Call') {
            this.setState({
                selectCall: 'gender-div gender-selected',
                selectMeeting: 'gender-div',
                type:type,
            });
        } else {
            this.setState({
                selectCall: 'gender-div',
                selectMeeting: 'gender-div gender-selected',
                type:type,
            });
        }
    }
    handleTime(time){
        this.setState({
            start_time:time,
        })
    }
    handleRequest(){
        console.log('예약신청!!');
        console.log(this.state);
        //msg, location
        let param = {
            type : this.state.type,
            start_date : this.state.start_date,
            start_time : this.state.start_time,
            empCode : location.pathname.split('/')[1],
            customer_no : 68,//cookie.load('user'),
            msg : this.state.msg,
            location : this.state.location,
        }
        console.log(param);
        axios.post(`/api/reservation/request`, {data:param}).then((result) => {
            //console.log(result);
            window.alert(result.data.msg);
            let empCode = location.pathname.split('/')[1]
            history.push(`/${empCode}/`);
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        let myStyle = {
            border:'1px solid'
        };
        return (
            <div className="item-whole-div">
                <TopNavigator title="상담예약"/>

                <div>
                    <p>예약하기</p>
                </div>
                <div>
                    <div className={this.state.selectCall}
                         onClick={this.handleClickType.bind(this, 'Call')}>
                        {'Call'}
                    </div>
                    <div className={this.state.selectMeeting}
                         onClick={this.handleClickType.bind(this, 'Meeting')}>
                         {'Meeting'}
                    </div>
                </div>
                    {/*<div className="period-button-div">*/}
                        {/*<div onClick={this.handleClickTypeButton.bind(this, 'Meeting')}>Meeting</div>*/}
                        {/*<div onClick={this.handleClickTypeButton.bind(this, 'Call')}>Call</div>*/}
                    {/*</div>*/}
                <div>
                    <DatePicker inline isClearable={true} shouldCloseOnSelect={false}
                        selected={this.state.startDate}
                        onChange={this.handleChange}
                        dateFormat="LLL"
                    />
                </div>
                <div style={myStyle}>
                    <p>가능한 시간 리스트</p>
                    <div>
                        {this.state.availableTime.map((item)=>{
                            return(
                                    <div onClick={this.handleTime.bind(this,item)}>{item}</div>
                            );
                        })}
                    </div>
                </div>
                <div onClick={this.handleRequest.bind(this)}>
                    예약
                </div>
            </div>
        );
    }

}