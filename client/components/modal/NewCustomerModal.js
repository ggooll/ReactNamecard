/**
 * Created by imgyucheol on 2017. 9. 7..
 */

import React from 'react';
import {Form, FormControl, FormGroup, ControlLabel, Col, ButtonGroup, Button} from 'react-bootstrap';
import './css/modal.css';
import './css/newCustomerModal.css';

export default class NewCustomerModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            age: '',
            phone: '',
            email: '',
            location: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let result = {};
        result[event.target.name] = event.target.value;
        this.setState(result);
    }

    handleCloseModal(){
        this.props.closeModal();
    }

    handleSubmit(){
        // state 전송
        this.props.closeModal();
    }

    renderFormGroup(title, name, holder, inputState){
        return(
            <div className="modal-horizontal-div">
                <FormGroup>
                    <Col componentClass={ControlLabel} xs={3}>
                        {title}
                    </Col>
                    <Col xs={8}>
                        <FormControl type="text" value={inputState} name={name} placeholder={holder} onChange={this.handleChange}/>
                    </Col>
                    <Col xs={1}/>
                </FormGroup>
            </div>
        );
    }

    // rendering
    render() {
        return (
            <div className="modal-container">
                <div className="modal-logo-div">
                    {''}
                </div>
                <div>
                    <Form horizontal>
                        {this.renderFormGroup('이름','name','ha1', this.state.name)}
                        {this.renderFormGroup('나이','age','ha2', this.state.age)}
                        {this.renderFormGroup('전화번호','phone','ha3', this.state.phone)}
                        {this.renderFormGroup('이메일','email','ha4', this.state.email)}
                        {this.renderFormGroup('지역','location','ha5', this.state.location)}
                    </Form>

                    <div className="modal-button-div">
                        <Button className="new-form-submit" onClick={this.handleSubmit}>확인</Button>
                        <Button onClick={this.handleCloseModal}>닫기</Button>
                    </div>
                </div>
            </div>
        )
    }
}
