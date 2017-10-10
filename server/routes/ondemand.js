/**
 * Created by imgyucheol on 2017. 9. 25..
 */
import express from 'express';
// import async from 'async';
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');
const dbConfig = require('../database/config');

let depositQuery = `select * from deposit_info di, deposit_options do, deposit_processed dp 
                            where di.dcls_month = do.dcls_month 
                            and di.fin_co_no = do.fin_co_no 
                            and di.fin_prdt_cd = do.fin_prdt_cd 
                            and di.no = dp.deposit_no 
                            and do.save_trm = :saveTrm`;

let savingsQuery = `select * from savings_info si, savings_options so, savings_processed sp 
                            where si.dcls_month = so.dcls_month 
                            and si.fin_co_no = so.fin_co_no 
                            and si.fin_prdt_cd = so.fin_prdt_cd 
                            and si.no = sp.savings_no 
                            and so.save_trm = :saveTrm`;

let depositSpecialQuery = `select DEPOSIT_NO, SPECIAL_CONDITION, SPECIAL_INTR from deposit_special`;
let savingsSpecialQuery = `select SAVINGS_NO, SPECIAL_CONDITION, SPECIAL_INTR from savings_special`;

/**
 * passParam
 * product - 예금/적금
 * period - 기간 (옵션테이블)
 * 조건 내 최고 우대금리를 가진 상품을 보여줌
 *
 * db에서 필요한 정보 조회 리턴
 **/
router.post('/getResult', (req, res) => {
    let passParam = req.body.passParam;
    let dbParams = [passParam['period']];
    let statement = passParam.product === 'deposit_info' ? depositQuery : savingsQuery;

    oracledb.query(statement, dbParams).then(function (dbResult) {
        let commodities = oracledb.transformToAssociated(dbResult);
        res.json(commodities);
    });
});

router.post('/getSpecialOption', (req, res) => {
    let passParam = req.body.passParam;
    let statement = passParam.product === 'deposit_info' ? depositSpecialQuery : savingsSpecialQuery;

    oracledb.query(statement, []).then(function (dbResult) {
        let options = oracledb.transformToAssociated(dbResult);
        res.json(options);
    });

});

export default router;