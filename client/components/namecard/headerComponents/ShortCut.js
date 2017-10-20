/**
 * Created by imgyucheol on 2017. 8. 31..
 */

import React from 'react';
import './css/ShortCut.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default class ShortCut extends React.Component {

    constructor(props) {
        super(props);
        this.empUrl = `http://104.198.112.172:3000/${this.props.clip}`;
        this.handleClickClip = this.handleClickClip.bind(this);
    }

    handleClickClip(){
        window.alert('명함을 클립보드에 복사했습니다');
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
                        <li>
                            <CopyToClipboard
                                text={this.empUrl}>
                                <a onClick={this.handleClickClip}><img src="/images/shareIcon.png"/></a>
                            </CopyToClipboard>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
