const nodemailer = require('nodemailer');

exports.sendMail = (req, res, next)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject: req.body.objet,
        text: req.body.demande,
        html: "<b>Adresse mail de l'expéditeur : " + req.body.email + "</b><b>| Identité de l'expéditeur : " + req.body.name + "  " + req.body.lastname + "</b><br>" + req.body.demande + "", // html body
    };
    transporter.sendMail(mailOptions, (err,infos)=>{
        if(err){
            console.log(err);
            res.render('contact',{
            title: "contact Page",
            error: "Désolé votre message n'a pas pu être envoyé, veuillez réessayer plus tard"});
            next();
        }else{
            console.log(infos);
            res.render('contact',{
                title: "contact Page",
                 success: "Votre message a bien été envoyé. Nous vous répondrons rapidemment."});
                 next();
        }
    })
};