const xss = require('xss');

const reqeustFilter = (data, type, isHtml, defaultvalue = null) => {
    switch (type) {
        case 0:     // 숫자만
            let checkVal = data.replaceAll(',', '');
            if(!isNumber(checkVal)) {
                throw "parameter is not number Error";  // 컨트롤러에 
            }
            break;
        case -1:    // 길이무제한
            if(!isHtml) {
                data = xss(data);   // html로 필터링
            }
            break;
        default:    // 길이 제한(1~~)
            if(type < data.length) {
                throw "input length is too long";
            }

            if(!isHtml) {
                data = xss(data);   // html로 필터링
            }
            break;
    }

    if(data == null || data == '') {
        if(defaultvalue != null) {
            data = defaultvalue;
        } else {
            throw "input parameter not allow null";
        }
    }

    return data;
}

module.exports = {
    reqeustFilter
};