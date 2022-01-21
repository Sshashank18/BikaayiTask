const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const { MONGOURI } = require('./config/credentials');
const { urlencoded } = require('express');

const PORT = process.env.PORT || 4400;

mongoose.connect(MONGOURI,{                           //connect with the cloud mongo DB
    useNewUrlParser: true,
    useUnifiedTopology: true  
});           
mongoose.connection.on('connected',() => {
    console.log('Connected to Mongoose.');
});
mongoose.connection.on('error',(err) => {
    console.log('Error connecting', err);
});

require('./models/customer');

app.use(cors());
app.use(express.json());
app.use(urlencoded({extended: true}));

app.use('/',require('./routes/api/customer'));

// if(process.env.NODE_ENV === "production"){
//     app.use(express.static('client/build'));                //added client in server folder as deployment needs only 1 main folder
//     const path = require('path');
//     app.get("*", (req,res)=>{
//         res.sendFile(path.resolve(__dirname,'client','build','index.html'));
//     })
// }


app.listen(PORT, () => {
    console.log('Server up and running on',PORT);
});