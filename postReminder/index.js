const fetch = require('node-fetch');
const moment = require('moment-timezone');

moment.tz.setDefault("Asia/Tokyo");

const periods = [
    [moment("2021-06-29"), moment("2021-07-09"), `第0回イベント`], // TODO: テスト終わったら消す
    [moment("2022-06-29"), moment("2022-07-09"), `第2回イベント`],
    [moment("2023-06-29"), moment("2023-07-09"), `第9回イベント`], // TODO: テスト終わったら消す
];

module.exports = async function (context, req) {
    // Check period
    const now = moment();
    const period = periods.find(p => (now.isBetween(p[0], p[1])));
    if (period === undefined) {
        // 期間外
        context.log(`期間外`);
        return;
    }

    const endpoint = process.env["TYPETALK_ENDPOINT"]
    const token = process.env["TYPETALK_TOKEN"]

    const request = {message: `${period[2]}：今日の体調・行動記録は送りましたか？
送ったら♡を押そう
https://forms.gle/7m6kmN7381VeVmpk6`};

    const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json',
            'X-Typetalk-Token': token
        }
    });
    const body = await response.json();

    context.log(`res: ${JSON.stringify(body)}`);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify(body)
    };
}