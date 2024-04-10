require('dotenv').config();
const express = require('express');
const clientRoute = express.Router();
const User = require('../model/userModel')
const authHelper = require('../helpers/authHelper')
const authMiddleware = require('../middleware/authMiddleware')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'views/uploads/'); // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name for the uploaded file
    },
  });

const upload = multer({ storage: storage });
 
const clientHelper = require('../helpers/clientHelper')

clientRoute.post('/api/upload',  upload.single('file'), async (req, res) => {

    if (!req.file) {
      return res.status(401).send({
        success: false
      });
    } else {
        const image = req.file.originalname
        const result = await authHelper.fileUpload(req.body.id, image)
        if(result){
            return res.status(200).json({
                success: true,
                image : 'http://localhost:3000/images/uploads/'+image
            })
        }else{
            return res.status(500).json({
                success: false
            });  
        }
    }
});

clientRoute.get('/profile', authMiddleware.authenticate, async (req, res)=>{
    console.log("the user is", req.user)
    await User.find().then((val)=>{
        res.send(val)
    })
})

clientRoute.post('/upload_Profile', authMiddleware.authenticate,  async(req, res) =>{
    console.log(req.body)
})

clientRoute.post('/register_user', async (req, res)=>{
    try{
        const {userName, email, mobile, password} = req.body
        if(!userName || !email || !mobile || !password){
            //401 unauthorized user
            return res.status(401).json({status: 'error', message : 'Password Does not match'})
        }
        const findUser = await clientHelper.checkUser(email)
        if(!findUser)
        {
            const hash = await authHelper.encryptPassword(password)
            const userData = new User({
                userName,
                mobile,
                email,
                password : hash
            });
            await userData.save()
            //200 ok success
            reuturnData = {
                email : userData.email,
                mobile : userData.mobile,
                userName : userData.userName,
                _id : userData._id
            }
            
            res.status(200).json(reuturnData)
        }else{
            // 409 Conflict user already exists.
            res.status(409).json({status: 'error', message : 'User already exist'})
        }
    } 
    catch(error)
    {
        // 500 internal server error.
        res.status(500).json({status: 'error', message : error.message})
    }
})

clientRoute.post('/login_auth', async (req, res)=>{
    try {
        const {email, password} = req.body
        // console.log(email, password)
        if(!email || !password){
            throw new Error('insufficient data')
        }

        // console.log('response')
        const response = await authHelper.checkUser(email, password)
        if(response){
            let jwtSecretKey = process.env.JWT_SECRET_KEY;

            const token = await authHelper.generateToken(jwtSecretKey, response._id)
            if(!token){
                throw new Error('token is not found')
            }
            res.status(200).json({status : 'success', response, token})
        }else{
            throw new Error('invalid credentials')
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({status: 'error', message : error.message})
    }   
})


module.exports = clientRoute