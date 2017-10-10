import React from 'react';
import TopNavigator from '../common/TopNavigator';
import axios from 'axios';
import history from '../../history';
import cookie from 'react-cookies';
import './css/page.css';
import './css/DatePicker.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/es';
moment.locale('es');

export default class Reservation extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            name:'',
            phone:'',
            location:'',
            type:'',
            msg:'',
            start_date:'',
            end_date:'',
            status:'',
            comments:'',
            startDate:moment(),

        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(date) {
        console.log(date._d);
        this.setState({
            startDate: date
        });
    }
    // componentDidMount() {
    //     let empCode = location.pathname.split('/')[1];
    //     let userNo = cookie.load('user');
    //
    //     axios.get(`/api/reservation/${empCode}/${userNo}`, {}).then((list) => {
    //         console.log(list);
    //         this.setState({list:list.data})
    //     }).catch((error) => {
    //         console.log(error);
    //     });
    // }
    render() {
        return (
            <div className="item-whole-div">
                <TopNavigator title="상담예약"/>

                <div>
                    <p>예약하기</p>
                </div>
                <div>
                    <DatePicker inline isClearable={true} shouldCloseOnSelect={false}
                        selected={this.state.startDate}
                        onChange={this.handleChange}
                        showTimeSelect
                        excludeTimes={[moment().hours(17).minutes(0), moment().hours(18).minutes(30), moment().hours(19).minutes(30)]}
                        dateFormat="LLL"
                    />
                </div>
            </div>
        );
    }

}