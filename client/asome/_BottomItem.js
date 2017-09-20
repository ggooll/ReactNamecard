/**
 * Created by imgyucheol on 2017. 9. 1..
 */

import React from 'react';
import PropTypes from 'prop-types';
import '../components/namecard/bottomComponents/css/NameCardBottom.css';
import './css/BottomItem.css';

import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import AuthExistCustomer from "./modal/AuthExistModal";
import NewCustomer from "./NewCustomer";
import history from '../../../history';

export default class BottomItem extends React.Component {

    constructor(props, context) {
        super(props, context);

        // 인증을 했고, 기존고객메뉴를 누른경우 redirect
        // 인증을 완료 후 redirect

        let empCode = location.pathname.replace(/\//g, '');

        this.state = {
            empCode : empCode,
            isNeedAuthorization: this.props.isNeedAuthorization,
            modalVisiable: false,
            downVisible: 'downmenu',
            isAuthorized: false,
            animation: 'slideUp'
        };

        this.handleModalHide = this.handleModalHide.bind(this);
        this.handleDownMenuShow = this.handleDownMenuShow.bind(this);
        this.handleExistAuth = this.handleExistAuth.bind(this);
    }

    promiseDown() {

        // 신규고객을 누른경우
        if (this.props.index === 2) {
            this.setState({
                modalVisiable: true
            });
            return false;
        }

        // exist -> webStorage check
        if (window.localStorage.getItem("existAuth") !== null) {
            return true;
        }

        // 인증이 필요하지 않은 메뉴거나(공통), 이미 인증이 된 경우
        if (this.state.isNeedAuthorization === false || this.state.isAuthorized === true) {
            return true;
        }

        // 인증이 필요한 경우
        this.setState({
            modalVisiable: true
        });
        return false;
    }

    handleDownMenuShow() {
        if (this.promiseDown() === true) {
            this.setState({
                downVisible: this.state.downVisible === 'downmenu' ? 'downmenu visible' : 'downmenu'
            });
        }
    }

    handleModalHide() {
        this.setState({
            modalVisiable: false
        });
    }

    handleExistAuth() {
        // 모달을 닫고
        this.setState({
            modalVisiable: false
        });

        // link
        history.push(`/${this.state.empCode}/privateCustomer`);
    }

    render() {
        return (
            <div>
                {/* 타이틀 */}
                <div className="namecard-bottom-itemdiv" onClick={this.handleDownMenuShow}>
                    <span className="bottom-item-titlespan">{this.props.menuTitle}</span>
                </div>

                {/* dropdown 메뉴 */}
                <div className={this.state.downVisible}>
                    {this.props.downMenus.map((menu, idx) => {
                        return <div className="dropdown-item" key={idx}><span className="downmenu-span">{menu}</span>
                        </div>
                    })}
                </div>

                {/* modal */}
                <Rodal
                    visible={this.state.modalVisiable}
                    onClose={this.handleModalHide}
                    customStyles={{height: 'auto', width: 'auto', margin: 0}}
                    closeOnEsc={true}
                    animation={this.state.animation}
                    duration={300}>

                    {this.props.index === 1 ? <AuthExistCustomer onPromise={this.handleExistAuth}
                                                                 closeModal={this.handleModalHide}/> : undefined}
                    {this.props.index === 2 ? <NewCustomer closeModal={this.handleModalHide}/> : undefined}
                </Rodal>

            </div>
        );
    }
}

BottomItem.defaultProps = {
    index: -1,
    menuTitle: 'test',
    downMenus: [],
    isNeedAuthorization: false
};

BottomItem.propTypes = {
    index: PropTypes.number,
    menuTitle: PropTypes.string,
    downMenus: PropTypes.array,
    isNeedAuthorization: PropTypes.bool,
};