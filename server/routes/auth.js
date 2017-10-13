/**
 * Created by imgyucheol on 2017. 9. 5..
 */
import express from 'express';
import numberGenerator from '../util/numberGenerator';

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const router = express.Router();
const oracledb = require('oracledb-autoreconnect');

router.post('/existCustomer', (req, res) => {
    let phoneNum = req.body.phone;
    let params = [phoneNum];
    let statement = `SELECT NO,
                            NAME,
                            BIRTH_DATE,
                            PHONE,
                            EMPLOYEE_NO,
                            COMMENTS,
                            GRADE,
                            POST,
                            ADDRESS,
                            REG_DATE FROM CUSTOMER WHERE PHONE = :phone`;
    const session = req.session;

    oracledb.query(statement, params).then(function (dbResult) {
        let auth = oracledb.transformToAssociated(dbResult);
        if (auth.length > 0) {
            // session에 customer와, saltedNum 저장 후
            // 문자로 인증번호 보내고 saltedNum을 보냄
            session.authUser = auth[0];
            let randNum = numberGenerator.getRandomNumber();
            console.log('generate : ' + randNum);
            let saltedNum = bcrypt.hashSync(randNum, salt);
            res.json({
                saltedNum: saltedNum
            });
        } else {
            console.log('false!');
            res.send(false);
        }
    });
});

router.post('/authNumber', (req, res) => {
    let inputNum = req.body.inputNum;
    let refSaltedNum = req.body.refSaltedNumber;
    // 두 번호 검증
    let hashed = bcrypt.hashSync(inputNum, salt);

    if (hashed !== refSaltedNum) {
        res.send(false);
    } else {
        // 인증 성공
        const session = req.session;
        session.refSalt = refSaltedNum;
        res.cookie('user', req.session.authUser["NO"]);
        res.send(true);
    }
});

router.post('/isExistSession', (req, res) => {
    const session = req.session;
    // let sessSalt = session.refSalt;
    let authUser = session.authUser;

    // res.send(true);

    // if (authUser !== undefined && sessSalt !== undefined) {
    if (authUser !== undefined) {
        // 세션의 phone + bcrypt와 refSalt를 추가로 검사할 수 있다.
        res.send(true);
    } else {
        res.send(false);
    }
});

export default router;