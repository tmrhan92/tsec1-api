const mongoose = require('mongoose');

// الاتصال بـ MongoDB
mongoose.connect('mongodb://localhost:27017/productsdb')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));


// تعريف الـ Schema للمنتجات غير الممسوحة
const unscannedProductSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // تعديل هنا ليقبل UUID
  productName: { type: String, required: true },
  productPosition: { type: String, required: true },
  qr: { type: String },  // هذا الحقل اختياري
  isScanned: { type: Boolean, default: false },  // تحديد حالة المسح

});

// إنشاء النموذج
const UnscannedProduct = mongoose.model('UnscannedProduct', unscannedProductSchema);
module.exports = UnscannedProduct;
