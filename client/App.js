import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import history from './history';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import NameCard from './components/namecard/NameCard';
import AgeGroup from './components/page/AgeGroup';
import OverAll from './components/page/OverAll';
import Consult from './components/page/Consult';
import Survey from './components/page/Survey';
import CommodityDetail from './components/page/CommodityDetail';
import ConsultDetail from './components/page/ConsultDetail';
import NoMatch from './NoMatch';
import './global_css/globalFont.css';
import './global_css/transition-group.css';

function getHistoryAction() {
    history.listen((location, action) => {
        window.detectingHistory.historyAction = action;
    });
    return window.detectingHistory.historyAction === 'PUSH' ? 'slideIn' : 'example';
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
                                   exact path={"/fail"}
                                   render={() => (<NoMatch />)}/>

                            <Route name="home"
                                   exact path={"/:empcode"}
                                   component={NameCard}/>

                            {/* depth 1 */}

                            <Route name="overall"
                                   exact path={"/:empcode/common/overall"}
                                   component={OverAll}/>

                            <Route name="ageGroup"
                                   exact path={"/:empcode/common/rankAge"}
                                   component={AgeGroup}/>

                            <Route name="consultInfo"
                                   exact path={"/:empcode/private/consult"}
                                   component={Consult}/>

                            {/* 상담 관련 상품 정보 보기 추가 */}

                            <Route name="survey"
                                   exact path={"/:empcode/private/survey"}
                                   component={Survey}/>


                            {/* depth 2 */}

                            <Route name="productDetail"
                                   exact path={"/:empcode/commodities/:option/:no"}
                                   component={CommodityDetail}/>

                            <Route name="consultDetail"
                                   exact path={"/:empcode/private/consult/detail/:no"}
                                   component={ConsultDetail}/>

                        </Switch>
                    </ReactCSSTransitionGroup>
                }/>
            </Router>
        )
    }
}
