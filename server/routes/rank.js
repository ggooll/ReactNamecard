/**
 * Created by imgyucheol on 2017. 10. 18..
 */
import express from 'express';
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');

router.post('/bestDeposit', (req, res) => {
    let statement = `SELECT * FROM 
                        (SELECT
                            di.no,
                                di.FIN_CO_NO,
                                di.KOR_CO_NM,
                                di.FIN_PRDT_NM,
                                di.INTR_RATE_TYPE,
                                JOIN_WAY,
                                MAX_LIMIT,
                                MTRT_INT,
                                (select 1 from dual) VISIBLE,
                                JOIN_MEMBER,
                                nvl((select count(product_no) from consult_product where type = 1 and product_no = di.NO group by(product_no)), 0) product_count,
                                nvl((select count(deposit_no) from deposit_log where deposit_no = di.NO group by(deposit_no)), 0) deposit_count,
                                do.intr_rate, 
                                do.intr_rate2,
                                ROWNUM
                            FROM deposit_info di, deposit_options do
                            where di.fin_co_no = do.fin_co_no and
                                di.fin_prdt_cd = do.fin_prdt_cd and
                                di.dcls_month = do.dcls_month and
                                do.save_trm = 12
                            order by (product_count*2) + deposit_count desc)
                        WHERE ROWNUM < 6`;

    oracledb.query(statement, []).then(function (dbResult) {
        let bestDeposits = oracledb.transformToAssociated(dbResult);
        res.json(bestDeposits);
    });
});

router.post('/bestSavings', (req, res) => {
    let statement = `SELECT * FROM
                        (SELECT
                            si.NO,
                            si.FIN_CO_NO,
                            si.KOR_CO_NM,
                            si.FIN_PRDT_NM,
                            si.INTR_RATE_TYPE,
                            JOIN_WAY,
                            MAX_LIMIT,
                            MTRT_INT,
                            (select 1 from dual) VISIBLE,
                            JOIN_MEMBER,
                            nvl((select count(product_no) from consult_product where type = 2 and product_no = si.NO group by(product_no)), 0) product_count,
                            nvl((select count(savings_no) from savings_log where savings_no = si.NO group by(savings_no)), 0) savings_count,
                            so.intr_rate,
                            so.intr_rate2, 
                            so.rsrv_type,
                            ROWNUM
                        FROM savings_info si, savings_options so
                        WHERE si.fin_co_no = si.fin_co_no and
                            si.fin_prdt_cd = so.fin_prdt_cd and
                            si.dcls_month = so.dcls_month and
                            so.save_trm = 12
                        order by (product_count*2) + savings_count desc)
                        WHERE ROWNUM < 6`;

    oracledb.query(statement, []).then(function (dbResult) {
        let bestSavings = oracledb.transformToAssociated(dbResult);
        res.json(bestSavings);
    });
});

export default router;