const express = require('express');

const userRouter = require('./src/modules/auth/auth.routes.js')

const mongoConnection = require('./Database/dbConnection.js');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config()
const app = express()
mongoConnection();
app.use(cors())
app.use(express.json()); // Parse request bodies as JSON


// Webhook Handling
app.use((req,res,next)=>{
 if(req.originalUrl ==="/Order/Webhook"){
    return next()
 }
 express.json()(req,res,next)
})

  


// Routes
app.use('/api/auth',userRouter)



// Set up server to listen on specified port (default to 3000)
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// 404 route
app.use('*', (req, res) => {
    res.status(404).json({ 'Msg': 'I Can\'t Found' });
});
  



