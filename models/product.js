const mongoose = require('mongoose');

// نموذج منتج
const productSchema = new mongoose.Schema({
    _id: { type: String, required: true },  // تعديل هنا ليقبل UUID
    productName: { type: String, required: true },
    productPosition: { type: String, required: true },
    qr: { type: String },  // هذا الحقل اختياري
    isScanned: { type: Boolean, default: false },  // تحديد حالة المسح
});

// إنشاء النموذج
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
