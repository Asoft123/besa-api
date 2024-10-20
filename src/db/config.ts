import {Sequelize} from "sequelize-typescript";
import dotenv from 'dotenv';
import models from "@mopos/models";

dotenv.config();

const dbConnection = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    models: [...models],    
});

export default dbConnection;