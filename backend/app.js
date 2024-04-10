require("dotenv").config();
require("./config/database").connectToDb();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { log } = require("console");
const port=process.env.PORT



app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

//routers
const adminRoute = require('./routers/adminRoute')
const clientRoute = require('./routers/clientRoute')


app.use("/images", express.static("views"));

//mount the routes
app.use('/', clientRoute);
app.use('/admin/', adminRoute);

//listen to the port
app.listen(port,(error)=>{
    if(!error){
        console.log(`connected to : http://localhost:${port}`);
    }else{
        console.log('server connection failed');
    }
})
