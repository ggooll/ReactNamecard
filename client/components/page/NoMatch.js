/**
 * Created by imgyucheol on 2017. 9. 8..
 */

import React from 'react';

export default class NoMatch extends React.Component {

    constructor(props) {
        super(props);
        this.inputCode = this.props.location.state.inputCode;
    }

    render() {
        return (
            <div className="noMatch-whole-div">
                <div>404</div>
                <div>잘못된 접근입니다.</div>
                <div>다음과 같은 경우일 수 있습니다.</div>
                <div>{this.inputCode} 가 올바르지 않은 사원코드일 수 있습니다.</div>
                <div>또한 임의로 이상한 값을 입력한 경우일 수 있습니다.</div>

                <div className="clear-div-4"/>

                <div>
                    <div><a href="#"> 다른 곳으로 보내기 1</a></div>
                    <div><a href="#"> 다른 곳으로 보내기 2</a></div>
                    <div><a href="#"> 다른 곳으로 보내기 4</a></div>
                </div>
            </div>
        );
    }
}
