/**
 * Created by imgyucheol on 2017. 8. 31..
 */

import React from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import ShortCut from './ShortCut';
import history from '../../../history';
import './css/Introduce.css';
import '../../../global_css/clearDiv.css';
import '../../../global_css/slick.css';
import '../../../global_css/slick-theme.css';

export default class Introduce extends React.Component {
    constructor(props) {
        super(props);

        this.defaultState = {
            id: '',
            name: '',
            email: '',
            phone: '',
            sns: '',
            fax: '',
            dept_no: '',
            region_no: '',
            position: ''
        };

        // state object로 변경
        this.state = this.defaultState;
    }

    componentWillMount() {
        axios.get(`/api/employee/${this.props.name}`, {}).then((emp) => {
            if ((typeof emp.data) !== 'string') {
                this.setState({
                    id: emp.data["ID"],
                    name: emp.data["NAME"],
                    email: emp.data["EMAIL"],
                    phone: emp.data["PHONE"],
                    sns: emp.data["SNS"],
                    fax: emp.data["FAX"],
                    dept_no: emp.data["DEPT_NO"],
                    region_no: emp.data["REGION_NO"],
                    position: emp.data["POSITION"]
                });

                document.title = "하나 영업사원 " + this.state.name + "입니다.";
            } else {
                history.push(`/fail`);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getMarkedStrongTitle(content) {
        return (
            <strong>
                {content}
            </strong>
        );
    }

    render() {
        let settings = {
            accessibility: false,
            arrows: false,
            dots: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: false
        };

        return (
            <div className="namecard-whole-div">
                <Slider {...settings}>
                    <div>
                        <div className="clear-div-4"/>
                        <div className="namecard-image-div">
                            <img className="namecard-image"
                                 src="https://static.pexels.com/photos/220453/pexels-photo-220453.jpeg"/>
                        </div>

                        <div className="namecard-introduce-div">
                            <div>
                                <h3 id="introduce-name-text">{this.state.name}</h3>

                                {/* Introduce ( 이름 + 부서 직책? ) */}
                                {/*<h4 id="introduce-dept-text">{this.state.dept_no}, {this.state.region_no}</h4>*/}
                                <h4 id="introduce-dept-text">{"영업 1팀"}, {"경기도 남양주"}</h4>
                            </div>
                        </div>
                        <div className="clear-div-2"/>

                        <ShortCut phone={this.state.phone} email={this.state.email} sns={this.state.sns}/>
                        <div className="clear-div-2"/>
                    </div>

                    <div>
                        {/* vertical slide div - 상세정보 */}
                        <div className="detail-introduce-div">
                            <p>{this.getMarkedStrongTitle('회사')} : 하나금융티아이</p>
                            <p>{this.getMarkedStrongTitle('부서')} : {this.state.dept_no} </p>
                            <p>{this.getMarkedStrongTitle('직급')} : {this.state.position} </p>
                            <p>{this.getMarkedStrongTitle('주소')} : 청라... </p>
                            <p>{this.getMarkedStrongTitle('phone')} : {this.state.phone} </p>
                            <p>{this.getMarkedStrongTitle('email')} : {this.state.email} </p>
                            <p>{this.getMarkedStrongTitle('fax')} : {this.state.fax} </p>
                            <p>{this.getMarkedStrongTitle('sns')} : {this.state.sns} </p>
                        </div>
                    </div>

                </Slider>
            </div>
        );
    }
}
