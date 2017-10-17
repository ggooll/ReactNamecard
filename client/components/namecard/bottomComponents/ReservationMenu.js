
import React from 'react';
import './css/BottomItem.css';
import './css/NameCardBottom.css';
import history from '../../../history';
import AuthExistCustomer from '../../modal/AuthExistModal';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import axios from 'axios';

export default class ReservationMenu extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.defaultState = {
            empCode: this.props.name,
            downVisible: 'down-menu',
            //isAuthorized: false,
            animation: 'slideUp'
        };

        this.state = this.defaultState;
    }


    handleLinkMenu(linkUri) {
        history.push(`/${this.state.empCode}/${linkUri}`);
    }

    render() {
        return (
            <div>
                {/* 타이틀 */}
                <div className="namecard-bottom-itemdiv" onClick={this.handleLinkMenu.bind(this, 'reservation')}>
                    <span className="bottom-item-titlespan">
                        {'상담예약하기'}
                    </span>
                </div>
            </div>
        );
    }
}