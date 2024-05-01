require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3030;
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require('path');
const mongoose =require('mongoose')
const session = require("express-session");
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session);
const passport = require('passport')
const emitter = require('events')




//database connection
mongoose.connect("mongodb://127.0.0.1:27017/pizza-b",{
    useNewUrlParser:true,
    useCreateIndex : true,
    useUnifiedTopology:true,
    useFindAndModify:true
});
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log("connection successful");
}).catch('error',()=>{
     console.log(error);
})

//session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

//event emitter
const eventEmitter = new emitter()
app.set('eventEmitter',eventEmitter)

//session config
app.use(session({
    secret : process.env.COOKIE_SECRET,
    resave : false,
    store : mongoStore,
    saveUninitialized : false,
    cookie : {maxAge : 1000 * 60 * 60 * 24}
}))



//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash());

// assets
app.use(express.static("public"))
app.use("/images" , express.static(path.join(__dirname , "/public/img")));
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//middleware
app.use('/css',express.static(path.join(__dirname,"./node_modules/bootstrap/dist/css")));
app.use('/js',express.static(path.join(__dirname,"./node_modules/bootstrap/dist/js")));
app.use('/jq',express.static(path.join(__dirname,"./node_modules/jquery/dist")));



// set template engine 
app.use(expressLayout);
app.set('views', path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs")

require('./routes/web')(app)



const server = app.listen(port , () => {
    console.log(`Listening on port ${port}`);
});

// Socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
// Join
//   console.log(socket.id);
  socket.on('join', (orderId) => {
    socket.join(orderId)
  })
})

eventEmitter.on('orderUpdated', (data) => {
io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
io.to('adminRoom').emit('orderPlaced', data)
})

