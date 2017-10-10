/**
 * Created by imgyucheol on 2017. 9. 11..
 */

let depositImages = [
    'https://www.kebhana.com/kebhana/images/contents/together_mobile01.jpg'
];

let savingImages = [
    'https://www.kebhana.com/kebhana/images/contents/together_mobile02.jpg'
];

let cardImages = [
    'https://m.hanacard.co.kr/ATTACH/ban_evt/evt_top_bn_3175.png'
];

let commoditiesCategoryTitle = ['예금', '적금'];
let commoditiesCategoryName = ['deposit_info', 'savings_info'];
let commoditiesCategoryOption = ['deposit_options', 'savings_options'];

let bankCodes = ['', '0010020', '0014674', '0010019', '0010022',
    '0010024', '0010927', '0010017', '0010006', '0010026', '0011625',
    '0010016', '0010030', '0014807', '0015130', '0013175', '0010001', '0010002', '0013909'];

let bankNames = ['전체', '제주은행', '케이뱅크은행', '광주은행', '전북은행',
    '경남은행', '국민은행', '부산은행', '한국씨티은행', '중소기업은행', '신한은행',
    '대구은행', '한국산업은행', '수협은행', '한국카카오은행', '농협은행', '우리은행', '한국스탠다드차타드은행', 'KEB하나은행'];

let bankMainColor = ['', '#0087CF', '#EE5B6E', '#013174', '#013174', '#D81921', '#FDCD04', '#D81921', '#020065', '#0099DC', '#0087CF',
    '#0A3D8E', '#0D488A', '#0171BB', '#FFE100', '#1FB25A', '#0083CB', '#0071AB', '#008485'];

let bankPointColor = ['', '#EBCD8E', '#000000', '#E70012', '#0C9AD8', '#665C50', '#FDCD04', '#665C50', '#FE0007', '#115A9E', '#EBCD8E',
    '#41A136', '#A2CDED', '#FFFFFF', '#000000', '#0157BA', '#FFFFFF', '#2AAC4A', '#CB2242'];


function getOption(category) {
    if (category === 'deposit_info') {
        return 'deposit_options';
    } else if (category === 'savings_info') {
        return 'savings_options';
    } else {
        return null;
    }
}

function dateDescSort(a, b) {
    if (a["REG_DATE"] === b["REG_DATE"]) {
        return 0
    }
    return a["REG_DATE"] < b["REG_DATE"] ? 1 : -1;
}

function dateAscSort(a, b) {
    if (a["REG_DATE"] === b["REG_DATE"]) {
        return 0
    }
    return a["REG_DATE"] > b["REG_DATE"] ? 1 : -1;
}

function minRateSort(a, b) {
    if (a["INTR_RATE"] === b["INTR_RATE"]) {
        return 0
    }
    return a["INTR_RATE"] > b["INTR_RATE"] ? -1 : 1;
}

function maxRateSort(a, b) {
    if (a["INTR_RATE2"] === b["INTR_RATE2"]) {
        return 0
    }
    return a["INTR_RATE2"] > b["INTR_RATE2"] ? -1 : 1;
}

function moneyWithComma(money) {
    money = money + "";
    return money.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getRoundThirdDecimalPlace(value) {
    if (value !== undefined) {
        return value.toFixed(2) + "";
    }
    return "";
}

module.exports = {
    deposit_info: depositImages,
    savings_info: savingImages,
    cards_info: cardImages,
    getOptionName: getOption,
    commoditiesCategoryTitle: commoditiesCategoryTitle,
    commoditiesCategoryName: commoditiesCategoryName,
    commoditiesCategoryOption: commoditiesCategoryOption,
    bankNames: bankNames,
    bankCodes: bankCodes,
    bankMainColor: bankMainColor,
    bankPointColor: bankPointColor,
    dateDescSort: dateDescSort,
    dateAscSort: dateAscSort,
    minRateSort: minRateSort,
    maxRateSort: maxRateSort,
    moneyWithComma: moneyWithComma,
    getRoundThirdDecimalPlace: getRoundThirdDecimalPlace
};

// 은행코드  / 은행명
// 0010020	제주은행
// 0014674	케이뱅크은행
// 0010019	광주은행
// 0010022	전북은행
// 0010024	경남은행
// 0010927	국민은행
// 0010017	부산은행
// 0010006	한국씨티은행
// 0010026	중소기업은행
// 0011625	신한은행
// 0010016	대구은행
// 0010030	한국산업은행
// 0014807	수협은행
// 0015130	한국카카오은행
//