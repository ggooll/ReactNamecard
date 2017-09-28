/**
 * Created by imgyucheol on 2017. 8. 30..
 */
import React from 'react';
import './css/NameCardBottom.css';
import './css/BottomItem.css';
import '../../../global_css/global.css';
import PopularProduct from './PopularProduct';
import ExistCustomer from './ExistCustomer';
import NewCustomer from './NewCustomer';
import Chat from './Chat';

export default class NameCardBottom extends React.Component {

    constructor(props) {
        super(props);

        this.bottomItemTitles = ["상품보기", "기존고객", "새로운고객", "챗봇"];

        this.state = {
            empCode: this.props.name
        };
    };

    render() {
        return (
            <div className="namecard-bottom-container">
                <div className="bottom-empty-div">{''}</div>
                <hr/>

                <PopularProduct index={0}
                                menuTitle={this.bottomItemTitles[0]}
                                name={this.state.empCode}/>

                <ExistCustomer index={1}
                               menuTitle={this.bottomItemTitles[1]}
                               name={this.state.empCode}/>

                <NewCustomer index={2}
                             menuTitle={this.bottomItemTitles[2]}
                             name={this.state.empCode}/>

                <Chat index={3}
                             menuTitle={this.bottomItemTitles[3]}
                             name={this.state.empCode}/>

                <div className="namecard-bottom-itemdiv">
                    <span className="bottom-item-titlespan">{'empty'}</span>
                </div>

                {/*<Link to="ranking"><BottomItem/></Link>*/}
            </div>
        );
    }
}
