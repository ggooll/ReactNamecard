/**
 * Created by imgyucheol on 2017. 10. 15..
 */
import React from 'react';
import $ from 'jquery';


export default class CUSTOM extends React.Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){
        // ajax
        $.ajax({
            url: 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%3D%22USDKRW%22&format=xml&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
        }).done(function(result){
            console.log(result);
        });
    }

    render(){
        return(
            <div>

            </div>
        );
    }

}