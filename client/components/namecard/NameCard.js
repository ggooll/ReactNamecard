/**
 * Created by imgyucheol on 2017. 8. 30..
 */
import React from 'react';
// import MetaTags from 'react-meta-tags';
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
                {/*<MetaTags>*/}
                    {/*<meta id="og-title" property="og:title" content={this.state.empCode} />*/}
                    {/*<meta id="og-image" property="og:image" content="/images/hanaTiLogo.jpg" />*/}
                {/*</MetaTags>*/}

                {/*명함 - name -> props */}
                <NameCardHeader name={this.state.empCode}/>

                {/*기능*/}
                <NameCardBottom name={this.state.empCode}/>
            </div>
        );
    }
}