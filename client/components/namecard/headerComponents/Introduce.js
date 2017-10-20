/**
 * Created by imgyucheol on 2017. 8. 31..
 */

import React from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import ShortCut from './ShortCut';
import history from '../../../history';
import {Helmet} from 'react-helmet';
import './css/Introduce.css';
import '../../../global_css/clearDiv.css';
import '../../../global_css/slick.css';
import '../../../global_css/slick-theme.css';

export default class Introduce extends React.Component {
    constructor(props) {
        super(props);

        this.sliderSettings = {
            accessibility: true,
            arrows: false,
            dots: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: false
        };

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

        this.state = this.defaultState;
    }

    componentWillMount(){
        axios.get(`/api/employee/${this.props.name}`, {}).then((emp) => {
            console.log(emp);
            if ((typeof emp.data) === 'object') {
                this.setState({
                    id: emp.data["ID"],
                    name: emp.data["NAME"],
                    email: emp.data["EMAIL"],
                    phone: emp.data["PHONE"],
                    sns: emp.data["SNS"],
                    fax: emp.data["FAX"],
                    dept_no: emp.data["DEPT_NO"],
                    dept_name: emp.data["DEPT_NAME"],
                    region_no: emp.data["REGION_NO"],
                    region_name: emp.data["REGION_NAME"],
                    position: emp.data["POSITION"]
                });

                document.title = "하나 영업사원 " + this.state.name + "입니다.";
            } else {
                console.log('not available code : ' + this.props.name);
                let code = {
                    inputCode : this.props.name
                };
                history.push({
                    pathname: '/fail',
                    state: {code: code}
                })
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getStrongTitle(content) {
        return (
            <strong>
                {content}
            </strong>
        );
    }

    render() {


        return (
            <div className="namecard-whole-div">

                <Helmet>
                    <meta property="og:title" content={`하나 영업사원 ${this.state.name}입니다.`}/>
                    <meta property="og:url" content={`http://104.198.112.172:3000/${this.props.name}`}/>
                    <meta property="og:image" content={`/images/HanaTiLogo.jpg`}/>
                    <meta property="og:description" content="야호~! 하고싶은 말"/>
                </Helmet>


                <Slider {...this.sliderSettings}>
                    <div>
                        <div className="clear-div-4"/>
                        <div className="namecard-image-div">
                            <img className="namecard-image"
                                 src="https://vignette1.wikia.nocookie.net/cutemariobro/images/5/59/Person-placeholder.jpg"/>
                        </div>

                        <div className="namecard-introduce-div">
                            <div>
                                <h3 id="introduce-name-text">{this.state.name}</h3>

                                {/* Introduce ( 이름 + 부서 직책? ) */}
                                {/*<h4 id="introduce-dept-text">{this.state.dept_no}, {this.state.region_no}</h4>*/}
                                <h4 id="introduce-dept-text">{"영업 1팀"}, {"경기도 남양주"}</h4>
                            </div>
                        </div>
                        <div className="clear-div-3"/>

                        <ShortCut phone={this.state.phone} email={this.state.email} sns={this.state.sns} clip={this.props.name}/>
                        <div className="clear-div-2"/>
                    </div>

                    <div>
                        {/* vertical slide div - 상세정보 */}
                        <div className="detail-introduce-div">
                            <p>{this.getStrongTitle('회사')} : 하나금융티아이</p>
                            <p>{this.getStrongTitle('부서')} : {this.state.dept_name} </p>
                            <p>{this.getStrongTitle('직급')} : {this.state.position} </p>
                            <p>{this.getStrongTitle('지역')} : {this.state.region_name}</p>
                            <p>{this.getStrongTitle('phone')} : <a href={`tel:${this.state.phone}`}>{this.state.phone}</a></p>
                            <p>{this.getStrongTitle('email')} : <a href={`mailto:${this.state.email}?subject=문의입니다`}>{this.state.email}</a></p>
                            <p>{this.getStrongTitle('fax')} : {this.state.fax} </p>
                            <p>{this.getStrongTitle('sns')} : <a href={`${this.state.sns}`}>{this.state.sns}</a></p>
                        </div>
                    </div>

                </Slider>
            </div>
        );
    }
}
