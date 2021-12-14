const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors')
const publicRouter = require('./router/public');
const productRouter = require('./router/product');
const cartRoter = require('./router/cart')


const verifyToken = require('./auth/checkToken');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const time = new Date(Date.now() + (86400 * 1000))

const app = express();
const routerPrivate = express.Router();
const routerPublic = express.Router();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
// app.use('/', express.static('./public'));

app.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}));

app.use(cors())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


routerPublic.use('/api/public', publicRouter);
routerPublic.use('/api/product', productRouter);
routerPublic.use('/api/cart', cartRoter);
app.use(routerPublic);


routerPrivate.use(verifyToken)
// routerPrivate.use('/api/product', productRouter);
// routerPrivate.use('/api/customer', customerRouter);


app.use(routerPrivate);

let PORT = process.env.PORT || 5005
app.listen(PORT, () => console.log(`App running on port: ${PORT}`))