/**
 * Created by imgyucheol on 2017. 9. 11..
 */

import React from 'react';
import './TopNavigator.css';
import history from '../../history';

export default class TopNavigator extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        //window.history.back();
        history.go(-1);
    }

    render() {
        return (
            <div className="item-top-navigation">
                <div className="nav-icon-div" onClick={this.handleClick}>
                    <i className="fa fa-chevron-left" aria-hidden="true"/>
                </div>
                {this.props.title}
            </div>
        );
    }
}