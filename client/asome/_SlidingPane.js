/**
 * Created by imgyucheol on 2017. 9. 4..
 */

import React from 'react';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

export default class AuthModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isPaneOpen: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal() {
        this.setState({
            isPaneOpen: true
        });
    }

    handleCloseModal() {
        this.setState({
            isPaneOpen: false
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleOpenModal}>Click me to open right pane!</button>
                <SlidingPane
                    className='some-custom-class'
                    overlayClassName='some-custom-overlay-class'
                    isOpen={ this.state.isPaneOpen }
                    title='Hey, it is optional pane title.  I can be React component too.'
                    subtitle='Optional subtitle.'

                    onRequestClose={this.handleCloseModal}>

                    <div>And I am pane content. BTW, what rocks?</div>
                    <br/>
                </SlidingPane>
            </div>
        );
    }
}