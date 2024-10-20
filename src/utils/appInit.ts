
// import https from "https"
// import fs from "fs"
import { errorHandler } from "@mopos/middlewares/errorHandle";
import dbConnection from "@mopos/db/config";
import express, { Express } from "express";
import { injectControllers } from "express-ts-annotations";
import path from "path"
import morgan from "morgan";
import cors from "cors"
import helmet from "helmet";
import { buildPaths } from "./staticfiles";
import controllers from "@mopos/controllers";
import createAdminUserOnStartup from "@mopos/startup/admin";
import createOfficeOnStartup from "@mopos/startup/office";

const appInit = (app: Express) => {
  const PORT_NO = process.env.PORT || process.env.PORT_NO || 4200;

  return () => {
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(cors())
    app.use(helmet())
    app.set("view engine", "ejs")
    app.set("views", [path.join(__dirname, "views")])
    app.use('/uploads', express.static(buildPaths.static))

        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
            );
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, PATCH, OPTIONS"
            );
            next();
        });

        injectControllers(app, controllers);
        app.use((req, res, next) => {
            
            next(new Error("Not found"));
        });
        app.use(errorHandler);

        dbConnection.sync({ force: false }).then(() => {
            app.listen(PORT_NO, async () => {
                console.log(`App started and listening on port: ${PORT_NO}`)
                await createAdminUserOnStartup()
                await createOfficeOnStartup()
            })
        }).catch(error => {
            console.log(error);
        });
  };
};

export default appInit;
