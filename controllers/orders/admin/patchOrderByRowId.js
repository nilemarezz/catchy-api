const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../../helpers/getSheetId')
const { client_email, private_key } = require('../../../config/cred')
exports.patchOrderById = async (req, res, next) => {
  try {
    const date = req.query.date
    const shop = req.query.shop
    const data = req.body
    const id = req.params.id
    const sheetId = getSheetsId(shop)
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
      client_email: client_email,
      private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[date];
    const rows = await sheet.getRows();
    console.log(data)
    rows[id]['Tracking no.'] = data.tracking_no,
      rows[id]['รายการ'] = data.product_name,
      rows[id]['จำนวน'] = data.amount,
      rows[id]['การจัดส่ง'] = data.shipping_method,
      rows[id]['ที่อยู่'] = data.address,
      rows[id]['ยอดที่โอน'] = data.pay_amount
    rows[id]['สถานะสินค้า'] = data.product_status
    rows[id]['สถานะการจ่ายเงิน'] = data.payment_status
    rows[id]['Note'] = data.note
    rows[id]['ต้นทุน'] = data.cost
    rows[id]['ราคาขาย'] = data.price
    rows[id]['ค่าส่งที่เก็บ'] = data.shipping_price,
      rows[id]['ค่าส่งจริง'] = data.shipping_price_real
    await rows[id].save();
    res.status(200).json({ success: true, method: 'patch orders ' + req.params.id });
  } catch (err) {
    res.status(500).json({ success: false, code: err.response ? err.response.status : 405 });
  }
}

