const User = require('../model/userModel')
const mongoose = require('mongoose')

const getUsers = async () =>{
    return await User.find({}, {password : 0})
}

const deleteUsers = async (id) => {
    id = new mongoose.Types.ObjectId(id)
    return await User.deleteOne({_id : id})
}

const editUsers = async (id) => { 
    id = new mongoose.Types.ObjectId(id)
    return await User.find({_id : id})
} 

const updateUsers = async (id, {userName, mobile, email}) => {
    if(!id || !userName || !mobile || !email){
        return false
    }
    id = new mongoose.Types.ObjectId(id)
    return await User.updateOne(
        {_id : id}, 
        {
            $set : {
                userName, mobile, email
            }
        }
    )
}

const checkUser = async (email) => {
    try {
        const data = await User.find({email})
        if(data.length > 0){
            return true
        }else{
            return false
        }
    } catch (error) {
        return error
    }
}



module.exports = {
    getUsers,
    deleteUsers,
    editUsers,
    updateUsers,
    checkUser
}