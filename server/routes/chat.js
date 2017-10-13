/**
 * Created by imgyucheol on 2017. 10. 10..
 */
import express from 'express';
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');

router.post('/recommend', (req, res) => {
    let data = req.body.data;
    let type = data.type.value;
    let joinWay = data.join_way.value;
    let saveTrm = data.period.value;
    let params = [type, saveTrm];

    let depositStatement = `select info.no, kor_co_nm, fin_prdt_nm, spcl_cnd, intr_rate, intr_rate2, opt.intr_rate_type
                    from
                        (select product_no as no, count(*), type
                        from consult_product
                        group by product_no,type
                        having type= :type
                        order by 2 desc) aa 
                    join deposit_info info on aa.no = info.no join deposit_options opt on info.fin_co_no=opt.fin_co_no and info.fin_prdt_cd = opt.fin_prdt_cd and info.dcls_month = opt.dcls_month
                    where save_trm= :saveTrm and join_way like '%${joinWay}%' and rownum<=5`;
    let savingsStatement = `select info.no, kor_co_nm, fin_prdt_nm, spcl_cnd, intr_rate, intr_rate2, opt.intr_rate_type,rsrv_type,rsrv_type_nm
                    from
                        (select product_no as no, count(*), type
                        from consult_product
                        group by product_no,type
                        having type= :type
                        order by 2 desc) aa 
                    join savings_info info on aa.no = info.no join savings_options opt on info.fin_co_no=opt.fin_co_no and info.fin_prdt_cd = opt.fin_prdt_cd and info.dcls_month = opt.dcls_month
                    where save_trm= :saveTrm and join_way like '%${joinWay}%' and rownum<=5`;

    let statement = type === "1" ? depositStatement : savingsStatement;

    oracledb.query(statement, params).then(function (dbResult) {
        let result = oracledb.transformToAssociated(dbResult);
        res.json(result);
    });
});

export default router;