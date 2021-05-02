const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../../helpers/getSheetId')
const { client_email, private_key } = require('../../../config/cred')
exports.postOrder = async (req, res, next) => {
  try {
    const date = req.query.date
    const shop = req.query.shop
    const sheetId = getSheetsId(shop)
    const body = req.body
    const data = []
    body.product.map((item, i) => {
      data.push({
        "@Twitter": body.account,
        "order_id": body.orderId,
        "สถานะการจ่ายเงิน": body.paymentMethod,
        "รายการ": item.product_name,
        "จำนวน": item.product_amount,
        "การจัดส่ง": body.shippingMethod,
        "สถานะสินค้า": "รอกด",
        "ยอดที่โอน": item.product_pay,
        "ราคาขาย": item.product_price,
        "ค่าส่งที่เก็บ": i === 0 ? body.shippingCost : 0,
        "ค่าส่งจริง": i === 0 ? body.shippingCostReal : 0
      })
    })
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
      client_email: client_email,
      private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[date];
    await sheet.addRows(data)
    res.status(200).json({ success: true, url: `https://catchy-form-v2.netlify.app/form/${body.orderId}?date=${date}&shop=${shop}` });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, method: 'post orders  ' });
  }
}
