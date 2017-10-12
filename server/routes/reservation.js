import express from 'express';
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');
const originDb = oracledb.oracledb;
const dbConfig = require('../database/config');

router.get('/:empCode/:customerNo', (req, res) => {
    let customerNo = req.params.customerNo;
    let empCode = req.params.empCode;
    let params = [customerNo, empCode];
    let statement = `SELECT NO,
                            CUSTOMER_NO,
                            EMPLOYEE_NO,
                            NAME,
                            PHONE,
                            LOCATION,
                            TYPE,
                            MSG,
                            TO_CHAR(START_DATE, 'yyyy-mm-dd') START_DATE,
                            TO_CHAR(END_DATE, 'yyyy-mm-dd') END_DATE,
                            STATUS,
                            COMMENTS
                     FROM RESERVATION 
                     WHERE CUSTOMER_NO = :customerNo 
                     AND EMPLOYEE_NO = (SELECT NO FROM EMPLOYEE WHERE CODE = :empCode)`;

    oracledb.query(statement, params).then(function (dbResult) {
        let list = oracledb.transformToAssociated(dbResult);
        console.log(list);
        res.send(list);
    });
});

router.get('/check/:empCode/:day/:type',(req,res)=>{
    console.log('check');
    let empCode = req.params.empCode;
    let day = req.params.day;
    let type = req.params.type;
    let params = [empCode, day, day, type];
    let statement =`SELECT NO, 
                           TO_CHAR(START_DATE,'HH24:MI') START_TIME,
                           TO_CHAR(END_DATE,'HH24:MI') END_TIME  
                    FROM SCHEDULE
                    WHERE EMPLOYEE_NO = (SELECT NO FROM EMPLOYEE WHERE CODE = :empCode)
                    AND TO_CHAR(START_DATE, 'YYYY-MM-DD') = :day AND TO_CHAR(END_DATE, 'YYYY-MM-DD') = :day 
                    AND TO_CHAR(START_DATE, 'HH24:MI') != '00:00'
                    AND TYPE = :type
                    ORDER BY 2`;
    console.log(params);

    oracledb.query(statement, params).then(function (dbResult) {
        let list = oracledb.transformToAssociated(dbResult);
        console.log(list.length);
        console.log(list);
        let result = temp(list, type);
        res.send(result);
    });

});
//insert into reservation
// values(reservation_seq.nextval, 1, 68, '임고객', '01099899444', '서울시 강남구', 'Meeting', '상담신청', to_date('2017/10/11 17:00','yyyy/MM/dd hh24:mi'),
// to_date('2017/10/11 16:00','yyyy/MM/dd hh24:mi')+ 0.5/24,'D',sysdate,'');
router.post('/request', (req,res)=>{
    console.log('request');
    console.log(req.body);
    const session = req.session;
    console.log(session.authUser);

    let empCode = req.body.data.empCode;
    let start_date = req.body.data.start_date;
    let start_time = req.body.data.start_time;
    let t_date = start_date+' '+start_time;
    let type = req.body.data.type;
    let customerNo = req.body.data.customer_no;
    let location = "서울시 서초구";//req.body.data.location;
    let msg = req.body.data.msg == undefined ? "" : req.body.data.msg;

    let name = session.authUser==undefined ? req.body.data.name : session.authUser.NAME;
    let phone = session.authUser==undefined ? req.body.data.phone : session.authUser.PHONE;

    let range = type =='Meeting' ? 1/24 : 0.5/24;
    let comments = "";

    let params = [empCode, customerNo, name, phone, location, type, msg, t_date, t_date ,comments];
    console.log(params);
    let statement =`INSERT INTO RESERVATION
                    VALUES(RESERVATION_SEQ.NEXTVAL, (select no from employee where code=:empCode), :customerNo, :name, :phone, :location, :type, :msg, 
                    to_date(:t_date, 'yyyy/MM/dd hh24:mi'), (to_date(:t_date, 'yyyy/MM/dd hh24:mi')+:range), 'D', sysdate, :comments)`;

    // oracledb.query(statement,params).then(function (dbResult) {
    //     // if(err){
    //     //     console.log('err');
    //     //     res.send({msg:"fail"});
    //     // }
    //     let cnt = oracledb.transformToAssociated(dbResult);
    //     console.log('cnt: '+cnt);
    //     let result = {msg:"success"};
    //     // if(cnt>0){
    //     //     result = {msg:"success"};
    //     // }else
    //     //     result = {msg:"fail"};
    //     res.send(result);
    // });

    //
    originDb.getConnection(dbConfig, function (err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
        connection.execute(statement, params, {autoCommit: true},
            function (err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    res.send({msg:"fail"});
                }
                doRelease(connection);
                res.send({msg:"success"});
            });
    });
});

function doRelease(conn) {
    conn.close(function (err) {
        if (err)
            console.error(err.message);
    });
}

function temp(dummy, type){
    let result=[];
    let data =
        [   {time:"10:00", available:true}, {time:"10:30", available:true},
            {time:"11:00", available:true}, {time:"11:30", available:true},
            {time:"12:00", available:true}, {time:"12:30", available:true},
            {time:"13:00", available:true}, {time:"13:30", available:true},
            {time:"14:00", available:true}, {time:"14:30", available:true},
            {time:"15:00", available:true}, {time:"15:30", available:true},
            {time:"16:00", available:true}, {time:"16:30", available:true},
            {time:"17:00", available:true}, {time:"17:30", available:true},
            {time:"18:00", available:true}, {time:"18:30", available:true},
            {time:"19:00", available:true}, {time:"19:30", available:true}];
    //let dummy = [{start:"11:00", end:"12:00"},{start:"14:00", end:"14:30"},{start:"14:30", end:"15:00"},{start:"15:00", end:"16:00"},{start:"18:00", end:"19:00"}];
    let index = 0 //type 1 or 2
    let num = type=='Call' ? 1 : 2;
    for(var i=0;i<data.length;){
        //index= type=='Call' ? 1 : 2;
        index=1;
        console.log("index : "+ index);
        if(dummy.length==0){
            break;
        }
        if(data[i+(num-1)].time<dummy[0].START_TIME){
            i+=index;
            //console.log(index);
        }else{
            data[i].available=false;
            var j=1;
            while(true){
                if(data[i+j].time<dummy[0].END_TIME){
                    data[i+j].available=false;
                    index++;
                    j++;
                }else{
                    break;
                }
            }
            dummy.splice(0,1);
        }
    }
    console.log('==data==');
    console.log(data);
    for(let value of data){
        if(value.available==true)
            result.push(value.time);
    }
    return result;
}
export default router;
// select no, type, to_char(start_date,'HH24:MI') as start_date
// from schedule
// where employee_no=1 and to_char(start_date,'yyyy/mm/dd')='2017/09/22' and type='Meeting';