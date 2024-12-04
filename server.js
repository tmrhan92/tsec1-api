const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Product = require('./models/product'); 

function validateProductFields(req, res, next) {
    const { productName, productPosition } = req.body;
    if (!productName || !productPosition) {
        return res.status(400).json({ message: 'Both productName and productPosition are required' });
    }
    next();
}


// إعداد الخادم
const app = express();
const port = process.env.PORT || 3000;

// تمكين استخدام JSON
app.use(cors());
app.use(bodyParser.json()); // قراءة طلبات JSON

// الاتصال بـ MongoDB
mongoose.connect('mongodb://localhost:27017/productsdb', {
useNewUrlParser: true,
useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// إضافة منتج جديد
app.post('/api/products', validateProductFields, async (req, res) => {
    const { _id, productName, productPosition, qr } = req.body;

if (!productName || !productPosition) {
return res.status(400).json({ message: 'Both productName and productPosition are required' });
}

try {
const existingProduct = await Product.findOne({ productName, productPosition });
if (existingProduct) {
return res.status(409).json({ message: 'Product already exists with this productName and productPosition' });
}

const product = new Product({ _id, productName, productPosition, qr });
await product.save();
res.status(201).json(product);
} catch (err) {
console.error('Error adding product:', err);
res.status(500).json({ message: 'Error adding product', error: err.message });
}
});

// جلب جميع المنتجات
app.get('/api/products', async (req, res) => {
try {
const products = await Product.find();
res.status(200).json(products);
} catch (error) {
console.error('Error fetching products:', error);
res.status(500).json({ message: 'Error fetching products', error });
}
});

// تحديث حالة المسح للمنتج
app.patch('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { isScanned } = req.body;

    try {
        console.log('Updating Product ID:', id, 'with isScanned:', isScanned);

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },  // شرط البحث باستخدام الـ ID
            { isScanned }, // القيمة التي سيتم تحديثها
            { new: true }   // لإرجاع الوثيقة المحدّثة
        );
        
        if (!updatedProduct) {
            console.log('Product not found with ID:', id);
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Updated Product:', updatedProduct);
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Error updating product', error: err.message });
    }
});

// حذف منتج بواسطة ID
app.delete('/api/products/:id', async (req, res) => {
const { id } = req.params;

try {
const deletedProduct = await Product.findByIdAndDelete(id);
if (!deletedProduct) {
return res.status(404).json({ message: 'Product not found' });
}
res.status(200).json({ message: 'Product deleted successfully' });
} catch (err) {
console.error('Error deleting product:', err);
res.status(500).json({ message: 'Error deleting product', error: err.message });
}
});

// إعادة تعيين حالة جميع المنتجات
app.patch('/api/products/reset', async (req, res) => {
try {
const result = await Product.updateMany({}, { isScanned: false });
res.status(200).json({
message: 'All products reset to unscanned status',
updatedCount: result.modifiedCount,
});
} catch (error) {
console.error('Error resetting scan status:', error);
res.status(500).json({ message: 'Error resetting scan status', error: error.message });
}
});

// جلب جميع المنتجات غير الممسوحة
app.get('/api/unscanned-products', async (req, res) => {
try {
const products = await Product.find({ isScanned: false });
res.status(200).json(products);
} catch (error) {
console.error('Error fetching unscanned products:', error);
res.status(500).json({ message: 'Error fetching unscanned products', error });
}
});

// بدء التشغيل
const HOST = '192.168.43.181'; // تأكد من أن هذا هو IP الصحيح
app.listen(port, HOST, () => {
console.log(`Server running on http://${HOST}:${port}`);
});