import express from 'express';
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');

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

export default router;