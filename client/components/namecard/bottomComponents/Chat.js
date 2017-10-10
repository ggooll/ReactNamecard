import React from 'react';
import './css/BottomItem.css';
import './css/NameCardBottom.css';
import history from '../../../history';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            empCode: this.props.name
        };
    }

    handleLinkMenu(linkUri) {
        history.push(`/${this.state.empCode}/${linkUri}`);
    }

    render() {
        return (
            <div>
                <div className="namecard-bottom-itemdiv" onClick={this.handleLinkMenu.bind(this, 'chatbot')}>
                    <span className="bottom-item-titlespan">{this.props.menuTitle}</span>
                </div>
            </div>
        )
    }
}