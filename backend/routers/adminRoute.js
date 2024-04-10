require('dotenv').config();
const express = require('express')
const adminRoute = express.Router();
const authHelper = require('../helpers/authHelper')
const clientHelper = require('../helpers/clientHelper')
const authMiddleware = require('../middleware/authMiddleware')
const bcryptjs = require('bcryptjs')


adminRoute.get('/',(req, res)=>{
    res.send('admin')
})

adminRoute.post('/login_auth', async (req, res)=>{
    try {
       
        const {email, password} = req.body;
        // console.log(email,password);
        
        if(!email || !password){
            throw new Error('insufficient data')
        }
        const response = await authHelper.findAdmin(email);

        if(response){

            const validatePassword = bcryptjs.compare(password, response.password)

            if(!validatePassword){
                return res.status(401).json({status: "error", message : 'User is Unauthorised'})
            }
            
            let jwtSecretKey = process.env.JWT_SECRET_KEY_ADMIN;
            
            const token = await authHelper.generateToken(jwtSecretKey, response._id)
            if(!token){
                throw new Error('Token is not found')
            }
            // console.log("the response", response, token)
            res.status(200).json({status : 'success', response, token})


        }else{
            throw new Error("admin not found")
        }
        
    } 
    catch (error) 
    {
        console.log(error.message)
        res.status(500).json(error);
    }
})

adminRoute.post('/add-admin', async (req, res)=>{
    try {
        const status = await authHelper.saveAdmin(req.body) 
        if(!status){ 
            throw new Error('failed to add admin')
        }
        res.json({status: 'success', message: 'admin saved'})
    } 
    catch (error) {
        res.json({status: 'error', message: error.message});
    }
})

adminRoute.get('/get-users', async (req, res)=>{
    try {
        const clientData = await clientHelper.getUsers() 
        if(!clientData){ 
            throw new Error('failed to get the user data')
        }
        res.status(200).send(clientData)
    } 
    catch (error) {
        res.status(500).send(error.message);
    }
})

adminRoute.delete('/delete-user/:id', async (req, res)=>{
    try {
        let { id } = req.params
        console.log("id is", id)
        if(!id){
            throw new Error('id is not present')
        }
        const status = await clientHelper.deleteUsers(id) 
        if(!status){ 
            throw new Error('failed to delete the user data')
        }
        res.status(200).json({status: "success", message: "deleted successfully"})
    } 
    catch (error) {
        res.status(500).json(error.message);
    }
})

adminRoute.get('/edit-user/:id', async (req, res)=>{
    try {
        let { id } = req.params
        if(!id){
            throw new Error('id is not present')
        }
        const userData = await clientHelper.editUsers(id) 
        if(userData.length < 1){ 
            throw new Error('no data found')
        }
        res.status(200).send(userData)
    } 
    catch (error) {
        console.log(error.message)
        res.status(500).send(error.message);
    }
})

adminRoute.put('/update-user/:id', async (req, res)=>{
    try {
        const id = req.params.id
        if(!id){
            throw new Error('id is not present')
        }
        const data = await clientHelper.updateUsers(id, req.body) 
        if(!data){ 
            throw new Error('failed to update the user data')
        }
        // console.log("updated data :", data)
        res.status(200).json(data)
    } 
    catch (error) {
        console.log(error.message)
        res.status(500).json(error.message);
    }
})  


module.exports = adminRoute