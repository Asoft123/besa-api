import 'module-alias/register';
import express from 'express';
import winston from 'winston';

import appInit from "@mopos/utils/appInit";

const app = express();


process.on('uncaughtException', (error: Error) => {
    // winston.error(error.message, error);
    // process.exit(1);
});

process.on('unhandledRejection', (error: Error) => {
    // winston.error(error.message, error);
    // process.exit(1);
});

appInit(app)();