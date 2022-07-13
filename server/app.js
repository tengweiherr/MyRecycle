import express from 'express';
import sequelize from './utils/database.js';
import router from './routes/routes.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
app.use(cors({
    // origin: 'https://myrecycle.netlify.app'
    origin:'*'
}));//try

app.use('/static', express.static('uploads'))

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept, X-Auth-Token, append,delete,entries,foreach,get,has,keys,set,values');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use(router);

sequelize.sync(); 

// app.post('/signup',function(req,res){
//     res.send({
//     message:'Signup method here!'
//     });
//     });
app.listen(process.env.PORT || 3000,()=>{
console.log(`Listening on PORT: ${PORT}`)
});