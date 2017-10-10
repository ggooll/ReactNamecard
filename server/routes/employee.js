/**
 * Created by imgyucheol on 2017. 9. 1..
 */
import express from 'express';
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');

router.get('/:empcode', (req, res) => {

    let statement = `SELECT id, EMPLOYEE.name, email, phone, sns, fax, department.name dept_name, dept_no, region.name region_name, region_no, position
                        FROM EMPLOYEE, department, region
                        WHERE employee.code = :empcode and employee.dept_no = department.no and employee.region_no = region.no`;

    let param = [req.params.empcode];
    oracledb.query(statement, param).then(function (dbResult) {
        let employee = oracledb.transformToAssociated(dbResult);
        res.json(employee[0]);
    });
});

export default router;