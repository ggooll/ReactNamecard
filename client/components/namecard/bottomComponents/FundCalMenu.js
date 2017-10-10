/**
 * Created by imgyucheol on 2017. 9. 4..
 */

import React from 'react';
import history from '../../../history';
import 'rodal/lib/rodal.css';
import './css/BottomItem.css';
import './css/NameCardBottom.css';

export default class NewCustomer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            empCode: this.props.name,
        };

        this.goFundCalculator = this.goFundCalculator.bind(this);
    }

    goFundCalculator() {
        history.push(`/${this.state.empCode}/FundCalculator`);
    }


    // rendering
    render() {
        return (
            <div>
                <div className="namecard-bottom-itemdiv" onClick={this.goFundCalculator}>
                    <span className="bottom-item-titlespan">{this.props.menuTitle}</span>
                </div>
            </div>
        )
    }
}
