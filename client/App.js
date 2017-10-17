import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import history from './history';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import NameCard from './components/namecard/NameCard';
import OnDemand from './components/page/OnDemand';
import OnDemandResult from './components/page/OnDemandResult';
import OverAll from './components/page/OverAll';
import Consult from './components/page/Consult';
import Survey from './components/page/Survey';
import CommodityDetail from './components/page/CommodityDetail';
import ConsultDetail from './components/page/ConsultDetail';
import FundCalculator from './components/page/calculator/FundCalculator';
import ChatBot from './components/page/ChatBot';
import ReservationList from './components/page/ReservationList';
import Reservation from './components/page/Reservation';
import NoMatch from './NoMatch';
import './global_css/globalFont.css';
import './global_css/transition-group.css';
import 'moment/locale/fr-ca';

function getHistoryAction() {
    history.listen((location, action) => {
        window.detectingHistory.historyAction = action;
        // console.log(action); // push or pop
    });
    return window.detectingHistory.historyAction === 'PUSH' ? 'slideIn' : 'example';;
}

export default class App extends React.Component {

    constructor(props, context) {
        super(props, context);

        window.onpopstate = function () {
            window.detectingHistory.historyAction = 'POP';
            let detect = window.detectingHistory;
            if (detect.isModal === true) {
                let modalFunc = detect.modalFunc;
                modalFunc.call();
            }
        };
    }

    render() {
        return (
            <Router history={history}>
                <Route render={({location}) =>
                    <ReactCSSTransitionGroup
                        transitionName={getHistoryAction()}
                        transitionAppear={false}
                        transitionAppearTimeout={350}
                        transitionEnter={true}
                        transitionEnterTimeout={350}
                        transitionLeave={false}
                        transitionLeaveTimeout={350}>

                        <Switch location={location} key={location.key}>
                            <Route name="fail"
                                   exact path={`/fail`}
                                   render={() => (<NoMatch />)}/>

                            <Route name="productDetail"
                                   exact path={`/:empcode/products/:option/:no`}
                                   component={CommodityDetail}/>

                            <Route name="products"
                                   exact path={`/:empcode/products`}
                                   component={OverAll}/>

                            <Route name="consultDetailProducts"
                                   exact path={`/:empcode/consult/:option/:no`}
                                   component={CommodityDetail}/>

                            <Route name="consultDetail"
                                   exact path={`/:empcode/consult/:no`}
                                   component={ConsultDetail}/>

                            <Route name="consultInfo"
                                   exact path={`/:empcode/consult`}
                                   component={Consult}/>

                            <Route name="FundCalculator"
                                   exact path={`/:empcode/fundCalculator`}
                                   component={FundCalculator}/>

                            <Route name="chatBot"
                                   exact path={`/:empcode/chatbot`}
                                   component={ChatBot}/>

                            <Route name="onDemand"
                                   exact path={`/:empcode/onDemand`}
                                   component={OnDemand}/>

                            <Route name="onDemandResult"
                                   exact path={`/:empcode/onDemand/result`}
                                   component={OnDemandResult}/>

                            <Route name="ReservationList"
                                   exact path={`/:empcode/reservationlist`}
                                   component={ReservationList}/>

                            <Route name="Reservation"
                                   exact path={`/:empcode/reservation`}
                                   component={Reservation}/>

                            {/* 상담 관련 상품 정보 보기 추가 */}
                            <Route name="survey"
                                   exact path={`/:empcode/survey`}
                                   component={Survey}/>

                            <Route name="home"
                                   exact path={`/:empcode`}
                                   component={NameCard}/>

                        </Switch>
                    </ReactCSSTransitionGroup>
                }/>
            </Router>
        )
    }
}
