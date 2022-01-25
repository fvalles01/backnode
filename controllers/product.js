const Product = require('../models/Product');
const fs = require('fs');

exports.createProduct = (req, res, next) => {
    const productObject = req.body;
    delete productObject._id;
    const product = new Product({
        ...productObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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
exports.getProductByUser = (req, res, next) => {
    Product.find({ _id: req.params.id })
    .then(product => res.status(200).json(product))
    .catch(error => res.status(400).json({error}));
};


exports.modifyProduct = (req, res, next) => {

    const id = req.params.id;

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
        return res.status(200).json({
            status: 200,
            message: 'Product Updated !'
        })
    })



    // const productObject = req.file ?
    //     { 
    //         ...req.body,
    //         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    //     } : { ...req.body};
    // Product.updateOne({ _id: req.params.id}, {...productObject, _id: req.params.id })
    // .then(() => res.status(200).json({message: 'Objet modifié !'}))
    // .catch(error => res.status(400).json({error}));
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
    
    
    //     Thing.findOne({ _id: req.params.id}).then(
    //     (thing) => {
    //         if(!thing) {
    //             return res.status(404).json({
    //                 error: new Error('Objet non trouvé !')
    //         });
    //         }
    //         if (thing.userId !== req.auth.userId){
    //             return res.status(401).json({
    //                 error: new Error ('Requete non autorisé')
    //             });
    //         }
            
    //         Thing.deleteOne({ _id: req.params.id})
    //         .then(() => res.status(200).json({message: 'Objet supprimé !'}))
    //         .catch(error => res.status(400).json({error}));
    //     }
    // )

};

