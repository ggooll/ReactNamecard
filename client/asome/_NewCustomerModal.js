/**
 * Created by imgyucheol on 2017. 9. 7..
 */

import React from 'react';
import {Form, FormControl, FormGroup, ControlLabel, Col, ButtonGroup, Button} from 'react-bootstrap';
import '../components/modal/css/modal.css';
import './_newCustomerModal.css';

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

    componentDidMount() {
        window.scrollTo(0, 1);
    }

    handleChange(event) {
        let result = {};
        result[event.target.name] = event.target.value;
        this.setState(result);
    }

    handleCloseModal() {
        window.history.pushState('forward', null, './');
        this.props.closeModal();
    }

    handleSubmit() {
        window.history.pushState('forward', null, './');
        this.props.closeModal();
    }

    renderFormGroup(title, name, holder, inputState) {
        return (
            <div className="modal-horizontal-div">
                <FormGroup>
                    <Col xs={1}/>
                    <Col componentClass={ControlLabel} xs={3}>
                        {title}
                    </Col>
                    <Col xs={7}>
                        <FormControl type="text" value={inputState} name={name} placeholder={holder}
                                     onChange={this.handleChange}/>
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
                        {this.renderFormGroup('이름', 'name', '', this.state.name)}
                        {this.renderFormGroup('나이', 'age', '', this.state.age)}
                        {this.renderFormGroup('전화번호', 'phone', '-없이 입력해주세요', this.state.phone)}
                        {this.renderFormGroup('이메일', 'email', 'ex)hong1@naver.com', this.state.email)}
                        {this.renderFormGroup('지역', 'location', '서울특별시 서초구 서초동', this.state.location)}
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
