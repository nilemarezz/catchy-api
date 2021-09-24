const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../../helpers/getSheetId')
const { client_email, private_key } = require('../../../config/cred')
const moment = require('moment');

exports.getOrderByAccountKR = async (req, res, next) => {
    const account = req.params.account_id;
    const sheetId = getSheetsId("catchy_kr")
    const year = moment().year();
    const promises = []
    let thisMonth = moment().month() + 1;
    let beforeMonth = moment().subtract(3, 'months').month() + 1
    for (let i = thisMonth; i > beforeMonth; i--) {
        promises.push(getDataPromise(sheetId, `${i}_${year}`, account));
        // promises.push(getDataPromise(sheetId, `9_2021`, account));
    }
    Promise.all(promises).then(async (result) => {
        let data = [];
        result.map(item => {
            if (item === false) {
                data = [...data, false]
            } else {
                if (item.data.length != 0) {
                    data.push(item)
                }
            }
        })
        if (data.includes(false)) {
            res.status(502).json({ success: false, msg: "Max times call api , please try again in few minutes" });
        } else {
            res.status(200).json({ success: true, items: data });
        }
    })
        .catch(e => {
            console.log(e)
            res.status(500).json({ success: false, msg: "Someting went wrong , please contact admin" });
        })
}

const getDataPromise = (sheetId, date, account) => {
    return new Promise(async (resolve) => {
        try {
            const doc = new GoogleSpreadsheet(sheetId);
            await doc.useServiceAccountAuth({
                client_email: client_email,
                private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
            });
            await doc.loadInfo();
            const sheet = doc.sheetsByTitle[date];
            const rows = await sheet.getRows();
            const data = []
            for (let i = 0; i < rows.length; i++) {
                if (rows[i]["@Twitter"] === account) {
                    data.push({
                        "id": i,
                        "order_id": rows[i]["order_id"] || null,
                        "twitter": rows[i]["@Twitter"] || null,
                        "product_name": rows[i]['รายการ'] || null,
                        "amount": rows[i]['จำนวน'] || null,
                        "payment_status": rows[i]['สถานะการจ่ายเงิน'] || null,
                        "payment_method": rows[i]['การจัดส่ง'] || null,
                        "product_status": rows[i]['สถานะสินค้า'] || null,
                        "tracking_no": rows[i]['Tracking no.'] || null,
                        "date": date,
                        "success": true,
                    })
                }
            }
            resolve({date : date,data :data})
        } catch (err) {
            resolve(false)
        }
    })
}