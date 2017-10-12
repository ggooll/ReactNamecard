import React from 'react';
import TopNavigator from '../common/TopNavigator';
import axios from 'axios';
import history from '../../history';
import cookie from 'react-cookies';
import './css/page.css';

export default class Reservation extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            list: [],
        };
    }
    componentDidMount() {
        let empCode = location.pathname.split('/')[1];
        let userNo = 68;//cookie.load('user');

        // axios -> array로 받아옴
        // 신청내역조회
        axios.get(`/api/reservation/${empCode}/${userNo}`, {}).then((list) => {
            console.log(list);
            this.setState({list:list.data})
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        return (
            <div className="item-whole-div">
                <TopNavigator title="상담예약내역"/>

                <div>
                    <p>예약내역</p>
                </div>

                <div>
                    {this.state.list.map((item)=>{
                     return(
                         <div>
                            <p>{item["TYPE"]}</p>
                            <p>{item["MSG"]}</p>
                            <p>{item["LOCATION"]}</p>
                            <p>{item["START_DATE"]}</p>
                            <p>{item["END_DATE"]}</p>
                            <p>{item["STATUS"]}</p>
                            <p>{item["COMMENTS"]}</p>
                         </div>
                        );
                    })}
                </div>

            </div>
        );
    }

}