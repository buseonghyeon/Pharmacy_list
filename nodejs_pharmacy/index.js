let express = require("express");
let axios = require("axios");

let app = express();
let port = process.env.PORT || 80;

app.use(express.static("public_html"));
app.listen(port, function(){
    console.log("HTML 서버 시작됨");
});

app.get("/pharmach_list", (req, res) => {
    let api = async () => {
        let response = null;
        try {
            response = await axios.get("http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire", {
                params: {
                    "serviceKey": "YOUR_NEW_SERVICE_KEY",  // 올바른 서비스 키로 교체
                    "Q0": req.query.Q0,
                    "Q1": req.query.Q1,
                    "QT": req.query.QT,
                    "QN": req.query.QN,
                    "ORD": req.query.ORD,
                    "pageNo": req.query.pageNo,
                    "numOfRows": req.query.numOfRows
                }
            });
            console.log("API 응답 데이터:", response.data); // 전체 응답 로그
        } catch (e) {
            console.error("API 요청 에러:", e.message);
            if (e.response) {
                console.error("응답 데이터:", e.response.data);
                console.error("응답 상태:", e.response.status);
                console.error("응답 헤더:", e.response.headers);
            }
            return null;
        }
        return response;
    }

    api().then((response) => {
        res.setHeader("Access-Control-Allow-Origin", "*");

        if (response && response.data) {
            res.json(response.data);
        } else {
            res.status(500).json({ error: "API 응답 구조가 예상과 다릅니다." });
        }
    });
});
