const api = require("../common/apikey");

const main = ((req, res) => {
    try {
        res.render('index', { kakaoApiKey: api.config.apikey});
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

module.exports = {
    main
};
