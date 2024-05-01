const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

const dataController = require('../app/http/controllers/admin/dataController')
const viewController = require('../app/http/controllers/admin/viewController');
const updateController = require('../app/http/controllers/admin/updateController')

const multer  = require('multer');


function initRoutes(app){
    app.get('/',homeController().index)

    app.get('/cart',cartController().index)
    app.post('/update-cart', cartController().update)

    app.get('/register',authController().register)
    app.post('/register', authController().postRegister)

    app.get('/login',authController().login)
    app.post('/login', authController().postLogin)

    app.post('/logout', authController().logout)

    //customer routes
    app.post('/orders',orderController().store)
    app.get('/customers/orders',orderController().index)
    app.get('/customers/orders/:id',orderController().show)

    const storage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, './public/img');
        },
        filename: (req, file, cb)=>{
            // console.log(file)
            cb(null, Date.now() + file.originalname);
        }
    }); 
    const upload = multer({
        storage: storage
    });


    //admin routes
    app.get('/admin/orders',AdminOrderController().index)
    app.post('/admin/order/status',statusController().update)

    app.get("/admin/data"  , dataController().index)
    app.post("/admin/data" , upload.single('image'), dataController().data)
    app.get('/admin/view', viewController().view)

    app.get('/admin/view/delete/:id', dataController().delete)
    
    app.get('/admin/update/:id', updateController().view) 
    app.post('/admin/update/:id', upload.single('image'), updateController().data)

}



module.exports = initRoutes