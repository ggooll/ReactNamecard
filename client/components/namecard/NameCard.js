/**
 * Created by imgyucheol on 2017. 8. 30..
 */
import React from 'react';
import NameCardHeader from './headerComponents/NameCardHeader';
import NameCardBottom from './bottomComponents/NameCardBottom';
import '../../global_css/global.css';

export default class NameCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            empCode: location.pathname.replace(/\//g, '')
        }
    }

    componentDidMount() {
        window.scrollTo(0, 1);
    }

    render() {
        //console.log(this.props.match.params.name);
        return (
            <div>
                {/*명함 - name -> props */}
                <NameCardHeader name={this.state.empCode}/>

                {/*기능*/}
                <NameCardBottom name={this.state.empCode}/>
            </div>
        );
    }
}