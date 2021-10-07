const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../helpers/getSheetId')
const { getSheetUserId } = require('../../helpers/getSheetUserId')
const { client_email, private_key } = require('../../config/cred')
const moment = require('moment-timezone')
exports.patchOrderById = async (req, res, next) => {
    try {
        const date = req.query.date
        const shop = "catchy_kr"
        const data = req.body
        const id = req.params.id
        console.log(moment().tz("Asia/Bangkok").toString(), ` - patchOrderById ${date},${shop} ,${id}`)
        const sheetId = getSheetsId(shop)
        const doc = new GoogleSpreadsheet(sheetId);
        await doc.useServiceAccountAuth({
            client_email: client_email,
            private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle[date];
        const rows = await sheet.getRows();
        rows[id]['@Twitter'] = data.twitter,
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
        rows[id]['ชื่อ'] = data.name
        rows[id]['เบอร์โทรศัพท์'] = data.telno
        rows[id]['ยอดมัดจำที่เหลือ'] = data.total2
        await rows[id].save();
        await patchOrderById(date, shop, data, id)
        res.status(200).json({ success: true, method: 'patch orders ' + req.params.id });
    } catch (err) {
        res.status(500).json({ success: false, code: err.response ? err.response.status : 405 });
    }
}


const patchOrderById = async (date, shop, data, id) => {
    try {
        const sheetId = getSheetUserId(shop)
        const doc = new GoogleSpreadsheet(sheetId);
        await doc.useServiceAccountAuth({
            client_email: client_email,
            private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle[date];
        const rows = await sheet.getRows();
        rows[id]['Tracking no.'] = data.tracking_no,
            rows[id]['สถานะการจ่ายเงิน'] = data.payment_status,
            rows[id]['รายการ'] = data.product_name,
            rows[id]['จำนวน'] = data.amount,
            rows[id]['การจัดส่ง'] = data.shipping_method,
            rows[id]['สถานะสินค้า'] = data.product_status
        await rows[id].save();
    } catch (err) {
        console.log(err)
    }
}
