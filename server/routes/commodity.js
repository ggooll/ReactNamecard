/**
 * Created by imgyucheol on 2017. 9. 6..
 */
import express from 'express';
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');
const originDb = oracledb.oracledb;
const dbConfig = require('../database/config');

/**
 * selected Products..
 */
router.post('/overall', (req, res) => {
    let searchTable = req.body.selectedItem;
    let selectedCode = req.body.selectedBankCode;
    let params = [];

    let statement = `SELECT 
                    NO,
                    FIN_CO_NO,
                    KOR_CO_NM,
                    FIN_PRDT_NM,
                    INTR_RATE_TYPE,
                    JOIN_WAY,
                    MAX_LIMIT,
                    MTRT_INT,
                    JOIN_MEMBER FROM ${searchTable}`;

    if (selectedCode !== undefined && selectedCode !== "") {
        statement += ` WHERE FIN_CO_NO = :fin_co_no`;
        params.push(selectedCode);
    }

    oracledb.query(statement, params).then(function (dbResult) {
        let commodities = oracledb.transformToAssociated(dbResult);
        res.json(commodities);
    });
});

/**
 * detail
 */
router.post('/search/detail', (req, res) => {
    let searchTable = req.body.category;
    let no = req.body.paramNo;
    let statement = `SELECT 
                        NO,
                        TO_CHAR(DCLS_MONTH, 'yyyy-mm-dd') DCLS_MONTH,
                        FIN_CO_NO,
                        KOR_CO_NM,
                        FIN_PRDT_CD,
                        FIN_PRDT_NM,
                        JOIN_WAY,
                        MTRT_INT,
                        SPCL_CND,
                        JOIN_DENY,
                        JOIN_MEMBER,
                        ETC_NOTE,
                        MAX_LIMIT,
                        TO_CHAR(DCLS_STRT_DAY, 'yyyy-mm-dd') DCLS_STRT_DAY,
                        TO_CHAR(DCLS_END_DAY, 'yyyy-mm-dd') DCLS_END_DAY,
                        FIN_CO_SUBM_DAY 
                    FROM ${searchTable} 
                    WHERE NO = :no`;
    oracledb.query(statement, [no]).then(function (dbResult) {
        let commodity = oracledb.transformToAssociated(dbResult);
        res.json(commodity);
    });
});

/**
 * details option
 */
router.post('/search/option', (req, res) => {

    let searchTable = req.body.category;
    let dcls_month = req.body.commodity["DCLS_MONTH"];
    let fin_co_no = req.body.commodity["FIN_CO_NO"];
    let fin_prdt_cd = req.body.commodity["FIN_PRDT_CD"];

    let statement = `SELECT 
                        NO,
                        INTR_RATE_TYPE,
                        INTR_RATE_TYPE_NM,
                        SAVE_TRM,
                        INTR_RATE,
                        INTR_RATE2
                    FROM ${searchTable} 
                    WHERE 
                        to_char(dcls_month, 'yyyy-mm-dd') = :dcls_month
                        AND fin_co_no = :fin_co_no
                        AND fin_prdt_cd = :fin_prdt_cd`;

    oracledb.query(statement, [dcls_month, fin_co_no, fin_prdt_cd]).then(function (dbResult) {
        // savetrm 6 12 24 36
        let option = oracledb.transformToAssociated(dbResult);
        res.send(option);
    });
});

router.post('/search/processedInfo', (req, res) => {
    let category = req.body.category;
    let searchTable = category === 'deposit_info' ? 'deposit_processed' : 'savings_processed';
    let productNo = req.body.commodity["NO"];
    let productColumn = category === 'deposit_info' ? 'deposit_no' : 'savings_no';

    let statement = `SELECT * 
                     FROM ${searchTable}
                     WHERE ${productColumn} = :productNo`;

    oracledb.query(statement, [productNo]).then(function (dbResult) {
        let processedInfo = oracledb.transformToAssociated(dbResult);
        res.send(processedInfo);
    });
});

router.post('/search/special', (req, res) => {
    let category = req.body.category;
    let searchTable = category === 'deposit_info' ? 'deposit_special' : 'savings_special';
    let productNo = req.body.commodity["NO"];
    let productColumn = category === 'deposit_info' ? 'deposit_no' : 'savings_no';

    let statement = `SELECT *
                    FROM ${searchTable}
                    WHERE ${productColumn} = :productNo`;
    oracledb.query(statement, [productNo]).then(function (dbResult) {
        let special = oracledb.transformToAssociated(dbResult);
        res.send(special);
    });
});

function doRelease(conn) {
    conn.close(function (err) {
        if (err)
            console.error(err.message);
    });
}

// originDb
router.post('/insert/visitLog', (req, res) => {
    let ipv6 = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;

    let depositStatement = `insert into deposit_log 
                            (select :deposit_no, :ipv6, sysdate from dual where not exists 
                            (select * from deposit_log 
                            where deposit_no = :deposit_no and ipv6 = :ipv6 and to_char(reg_date, 'yyyy/mm/dd') = to_char(sysdate,'yyyy/mm/dd')))`;
    let savingsStatement = `insert into savgins_log 
                            (select :savings_no, :ipv6, sysdate from dual where not exists 
                            (select * from savings_log 
                            where savings_no = :savings_no and ipv6 = :ipv6 and to_char(reg_date, 'yyyy/mm/dd') = to_char(sysdate,'yyyy/mm/dd')))`;

    // req deposit_no, ip를 받아와 넣음
    let category = req.body.category;
    let productNo = req.body.paramNo;
    let statement = category === 'deposit_info' ? depositStatement : savingsStatement;
    let param = [productNo, ipv6, productNo, ipv6];

    originDb.getConnection(dbConfig, function (err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
        connection.execute(statement, param, {autoCommit: true},
            function (err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                doRelease(connection);
                res.send(result);
            });
    });
});

export default router;
