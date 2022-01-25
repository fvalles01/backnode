const Product = require('../models/Product');
const jwt = require("jsonwebtoken");
// import {authHeader} from ('../../frontend/src/services/auth-header');
const User = require('../models/User');
const fs = require('fs');



exports.createProduct = (req, res, next) => {
    const productObject = req.body;
   
    // console.log(productObject)
    const product = new Product({
        ...productObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        publishedAt: Date.now()
    });
    product.save()
        .then( ()=> res.status(201).json({ message: 'Objet enregisté' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneProduct = (req, res, next) => {
    Product.findOne({ _id: req.params.id })
    .then(product => res.status(200).json(product))
    .catch(error => res.status(400).json({error}));
};

exports.getAllProducts = (req, res, next) => {
    Product.find()
    .then(products => res.status(200).json(products))
    .catch(error => res.status(400).json({error}));
};

/*Get Products by UserID */
exports.getProductsByUserId = (req, res, next) => {

    Product.find({userId: req.userId })
    .then(products => res.status(200).json(products))
    .catch(error => res.status(400).json({error}));
 
};


exports.modifyProduct = (req, res, next) => {

    const id = req.params.id;
    // Product.findOne({_id: id, userId: req.body.userId}, (err) =>{
    //     if(err){
    //         console.log(err)
    //         return res.redirect('/login')
    //     }else {
            let product = req.body;
            if(req.file){
                product.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                Product.findOne({_id: id}, {imageUrl: true}, (err, product) =>{
                    if(err){
                        console.log(err);
                        return;
                    }
                    const filename = product.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (err)=>{
                        if(err){
                            console.log(err.message);
                        }
                    });
                }) 
            }
        
            Product.updateOne({_id: id}, {...product, _id: id}, (err, data) =>{
                if(err){
                    return res.status(500).json({
                        status: 500,
                        message: 'Error when updating Product',
                        error: err
                    })
                }
                return res.status(201).json({
                    status: 201,
                    message: 'OK!'
                })  

            })
    //     }
    // })
   
};

exports.deleteProduct = (req, res, next) => {
    Product.findOne({ _id: req.params.id })
        .then(product => {
            const filename = product.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Product.deleteOne({ _id: req.params.id})
                .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({ error }));
    


};

