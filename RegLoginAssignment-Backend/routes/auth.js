const router = require('express').Router();
const User = require('../model/User');
const validation = require('../validation');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

//registration
router.post('/register',async (req, res)=>{
    //validation of req data
    const {error} = validation.registerValidation(req);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    //checking if same data exists
    const existingData = await User.findOne({email : req.body.email});
    if(existingData){
        return res.status(400).send('User already exists');
    }
    //hashing the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    //create user
    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword,
    });
    //save user
    try {
        const savedUser = await user.save();
        res.send({userId : savedUser._id});
    } catch (err) {
        res.status(404).send(err);
    }
});


//login
router.post('/login',async (req, res) => {
    //validation of data
    const {error} = validation.loginValidation(req);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    //checking if user exists
    const existingUser = await User.findOne({email : req.body.email});
    if(!existingUser){
        return res.status(400).send('emailId do not exists');
    }
    
    const validPass = await bcryptjs.compare(req.body.password, existingUser.password);
    if(!validPass){
        return res.status(400).send('password is wrong');
    }

    //create and assign token   
    const token = jwt.sign({_id : existingUser._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    //res.send('Logged in!!')
})

module.exports = router;