/**
 * Created by imgyucheol on 2017. 10. 7..
 */
/**
 * Created by imgyucheol on 2017. 9. 4..
 */

import React from 'react';
import NewCustomerModal from '../../modal/NewCustomerModal';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import './css/BottomItem.css';
import './css/NameCardBottom.css';

export default class NewCustomer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            empCode: this.props.name,
            modalVisiable: false,
            animation: 'slideUp'
        };

        this.handleModalHide = this.handleModalHide.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
    }

    handleModalShow() {
        this.setState({
            modalVisiable: true
        });

        window.detectingHistory.isModal = true;
        window.detectingHistory.modalFunc = this.handleModalHide;
        window.history.pushState('forward', null, './newCustomer');
    }

    handleModalHide() {
        this.setState({
            modalVisiable: false
        });
    }

    // rendering
    render() {
        return (
            <div>
                <div className="namecard-bottom-itemdiv" onClick={this.handleModalShow}>
                    <span className="bottom-item-titlespan">{this.props.menuTitle}</span>
                </div>

                <Rodal
                    visible={this.state.modalVisiable}
                    onClose={this.handleModalHide}
                    customStyles={{height: 'auto', width: 'auto', margin: 0}}
                    closeOnEsc={false}
                    animation={this.state.animation}
                    duration={300}
                    showCloseButton={false}>

                    <NewCustomerModal closeModal={this.handleModalHide}/>
                </Rodal>

            </div>
        )
    }
}
