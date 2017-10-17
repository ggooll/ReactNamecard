import React from 'react';
import TopNavigator from '../common/TopNavigator';
import axios from 'axios';
import cookie from 'react-cookies';
import './css/page.css';
import './css/ReservationList.css';

export default class Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
        };
    }

    componentDidMount() {
        window.scrollTo(0, 1);
        let empCode = location.pathname.split('/')[1];
        let userNo = cookie.load('user');

        // 신청내역조회
        axios.get(`/api/reservation/${empCode}/${userNo}`, {}).then((list) => {
            console.log(list);
            this.setState({list: list.data})
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="item-whole-div">
                <TopNavigator title="상담예약내역"/>

                <div>
                    {this.state.list.map((item, idx) => {
                        return (
                            <div key={idx} className="reservation-list-div">
                                <div className="reservation-list-type">
                                    {item["TYPE"] === 'Call' ?
                                        <i className="fa fa-phone" aria-hidden="true"/>
                                        : <i className="fa fa-user" aria-hidden="true"/>
                                    }
                                    {item["TYPE"]}

                                    {item["STATUS"] === 'Y' ?
                                        <div className="reservation-list-msg reserve-success">
                                            예약완료
                                        </div> : undefined}
                                    {item["STATUS"] === 'N' ?
                                        <div className="reservation-list-msg reserve-cancel">
                                            취소됨
                                        </div> : undefined
                                    }
                                    {item["STATUS"] === 'D' ?
                                        <div className="reservation-list-msg reserve-wait">
                                            대기중
                                        </div> : undefined
                                    }
                                </div>
                                <div className="clear-div-1"/>
                                <div className="reservation-list-location">
                                    장소 : {item["LOCATION"]}
                                </div>

                                <div className="reservation-list-location">
                                    시간 : {item["START_DATE"]}
                                </div>

                                {item["MSG"] !== null ?
                                    <div className="reservation-list-location">
                                        메시지 : {item["MSG"]}
                                    </div>
                                    : undefined}
                                {/*<p>{item["END_DATE"]}</p>*/}
                                <div className="clear-div-1"/>
                            </div>
                        );
                    })}
                </div>

            </div>
        );
    }

}