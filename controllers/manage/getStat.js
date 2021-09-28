const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../helpers/getSheetId')
const { client_email, private_key } = require('../../config/cred')
const moment = require('moment-timezone')

exports.getStat = async (req, res, next) => {
    const shop = "catchy_kr"
    const date = "9_2021"
    console.log(moment().tz("Asia/Bangkok").toString(), ` - getOrders ${date},${shop}`)
    const sheetId = getSheetsId(shop)
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
        client_email: client_email,
        private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[date];
    const rows = await sheet.getRows();
    let headerSummary = {
        total2: 0,
        shipping_price: 0,
        count: 1,
        product_pay: 0
    }

    let shippingMethodStat = [
        {
            type: 'EMS',
            count: 0,
        },
        {
            type: 'ลทบ.',
            count: 0,
        },
        {
            type: 'นัดรับ',
            count: 0,
        },
        {
            type: 'ยังไม่แจ้ง',
            count: 0,
        },
    ];

    let paymentMethodStat = [
        {
            type: 'จ่ายเต็ม',
            count: 0,
        },
        {
            type: 'มัดจำ',
            count: 0,
        },
        {
            type: 'ยังไม่จ่าย',
            count: 0,
        }
    ]
    const allRows = rows.length
    headerSummary.count = allRows
    const countAccount = {}
    const countProduct = {}
    const payMonth = {}
    const total2Month = {}
    for (let i = 0; i < rows.length; i++) {
        // top summary
        headerSummary.total2 += parseFloat(rows[i]['ยอดมัดจำที่เหลือ'] || 0) || 0;
        headerSummary.shipping_price += parseFloat(rows[i]['ค่าส่งที่เก็บ'] || 0) || 0;
        headerSummary.product_pay += parseFloat(rows[i]['ยอดที่โอน'] || 0) || 0;
        // shippingMethodStat
        shippingMethodStat[getShippingMethodIndex(rows[i]['การจัดส่ง'])].count += 1

        paymentMethodStat[getPaymentMethodIndex(rows[i]['สถานะการจ่ายเงิน'])].count += 1
        countAccount[rows[i]['@Twitter']] = (countAccount[rows[i]['@Twitter']] || 0) + (parseFloat(rows[i]['ยอดที่โอน'] || 0))
        countProduct[rows[i]['รายการ']] = (countProduct[rows[i]['รายการ']] || 0) + 1
        payMonth[rows[i]['order_id'].substring(1, 3)] = (payMonth[rows[i]['order_id'].substring(1, 3)] || 0) + (parseFloat(rows[i]['ยอดที่โอน'] || 0))
        total2Month[rows[i]['order_id'].substring(1, 3)] = (total2Month[rows[i]['order_id'].substring(1, 3)] || 0) + (parseFloat(rows[i]['ยอดมัดจำที่เหลือ'] || 0))
    }
    const countTopAccount = getTopAccount(countAccount)
    const countTopProduct = getTopProduct(countProduct)
    const monthPay = formatMonthData(payMonth)
    const monthTotal2 = formatMonthData(total2Month)

    res.status(200).json({
        success: true, data: {
            headerSummary, shippingMethodStat,
            paymentMethodStat,
            countTopAccount: countTopAccount,
            countTopProduct: countTopProduct,
            monthPay: monthPay,
            monthTotal2: monthTotal2
        }
    });
}

const getShippingMethodIndex = (method) => {
    if (method === "EMS") {
        return 0
    } else if (method === "ลทบ.") {
        return 1
    } else if (method === "นัดรับ") {
        return 2
    } else if (method === "ยังไม่แจ้ง") {
        return 3
    }
}

const getPaymentMethodIndex = (method) => {
    if (method === "จ่ายเต็ม") {
        return 0
    } else if (method === "มัดจำ") {
        return 1
    } else if (method === "ยังไม่จ่าย") {
        return 2
    }
}

const getTopAccount = (countAccount) => {
    var sortablecountAccount = [];
    for (var item in countAccount) {
        sortablecountAccount.push([item, countAccount[item]]);
    }

    sortablecountAccount.sort(function (a, b) {
        return b[1] - a[1];
    })
    let sliceArr = sortablecountAccount.splice(0, 5);
    let data = [];
    for (let i = 0; i < sliceArr.length; i++) {
        data.push({ Account: sliceArr[i][0], count: sliceArr[i][1] })
    }
    return data
}

const getTopProduct = (countProduct) => {
    var sortablecountAccount = [];
    for (var item in countProduct) {
        sortablecountAccount.push([item, countProduct[item]]);
    }

    sortablecountAccount.sort(function (a, b) {
        return b[1] - a[1];
    })
    let sliceArr = sortablecountAccount.splice(0, 5);
    let data = [];
    for (let i = 0; i < sliceArr.length; i++) {
        data.push({ Product: sliceArr[i][0], count: sliceArr[i][1] })
    }
    return data
}

const formatMonthData = (month) => {
    var monthFormat = [];
    for (var item in month) {
        monthFormat.push({ month: item, total: month[item] });
    }
    monthFormat.sort(function (a, b) {
        return a["month"] - b["month"];
    })
    return monthFormat
}