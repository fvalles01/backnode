const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    designation: {type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: { type: String, required: true },
    publishedAt: {type: Date, required: true},
});

module.exports = mongoose.model('Product', productSchema);

