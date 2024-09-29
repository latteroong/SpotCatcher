let dataset;

const postResult = ((req, res) => {
    try {
        console.log(req.body);
        dataset = req.body
        res.render('result', {data: dataset});
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});
const getResult = ((req, res) => {
    try {
        res.json({
            locName: JSON.parse(dataset.locName),
            keyword: dataset.keyword,
            locations: dataset.locations
        });
    } catch (error) {
        res.status(500).send("<H1>500</H1> Error" + error);
    }
});

module.exports = {
    postResult,
    getResult
};
