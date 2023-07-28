const passwordValidator = require ("password-validator");

const passwordSchema = new passwordValidator();

//schema mot de passe respecter

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123', 'azerty','1234']);// Blacklist these values



module.exports = (req, res, next) => {
    console.log("je suis dans le middleware");
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        res.status(400).json({error: "utilisateur déjà existant ou votre mot de passe est incorrect(minimum 8 et maximum 100 caractères, une majuscule et une minuscule) "});
    } 
}