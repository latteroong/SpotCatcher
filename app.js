const express = require('express');
const nunjucks = require('nunjucks');
const cors = require('cors');

const app = express();
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

const corsOptions = {
    origin: 'https://eternal-unique-opossum.ngrok-free.app', // 허용할 도메인
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 HTTP 메소드
    credentials: true, // 쿠키 허용 여부
};
  
app.use(cors(corsOptions));
app.use('/assets', express.static(__dirname + "/assets"));  // 어셋 정의해 줌
// 정적파일이라고 알려 줌
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

indexRouter = require('./router/main'); // js생략
resultRouter = require('./router/result');

app.use('/', indexRouter);
app.use('/result', resultRouter);

// use가 모든걸 먹음
app.use((req, res) => {
    console.log("잘못된 접근");
    res.status(404).send('<H1>404</H1> Not Found');
})

app.listen(80, () => {
    console.log("80포트에서 express서버 대기중 ...");
})

