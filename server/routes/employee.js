/**
 * Created by imgyucheol on 2017. 9. 1..
 */
import express from 'express';
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');

router.get('/:empcode', (req, res) => {

    let statement = "SELECT id, name, email, phone, sns, fax, dept_no, region_no, position " +
                    "FROM EMPLOYEE " +
                    "WHERE code = :empcode";
    let param = [req.params.empcode];
    oracledb.query(statement, param).then(function (dbResult) {
        let employee = oracledb.transformToAssociated(dbResult);
        res.json(employee[0]);
    });
});

export default router;