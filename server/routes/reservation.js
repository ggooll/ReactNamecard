import express from 'express';
import async from 'async';
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
                            TO_CHAR(START_DATE, 'yyyy-mm-dd HH24:MI') START_DATE,
                            TO_CHAR(END_DATE, 'yyyy-mm-dd HH24:MI') END_DATE,
                            STATUS,
                            COMMENTS
                     FROM RESERVATION 
                     WHERE CUSTOMER_NO = :customerNo 
                     AND EMPLOYEE_NO = (SELECT NO FROM EMPLOYEE WHERE CODE = :empCode)
                     ORDER BY 9 DESC`;

    oracledb.query(statement, params).then(function (dbResult) {
        let list = oracledb.transformToAssociated(dbResult);
        res.send(list);
    });
});

router.get('/check/:empCode/:day/:type', (req, res) => {
    console.log('check');
    let empCode = req.params.empCode;
    let day = req.params.day;
    let type = req.params.type;
    let params = [empCode, day, day, type];
    let statement = `SELECT NO, 
                           TO_CHAR(START_DATE,'HH24:MI') START_TIME,
                           TO_CHAR(END_DATE,'HH24:MI') END_TIME  
                    FROM SCHEDULE
                    WHERE EMPLOYEE_NO = (SELECT NO FROM EMPLOYEE WHERE CODE = :empCode)
                    AND TO_CHAR(START_DATE, 'YYYY-MM-DD') = :day AND TO_CHAR(END_DATE, 'YYYY-MM-DD') = :day 
                    AND TO_CHAR(START_DATE, 'HH24:MI') != '00:00'
                    AND TYPE = :type
                    ORDER BY 2`;

    oracledb.query(statement, params).then(function (dbResult) {
        let list = oracledb.transformToAssociated(dbResult);
        let result = getAvailableTime(list, type);
        res.send(result);
    });

});

router.post('/user', (req, res) => {
    let customerSession = req.session.authUser;
    if (customerSession === undefined) {
        res.send(false);
    } else {
        let params = [customerSession];
        let statement = `select name, phone from customer where no=:customerNo`;

        oracledb.query(statement, params).then(function (dbResult) {
            let result = oracledb.transformToAssociated(dbResult);
            res.send(result);
        });
    }
});

router.post('/request', (req, res) => {
    const session = req.session;
    let empCode = req.body.data.empCode;
    let start_date = req.body.data.start_date;
    let start_time = req.body.data.start_time;
    let t_date = start_date + ' ' + start_time;
    let type = req.body.data.type;
    let location = req.body.data.location;
    let msg = req.body.data.msg === undefined ? "" : req.body.data.msg;
    let name = req.body.data.name;      //session.authUser==undefined ? req.body.data.name : session.authUser.NAME;
    let phone = req.body.data.phone;    //session.authUser==undefined ? req.body.data.phone : session.authUser.PHONE;
    let range = type === 'Meeting' ? 1 / 24 : 0.5 / 24;
    let comments = "";

    //세션체크 후 세션이 없으면 name, phone으로 유저 가입 후 일정잡기
    async.waterfall([
        function (callback) {
            if (session.authUser === undefined) {
                let params = [name, phone, empCode];
                console.log(params);
                let statement = `insert into customer(no, name, phone, employee_no, grade, reg_date) 
                                 values(customer_seq.nextval, :name , :phone, (select no from employee where code=:empCode), '잠재', sysdate)`;
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
                                res.send({msg: "fail"});
                            }
                            doRelease(connection);
                            callback(null, true);
                        });
                });
            } else
                callback(null, false);
        },

        function (arg, callback) {
            if (arg === true) {
                let params = [phone];
                console.log(params);
                let statement = `SELECT NO,
                            NAME,
                            BIRTH_DATE,
                            PHONE,
                            EMPLOYEE_NO,
                            COMMENTS,
                            GRADE,
                            POST,
                            ADDRESS,
                            REG_DATE FROM CUSTOMER WHERE PHONE = :phone`;
                oracledb.query(statement, params).then(function (dbResult) {
                    let auth = oracledb.transformToAssociated(dbResult);
                    req.session.authUser = auth[0]["NO"];
                    callback(null);
                });
            } else {
                console.log('else');
                callback(null);
            }
        },

        function (callback) {
            let customerNo = req.session.authUser;
            let params = [empCode, customerNo, name, phone, location, type, msg, t_date, t_date, range, comments];
            let statement = `INSERT INTO RESERVATION
                    VALUES(RESERVATION_SEQ.NEXTVAL, (select no from employee where code=:empCode), :customerNo, :name, :phone, :location, :type, :msg, 
                    to_date(:t_date, 'yyyy/MM/dd hh24:mi'), (to_date(:t_date, 'yyyy/MM/dd hh24:mi')+:range), 'D', sysdate, :comments)`;
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
                            res.send({msg: "fail"});
                        }
                        doRelease(connection);
                        callback(null);
                    });
            });
        }
    ], function (err, result) {
        if (err) {
            console.log(err);
            res.send({msg: "fail"});
        }
        res.cookie('user', req.session.authUser);
        res.send({msg: "success"});
    });

});

function getAvailableTime(dummy, type) {
    let result = [];
    let data =
        [{time: "10:00", available: true}, {time: "10:30", available: true},
            {time: "11:00", available: true}, {time: "11:30", available: true},
            {time: "12:00", available: true}, {time: "12:30", available: true},
            {time: "13:00", available: true}, {time: "13:30", available: true},
            {time: "14:00", available: true}, {time: "14:30", available: true},
            {time: "15:00", available: true}, {time: "15:30", available: true},
            {time: "16:00", available: true}, {time: "16:30", available: true},
            {time: "17:00", available: true}, {time: "17:30", available: true},
            {time: "18:00", available: true}, {time: "18:30", available: true},
            {time: "19:00", available: true}, {time: "19:30", available: true}];
    let index = 0; //type 1 or 2
    let num = type === 'Call' ? 1 : 2;
    for (let i = 0; i < data.length;) {
        index = 1;
        if (dummy.length === 0) {
            break;
        }
        if (data[i + (num - 1)].time < dummy[0].START_TIME) {
            i += index;
            //console.log(index);
        } else {
            data[i].available = false;
            let j = 1;
            while (true) {
                if (data[i + j].time < dummy[0].END_TIME) {
                    data[i + j].available = false;
                    index++;
                    j++;
                } else {
                    break;
                }
            }
            dummy.splice(0, 1);
        }
    }
    for (let value of data) {
        if (value.available === true)
            result.push(value.time);
    }
    return result;
}

function doRelease(conn) {
    conn.close(function (err) {
        if (err)
            console.error(err.message);
    });
}

export default router;
// select no, type, to_char(start_date,'HH24:MI') as start_date
// from schedule
// where employee_no=1 and to_char(start_date,'yyyy/mm/dd')='2017/09/22' and type='Meeting';