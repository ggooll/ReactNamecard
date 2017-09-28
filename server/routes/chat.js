import express from 'express';
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');


router.get('/overall', (req, res) => {
    let searchTable = req.body.selectedItem;
    let selectedCode = req.body.selectedBankCode;
    let params = [];

    let statement = `SELECT 
                    NO,
                    FIN_CO_NO,
                    KOR_CO_NM,
                    FIN_PRDT_NM,
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

/*
select *
from (select * from deposit_info info join deposit_options opt on info.fin_co_no=opt.fin_co_no and info.fin_prdt_cd = opt.fin_prdt_cd and info.dcls_month = opt.dcls_month where save_trm=12 and join_way like '%인터넷%' order by intr_rate desc) a
where rownum <=3;
*/