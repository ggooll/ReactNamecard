/**
 * Created by imgyucheol on 2017. 9. 12..
 */
import express from 'express';
import async from 'async';
const router = express.Router();
const oracledbAuto = require('oracledb-autoreconnect');
const oracledb = require('oracledb');
const dbConfig = require('../database/config');

function dateSort(a, b) {
    if (a["REG_DATE"] === b["REG_DATE"]) {
        return 0
    }
    return a["REG_DATE"] < b["REG_DATE"] ? 1 : -1;
}

function doRelease(conn) {
    conn.close(function (err) {
        if (err)
            console.error(err.message);
    });
}

function getDepositProducts(deposits, callback) {
    if(deposits.length === 0){
        callback(null, []);
    } else {
        let baseStatement = `SELECT 
                            NO,
                            FIN_CO_NO,
                            KOR_CO_NM,
                            FIN_PRDT_NM,
                            MTRT_INT,
                            JOIN_MEMBER 
                        FROM DEPOSIT_INFO 
                        WHERE NO IN `;

        let cond = '(';
        deposits.forEach((deposit, index, array) => {
            cond += `${deposit["PRODUCT_NO"]}`;
            if (index < array.length - 1) {
                cond += ',';
            }
        });
        baseStatement += cond + ')';

        oracledb.getConnection(dbConfig, function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            connection.execute(baseStatement, [],
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    let depositProducts = oracledbAuto.transformToAssociated(result);
                    doRelease(connection);
                    callback(null, depositProducts);
                });
        });
    }
}

function getSavingsProducts(savings, callback) {
    if(savings.length === 0){
        callback(null, []);
    } else {
        let baseStatement = `SELECT 
                            NO,
                            FIN_CO_NO,
                            KOR_CO_NM,
                            FIN_PRDT_NM,
                            MTRT_INT,
                            JOIN_MEMBER 
                        FROM SAVINGS_INFO 
                        WHERE NO IN `;

        let cond = '(';
        savings.forEach((saving, index, array) => {
            cond += `${saving["PRODUCT_NO"]}`;
            if (index < array.length - 1) {
                cond += ',';
            }
        });
        baseStatement += cond + ')';

        oracledb.getConnection(dbConfig, function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            connection.execute(baseStatement, [],
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    let savingsProducts = oracledbAuto.transformToAssociated(result);
                    doRelease(connection);
                    callback(null, savingsProducts);
                });
        });
    }
}

router.get('/findProducts/:consultNo', (req, res) => {
    let consultNo = req.params.consultNo;
    let consultProducts = [];
    let deposits = [];
    let savings = [];
    let params = [consultNo];
    let statement = `SELECT NO,
                            CONSULT_NO,
                            TYPE,
                            PRODUCT_NO 
                     FROM
                            CONSULT_PRODUCT 
                     WHERE 
                            CONSULT_NO = :consultNo`;

    oracledbAuto.query(statement, params).then(function (dbResult) {
        consultProducts = oracledbAuto.transformToAssociated(dbResult);

        deposits = consultProducts.filter((consultProduct) => {
            if (consultProduct["TYPE"] === 1) {
                return consultProduct;
            }
        });

        savings = consultProducts.filter((consultProduct) => {
            if (consultProduct["TYPE"] === 2) {
                return consultProduct;
            }
        });

        async.parallel({
                depositProducts: getDepositProducts.bind(null, deposits),
                savingsProducts: getSavingsProducts.bind(null, savings)
            },
            function (err, result) {
                let resultObj = {
                    depositProducts : result.depositProducts,
                    savingsProducts : result.savingsProducts
                };
                res.send(resultObj);
            }
        );
    });
});

router.get('/findOne/:consultNo', (req, res) => {
    let consultNo = req.params.consultNo;
    let params = [consultNo];
    let statement = `SELECT NO,
                            CUSTOMER_NO,
                            EMPLOYEE_NO,
                            CONTENT,
                            TO_CHAR(REG_DATE, 'yyyy-mm-dd') REG_DATE,
                            TITLE 
                     FROM CONSULT 
                     WHERE NO = :consultNo`;
    oracledbAuto.query(statement, params).then(function (dbResult) {
        let consult = oracledbAuto.transformToAssociated(dbResult);
        res.send(consult);
    });
});

router.get('/:empCode/:customerNo', (req, res) => {
    let customerNo = req.params.customerNo;
    let empCode = req.params.empCode;
    let params = [customerNo, empCode];
    let statement = `SELECT NO,
                            CUSTOMER_NO,
                            EMPLOYEE_NO,
                            CONTENT,
                            TO_CHAR(REG_DATE, 'yyyy-mm-dd') REG_DATE,
                            TITLE 
                     FROM CONSULT 
                     WHERE CUSTOMER_NO = :customerNo 
                     AND EMPLOYEE_NO = (SELECT NO FROM EMPLOYEE WHERE CODE = :empCode)`;

    oracledbAuto.query(statement, params).then(function (dbResult) {
        let consults = oracledbAuto.transformToAssociated(dbResult);
        consults.sort(dateSort);
        res.send(consults);
    });
});

export default router;
