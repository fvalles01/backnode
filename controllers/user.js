const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // crypter le mot de passe
        .then(hash => {
            const user = new User({ // crée un nouveau user avec le mot de passe crypté
                email: req.body.email, // et l'email passé dans le corp de la requete
                password: hash
            });
            user.save() // enregister ce user dans la base de donnée
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}))
        
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email}) // récupere le user de la base qui correspond à l'email entré
        .then(user => {
            if(!user){
                return res.status(401).json({message: 'Utilisateur non trouvé ! '});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({message: 'Mot de passe incorrect ! '});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET,
                            { expiresIn: '24h' }
                            )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

        //console.log(req.body);
};