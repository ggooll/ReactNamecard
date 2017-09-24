/**
 * Created by imgyucheol on 2017. 9. 8..
 */

import React from 'react';

export default class NoMatch extends React.Component {

    render() {
        return (
            <div>
                <div>잘못된 접근입니다.</div>
                <p>사원 코드가 잘못 전송된 경우</p>
                <p>임의로 이상한 값을 입력한 경우</p>

                <div>
                    <p><a href="#"> 다른 곳으로 보내기 1</a></p>
                    <p><a href="#"> 다른 곳으로 보내기 2</a></p>
                    <p><a href="#"> 다른 곳으로 보내기 3</a></p>
                    <p><a href="#"> 다른 곳으로 보내기 4</a></p>
                </div>
            </div>
        );
    }
}