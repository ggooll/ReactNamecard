/**
 * Created by imgyucheol on 2017. 10. 18..
 */

import React from 'react';
import TopNavigator from '../common/TopNavigator';

export default class BestCommodities extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <TopNavigator title="Best 상품"/>

                <div className="best-deposit-whole">

                </div>

                <div className="best-savings-whole">

                </div>

            </div>
        );
    }

}
