import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST, 
    define: {
        timestamps: false
    }
});

export default sequelize;

// mysql://bb3aa990d8e259:693d0165@us-cdbr-east-05.cleardb.net/heroku_ec06fcbef5b72c7?reconnect=true