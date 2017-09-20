/**
 * Created by imgyucheol on 2017. 9. 11..
 */

import React from 'react';
import history from '../../history';
import './TopNavigator.css';

export default class TopNavigator extends React.Component{

    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        history.goBack();
    }

    render(){
        return(
            <div className="item-top-navigation">
                <div className="nav-icon-div" onClick={this.handleClick}>
                    <i className="fa fa-chevron-left" aria-hidden="true" />
                </div>
                {this.props.title}
            </div>
        );
    }
}