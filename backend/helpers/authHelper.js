const Admin = require('../model/adminModel')
const  User = require('../model/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Mongoose, default: mongoose } = require('mongoose')


const findAdmin = async (email) =>{
    
     const res = await  Admin.findOne({email})

     return res;
}

const saveAdmin = async ({email, userName, password}) => {
    if(!email || !password || !userName)
    {
        return false
    }
    return adminData = new Admin({
        userName,
        password,
        email: email.toLowerCase(),
        active: true
    }).save()   
}

const checkUser = async (email, password) => {
    const data =  await User.find({email})
    const hashedPassword = data[0].password
    
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
          if (err) {
            reject(err);
          }
          if (isMatch) {
            resolve({
                _id: data[0]._id,
                userName: data[0].userName,
                mobile: data[0].mobile,
                email: data[0].email
              });
          } else {
            resolve(false);
          }
        });
      });

}




const fileUpload = async (id, image) => {
    if(!id || !image){
        return false
    }else{
        return await User.updateOne(
            { _id : new mongoose.Types.ObjectId(id) }, 
            {
                $set : {
                    image : 'http://localhost:3000/images/uploads/'+image
                }
            }    
        )
    }
}

const generateToken = async (secret, id) => {
    if(!secret || !id){
        return false
    }else{
        const data = {
            time: new Date(), 
            id
        }
        return jwt.sign(data, secret)   //return token
    }
    
}

const encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash)=>{
            if(err){
                reject(err)
            }else{
                resolve(hash)
            }
        })
    })
}


module.exports = {
    findAdmin,
    saveAdmin,
    checkUser,
    generateToken,
    encryptPassword,
    fileUpload
}