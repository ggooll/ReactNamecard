/**
 * Created by imgyucheol on 2017. 9. 7..
 */

import React from 'react';
import './css/BottomItem.css';
import './css/NameCardBottom.css';
import history from '../../../history';

export default class PopularProduct extends React.Component {

    constructor(props, context) {
        super(props, context);

        // 인증을 했고, 기존고객메뉴를 누른경우 redirect
        // 인증을 완료 후 redirect
        this.state = {
            empCode: this.props.name,
            downVisible: 'down-menu',
            animation: 'slideUp'
        };

        this.handleDownMenuShow = this.handleDownMenuShow.bind(this);
    }

    handleDownMenuShow() {
        this.setState({
            downVisible: this.state.downVisible === 'down-menu' ? 'down-menu visible' : 'down-menu'
        });
    }

    handleLinkMenu(linkUri) {
        history.push(`/${this.state.empCode}/common/${linkUri}`);
    }

    render() {
        return (
            <div>
                {/* 타이틀 */}
                <div className="namecard-bottom-itemdiv" onClick={this.handleDownMenuShow}>
                    <span className="bottom-item-titlespan">
                        {this.props.menuTitle}
                        {
                            this.state.downVisible === 'down-menu' ?
                                <i className="fa fa-chevron-down" aria-hidden="true"/> :
                                <i className="fa fa-chevron-up" aria-hidden="true"/>
                        }
                    </span>
                </div>

                {/* dropdown 메뉴 */}
                <div className={this.state.downVisible}>

                    {/* 각 link가 붙음.. */}
                    <div className="drop-down-item" onClick={this.handleLinkMenu.bind(this, 'overall')}>
                        <span className="down-menu-span">
                            <i className="fa fa-angle-right" aria-hidden="true"/>{'전체 예,적금 상품보기'}
                        </span>
                    </div>

                    <div className="drop-down-item" onClick={this.handleLinkMenu.bind(this, 'rankAge')}>
                        <span className="down-menu-span">
                            <i className="fa fa-angle-right" aria-hidden="true"/>{'연령별 Top3'}
                        </span>
                    </div>

                    <div className="drop-down-item">
                        <span className="down-menu-span">
                            <i className="fa fa-angle-right" aria-hidden="true"/>{'어쩌구 Top3'}
                        </span>
                    </div>

                </div>

            </div>
        );
    }
}