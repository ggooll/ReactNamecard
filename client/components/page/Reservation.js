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
        this.defaultState={
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
        this.state = this.defaultState;
        this.handleChange = this.handleChange.bind(this);
        this.handleClickType = this.handleClickType.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
    }

    componentWillMount(){
        console.log('will');
        let userNo = cookie.load('user');
        console.log(userNo);
        if(userNo!=undefined){
            axios.post(`/api/reservation/user`, {data:userNo}).then((result)=>{
                console.log(result);
                this.setState({
                    name:result.data[0].NAME,
                    phone:result.data[0].PHONE});
                console.log(this.state);
            }).catch((error) => {
                console.log(error);
            });
        }else{
            console.log('유저없음');
        }
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
            customer_no : cookie.load('user'),
            msg : this.state.msg,
            location : this.state.location,
            name : this.state.name,
            phone : this.state.phone,
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
    ///
    handleChangeInput(event) {
        let value = event.target.value;
        console.log('========')
        console.log(value);
        //this.setState(evnet.value)
        // if(numberRegex.test(value)){
             let result = {};
             result[event.target.name] = event.target.value;
             this.setState(result);
        // }
        console.log(this.state);
    }
    //renderInputInfo(params, states(this.state.age), readOnly) {
    renderInputInfo() {
        return (
            <div>
                <div className="clear-div-2"/>
                <div className="list-input-div">
                    이름:{
                    cookie.load('user') == undefined ?
                    //    this.state.name == "" ?
                            <input type="text" name="name"
                                   value={this.state.name}
                                   onChange={this.handleChangeInput}/> :
                            <input type="text" value={this.state.name}/>
                    }
                </div>
                <div className="clear-div-2"/>
                <div className="list-input-div">
                    연락처 :{
                        //this.state.phone == "" ?
                    cookie.load('user') == undefined ?
                            <input type="text" name="phone"
                                   value={this.state.phone}
                                   onChange={this.handleChangeInput}/> :
                            <input type="text" value={this.state.phone}/>
                    }
                </div>
                <div className="clear-div-2"/>
                <div className="list-input-div">
                    장소 :{
                        <input type="text" name="location"
                               value={this.state.location}
                               onChange={this.handleChangeInput}/>
                     }
                </div>
                <div className="clear-div-2"/>
                <div className="list-input-div">
                    메세지 :{
                        <input type="text" name="msg"
                               value={this.state.msg}
                               onChange={this.handleChangeInput}/>
                     }
                </div>
            </div>
        );
    }
///
//     const ageParams = {
//         title: '나이',
//         right: '세 ',
//         defaultValue: '20',
//         targetName: 'age'
//     };
    render() {
        let myStyle = {
            border:'1px solid'
        };
        return (
            <div className="item-whole-div">
                <TopNavigator title="상담예약"/>
                <div className="list-input-demand">
                    {/*{this.renderInputInfo(ageParams, this.state.name)}*/}
                    {this.renderInputInfo(this)}
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
                <div style={myStyle} onClick={this.handleRequest.bind(this)}>
                    예약
                </div>
            </div>
        );
    }

}