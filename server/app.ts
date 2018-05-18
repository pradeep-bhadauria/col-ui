import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { json, urlencoded } from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as path from "path";
import { readFileSync } from 'fs';
import { renderModuleFactory } from '@angular/platform-server';
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');


const app: express.Application = express();

app.disable("x-powered-by");

app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

const ROOT = path.join(path.resolve(__dirname, '..'));

if (app.get("env") === "production") {
  // in production mode run application from dist folder
  app.use(express.static(path.join(__dirname, "/../client")));
}

const DIST_FOLDER = path.join(process.cwd(), 'dist');
const template = readFileSync(path.join(DIST_FOLDER, 'client', 'index.html')).toString();

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(DIST_FOLDER + '/server/app');

app.engine('html', (_, options, callback) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    // Our index.html
    document: template,
    url: options.req.url,
    // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }).then(html => {
    callback(null, html);
  });
});

app.set('view engine', 'html');
app.set('views', path.join(DIST_FOLDER, 'client'));

// Server static files from /client
app.get('*.*', express.static(path.join(DIST_FOLDER, 'client')));

app.get('*', function (req, res) {
  res.sendFile(ROOT + '/client/index.html');
});


// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next) => {
  const err = new Error("Not Found");
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message,
  });
});

export { app };
