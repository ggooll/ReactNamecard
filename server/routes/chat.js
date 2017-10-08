import express from 'express';
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');


router.post('/recommend', (req, res) => {
    console.log('api/chat/recommend');
    let data = req.body.data;
    console.log(data);

    let type =  data.type.value;
    let joinWay = data.join_way.value;
    let saveTrm = data.period.value;

    let params = [type,saveTrm];
    let statement='';
    if(type == 1){
        statement = `select info.no, kor_co_nm, fin_prdt_nm, spcl_cnd, intr_rate, intr_rate2, opt.intr_rate_type
                    from
                        (select product_no as no, count(*), type
                        from consult_product
                        group by product_no,type
                        having type= :type
                        order by 2 desc) aa 
                    join deposit_info info on aa.no = info.no join deposit_options opt on info.fin_co_no=opt.fin_co_no and info.fin_prdt_cd = opt.fin_prdt_cd and info.dcls_month = opt.dcls_month
                    where save_trm= :saveTrm and join_way like '%${joinWay}%' and rownum<=5`;

        // if (selectedCode !== undefined && selectedCode !== "") {
        //     statement += ` WHERE FIN_CO_NO = :fin_co_no`;
        //     params.push(selectedCode);
        // }
        console.log("query");
        console.log(statement);
    }else{
        statement = `select info.no, kor_co_nm, fin_prdt_nm, spcl_cnd, intr_rate, intr_rate2, opt.intr_rate_type,rsrv_type,rsrv_type_nm
                    from
                        (select product_no as no, count(*), type
                        from consult_product
                        group by product_no,type
                        having type= :type
                        order by 2 desc) aa 
                    join savings_info info on aa.no = info.no join savings_options opt on info.fin_co_no=opt.fin_co_no and info.fin_prdt_cd = opt.fin_prdt_cd and info.dcls_month = opt.dcls_month
                    where save_trm= :saveTrm and join_way like '%${joinWay}%' and rownum<=5`;
        console.log("query");
        console.log(statement);
    }
    oracledb.query(statement, params).then(function (dbResult) {
        let result = oracledb.transformToAssociated(dbResult);
        console.log("======= "+result);
        res.json(result);
    });
});


/*
select info.no, kor_co_nm, fin_prdt_nm, spcl_cnd, intr_rate, intr_rate2
from
(select product_no as no, count(*), type
from consult_product
group by product_no,type
having type=1
order by 2 desc) aa join deposit_info info on aa.no = info.no join deposit_options opt on info.fin_co_no=opt.fin_co_no and info.fin_prdt_cd = opt.fin_prdt_cd and info.dcls_month = opt.dcls_month
where save_trm=12 and join_way like '%인터넷%' and rownum<=5;
 */
export default router;