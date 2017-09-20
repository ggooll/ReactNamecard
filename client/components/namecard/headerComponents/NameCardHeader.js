/**
 * Created by imgyucheol on 2017. 8. 30..
 */

import React from 'react';
import './css/NameCardHeader.css';
import './css/Introduce.css';
import Introduce from "./Introduce";

export default class NameCardHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="namecard-header-container">

                <div className="header-top-line">
                    <div className="top-left-line"/>
                    <div className="top-focus-line"/>
                    <div className="top-right-line"/>
                </div>


                <div className="clear-div-2"/>
                <div className="namecard-logo-div">
                    <img className="logo-image" src="/images/hanaTiLogo.jpg"/>
                </div>

                <Introduce name={this.props.name}/>
            </div>
        );
    }
}
