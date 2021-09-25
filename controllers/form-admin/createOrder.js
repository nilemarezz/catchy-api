const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../helpers/getSheetId')
const { client_email, private_key } = require('../../config/cred')
const moment = require('moment-timezone')
exports.createOrder = async (req, res, next) => {
    console.log(req.body)
    const year = moment().year();
    let thisMonth = moment().month() + 1;
    const date = `${thisMonth}_${year}`
    const shop = "catchy_kr"
    const body = req.body
    const sheetId = getSheetsId(shop)
    const rowData = []
    body.product.map((item, i) => {
        rowData.push({
            "@Twitter": body.account,
            "order_id": body.orderId,
            "สถานะการจ่ายเงิน": body.paymentMethod,
            "รายการ": item.product_name,
            "จำนวน": item.product_amount,
            "การจัดส่ง": item.product_shipping_method,
            "สถานะสินค้า": "รอกด",
            "ยอดที่โอน": parseFloat(item.product_pay) + parseFloat(item.product_shipping_price),
            "ราคาขาย": item.product_price,
            "ค่าส่งที่เก็บ": item.product_shipping_price,
            "ยอดมัดจำที่เหลือ": item.product_price - item.product_pay
        })
    })
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
      client_email: client_email,
      private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[date];
    await sheet.addRows(rowData)
    res.status(200).json({ success: true, url: `https://catchy-form-v2.netlify.app/form/${body.orderId}?date=${date}&shop=${shop}` });
}