/**
 * Created by imgyucheol on 2017. 8. 31..
 */

import React from 'react';
import './css/ShortCut.css';

export default class ShortCut extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {/* Short Cut */}
                <div className="short-cut-div">
                    <ul>
                        <li>
                            <a href={`tel:${this.props.phone}`}><img src="/images/phoneIcon.png"/></a>
                        </li>
                        <li>
                            <a href={`sms:${this.props.phone}`}><img src="/images/messageIcon.png"/></a>
                        </li>
                        <li>
                            <a href={`mailto:${this.props.email}?subject=hihello`}><img src="/images/mailIcon.png"/></a>
                        </li>
                        <li>
                            <a href={`${this.props.sns}`}><img src="/images/twitterIcon.png"/></a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
