// const express = require('express');
// const router = express.Router();
const { authJwt } = require("../middlewares");
const multer = require('../middlewares/multer-config');
const productController = require('../controllers/product.controller');


module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });


app.get('/api/product/getAllProducts', productController.getAllProducts);
app.get('/api/product/getProductsByUserId', [authJwt.verifyToken], productController.getProductsByUserId);
app.post('/api/product/createProduct', [authJwt.verifyToken], multer, productController.createProduct);
app.put('/api/product/modifyProduct/:id', [authJwt.verifyToken], multer, productController.modifyProduct);
app.get('/api/product/getOneProduct/:id', [authJwt.verifyToken], productController.getOneProduct);
app.delete('/api/product/deleteProduct/:id', [authJwt.verifyToken], productController.deleteProduct);

}
