/**
 * Created by imgyucheol on 2017. 9. 6..
 */
import express from 'express';
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');

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

export default router;

//
// let commodityObj = {
//     no: 1,
//     dcls_month: '2017-09-12 08:42:10',                                    //  공시 제출월 [YYYYMM]
//     fin_co_no: 1,                                                         //  금융회사 코드
//     kor_co_nm: '하나은행',                                             //  금융회사명
//     fin_prdt_cd: '3355443',                                         //  금융상품 코드
//     fin_prdt_nm: '정기예금테스트',                                         //  금융 상품명
//     join_way: '나를 통해서',                                                //  가입 방법
//     mtrt_int: '100%',                                              //  만기 후 이자율
//     spcl_cnd: '돈 많으면',                                               //  우대조건
//     join_deny: 1,                                                         //  가입제한 Ex) 1:제한없음, 2:서민전용, 3:일부제한
//     join_member: '50대 이하',                                         //  가입대상
//     etc_note: '유의사항 없음',                                               //  기타 유의사항
//     max_limit: 1,                                                         //  최고한도
//     dcls_strt_day: '2017-09-12 08:42:10',                                 //  공시 시작일
//     dcls_end_day: '2017-09-12 08:42:10',                                  //  공시 종료일
//     fin_co_subm_day: '2017-09-12 08:42:10',                               //  금융회사 제출일 [YYYYMMDDHH24MI]
//     intr_rate_type: '복리',                                                  //  저축 금리 유형(s:단리 m:복리)
//     intr_rate_type_nm: 'intr_rate_type_nm 0',                             //  저축 금리 유형명
//     save_trm: 1,                                                          //  저축 기간 [단위: 개월]
//     intr_rate: 1,                                                         //  저축 금리 [소수점 2자리]
//     intr_rate2: 1,                                                        //  최고 우대금리 [소수점 2자리]
//     rsrv_type: 'N',                                                       //  적립 유형
//     rsrv_type_nm: 'rsrv_type_nm 0'                                       //  적립 유형명
// };

//
//
// /**
//  * 연령대별...
//  */
// router.post('/ageGroup', (req, res) => {
//     let searchParam = req.body.selectedItem;
//     console.log("overall search : " + searchParam);
//
//     let testItems = [
//         {searchParam: 'searchParam'}, {}, {}, {}, {}, {}, {}, {}, {}, {}
//     ];
//     // 고객 키
//     res.send(testItems);
// });