const common = require("../common/common");
const api = require("../common/apikey");
let dataset;

const postResult = ((req, res) => {
    try {
        console.log(req.body);
        dataset = req.body
        res.render('result', {data: dataset, kakaoApiKey: api.config.apikey});
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});
const getResult = ((req, res) => {
    try {
        res.json({
            locName: common.reqeustFilter(JSON.parse(dataset.locName), -1, true),
            keyword: common.reqeustFilter(dataset.keyword, -1, true),
            locations: common.reqeustFilter(dataset.locations, -1, true)
        });
        
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

module.exports = {
    postResult,
    getResult
};
