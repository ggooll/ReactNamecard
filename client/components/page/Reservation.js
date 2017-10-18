import React from 'react';
import TopNavigator from '../common/TopNavigator';
import axios from 'axios';
import async from 'async';
import history from '../../history';
import cookie from 'react-cookies';
import './css/Reservation.css';
import './css/DatePicker.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/ko';
moment.locale('ko');
import KoAddress from './KoAddress';

export default class Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            selectedSido: '',
            selectedGugun: '',
            selectedDong: '',
            selectCall: 'task-div task-selected',
            selectMeeting: 'task-div',
            name: '',
            phone: '',
            msg: '',
            type: 'Call',
            start_time: '',
            status: '',
            comments: '',
            startDate: '',
            availableTime: [],
            start_date: '',
            authUser: false
        };
        this.state = this.defaultState;
        this.handleChange = this.handleChange.bind(this);
        this.handleClickType = this.handleClickType.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleChangeSido = this.handleChangeSido.bind(this);
        this.handleChangeGugun = this.handleChangeGugun.bind(this);
        this.handleChangeDong = this.handleChangeDong.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
    }

    componentWillMount() {
        let userNo = cookie.load('user');
        if (userNo !== undefined) {
            axios.post(`/api/reservation/user`, {data: userNo}).then((result) => {
                if(result.data !== false){
                    this.setState({
                        name: result.data[0]['NAME'],
                        phone: result.data[0]['PHONE'],
                        authUser: true
                    });
                }
            }).catch((error) => {
                console.log(error);
            });
        } else {
            console.log('유저없음');
        }
    }

    componentDidMount() {
        window.scrollTo(0, 1);
    }

    handleChangeInput(event) {
        let result = {};
        result[event.target.name] = event.target.value;
        this.setState(result);
    }

    getItems(param, callback) {
        axios.get(`/api/reservation/check/${param.empCode}/${param.day}/${param.type}`, {}).then((list) => {
            callback(null, list.data, param);
        }).catch((error) => {
            console.log(error);
        });
    }

    getParameter(data, callback) {
        let empCode = location.pathname.split('/')[1];
        let param = {
            day: data.day,
            type: data.type,
            empCode: empCode
        };
        callback(null, param);
    }

    onPromise() {
        if (this.state.selectedSido === '') {
            return false;
        }
        if (this.state.selectedGugun === '') {
            return false;
        }
        if (this.state.selectedDong === '') {
            return false;
        }
        if (this.state.name === '') {
            return false;
        }
        if (this.state.phone === '') {
            return false;
        }
        return true;
    }

    handleChange(date) {
        // 이전값이 입력되지 않으면 날짜 선택 x
        if (this.onPromise() === true) {
            let day = moment(date._d).format('YYYY-MM-DD');
            let data = {day: day, type: this.state.type};
            let tasks = [
                async.apply(this.getParameter, data),
                this.getItems
            ];

            async.waterfall(tasks, (err, result, param) => {
                this.setState({
                    availableTime: result,
                    start_date: param.day,
                });
            });
        } else {
            window.alert('Step1을 입력해주세요!');
            window.scrollTo(0, 5);
        }
    }

    handleChangeSido(event) {
        let value = event.target.value;
        this.setState({
            selectedSido: value,
            selectedGugun: '',
            selectedDong: ''
        });
    }

    handleChangeGugun(event) {
        let value = event.target.value;
        this.setState({
            selectedGugun: value,
            selectedDong: ''
        });
    }

    handleChangeDong(event) {
        let value = event.target.value;
        this.setState({
            selectedDong: value
        });
    }

    handleChangeStartTime(event) {
        let value = event.target.value;
        this.setState({
            start_time: value
        });
    }

    handleClickType(type) {
        if (type === 'Call') {
            this.setState({
                selectCall: 'task-div task-selected',
                selectMeeting: 'task-div',
                type: type
            });
        } else {
            this.setState({
                selectCall: 'task-div',
                selectMeeting: 'task-div task-selected',
                type: type
            });
        }
    }

    handleRequest() {
        let param = {
            type: this.state.type,
            start_date: this.state.start_date,
            start_time: this.state.start_time,
            empCode: location.pathname.split('/')[1],
            customer_no: cookie.load('user'),
            msg: this.state.msg,
            location: this.state.selectedSido + " " + this.state.selectedGugun + " " + this.state.selectedDong,
            name: this.state.name,
            phone: this.state.phone,
        };

        axios.post(`/api/reservation/request`, {data: param}).then((result) => {
            window.alert(result.data.msg);
            // 성공했다 아니다 알릴 것!
            if(result.data.msg === 'success'){
                window.alert('예약성공 \n 고객님이 남겨주신 연락처로 연락드리겠습니다.');
            } else{
                window.alert('예약에 실패했습니다.');
            }
            let empCode = location.pathname.split('/')[1];
            history.push(`/${empCode}/`);
        }).catch((error) => {
            console.log(error);
        });
    }

    renderInputInfo() {
        return (
            <div>
                <div className="clear-div-3"/>
                <div className="reservation-input-div">
                    { this.state.authUser === false ?
                        <input type="text" name="name"
                               value={this.state.name}
                               placeholder="이름"
                               onChange={this.handleChangeInput}/> :
                        <span>{this.state.name}</span>
                    }
                </div>
                <div className="clear-div-3"/>
                <div className="reservation-input-div">
                    { this.state.authUser === false ?
                        <input type="text" name="phone"
                               value={this.state.phone}
                               placeholder="전화번호"
                               onChange={this.handleChangeInput}/> :
                        <span>{this.state.phone}</span>
                    }
                </div>
                <div className="clear-div-3"/>
                <div className="reservation-select-div">
                    <select value={this.state.selectedSido} onChange={this.handleChangeSido}>
                        <option value="">시,도</option>
                        {KoAddress.sido.map((sido, idx) => {
                            return <option key={idx} value={sido}>{sido}</option>;
                        })}
                    </select>

                    <select value={this.state.selectedGugun} onChange={this.handleChangeGugun}>
                        <option value="">구,군</option>
                        {this.state.selectedSido !== '' ?
                            KoAddress.gugun[this.state.selectedSido].map((gugun, idx) => {
                                return <option key={idx} value={gugun}>{gugun}</option>;
                            })
                            : undefined
                        }
                    </select>

                    <select value={this.state.selectedDong} onChange={this.handleChangeDong}>
                        {/* 구군이 선택되었따면 그 동을 렌더링함 */}
                        <option value="">동</option>
                        {this.state.selectedGugun !== '' ?
                            KoAddress.dong[`${this.state.selectedSido}->${this.state.selectedGugun}`].map((dong, idx) => {
                                return <option key={idx} value={dong}>{dong}</option>;
                            })
                            : undefined
                        }
                    </select>
                </div>
                <div className="clear-div-3"/>
                <div className="reservation-input-div">
                    <textarea type="text" name="msg"
                              value={this.state.msg}
                              placeholder=" 전하실 말씀이 있으면 적어주세요(선택)"
                              onChange={this.handleChangeInput}/>
                </div>
            </div>
        );
    }

    render() {

        return (
            <div className="item-whole-div">
                <TopNavigator title="상담예약"/>

                <div className="reservation-header-div">
                    <div className="reservation-title1">{'Step1. 연락처 및 정보를 입력해주세요'}</div>
                    {this.renderInputInfo(this)}

                    <div className="task-select-div">
                        <div className={this.state.selectCall}
                             onClick={this.handleClickType.bind(this, 'Call')}>
                            {'Call'}
                        </div>
                        <div className={this.state.selectMeeting}
                             onClick={this.handleClickType.bind(this, 'Meeting')}>
                            {'Meeting'}
                        </div>
                    </div>
                </div>

                <div className="reservation-calendar-div">
                    <div className="reservation-title2">{'Step2. 원하는 날짜를 선택하세요'}</div>
                    <DatePicker inline isClearable={true} shouldCloseOnSelect={false}
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                dateFormat="LLL"/>
                    <div className="selected-date-input-div">
                        <span>선택 날짜 : </span><input className="selected-date-input" value={this.state.start_date}/>
                    </div>
                </div>


                {this.state.start_date !== '' ?
                    <div className="reservation-possible-div">
                        <div className="reservation-title2">{'Step3. 아래 시간 중 원하는 시간을 선택하세요'}</div>
                        <select className="possible-time-select" value={this.state.start_time}
                                onChange={this.handleChangeStartTime}>
                            {this.state.availableTime.map((item, idx) => {
                                return (
                                    <option key={idx} value={item}>{item}</option>
                                );
                            })}
                        </select>
                    </div>
                    : undefined}

                {this.state.start_time !== '' ?
                    <div className="reservation-submit-div" onClick={this.handleRequest.bind(this)}>
                        예약
                    </div> :
                    <div className="reservation-preSubmit-div">
                        예약
                    </div>
                }
            </div>
        );
    }
}