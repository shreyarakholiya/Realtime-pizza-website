const Menu = require('../../../models/menu');

function dataController() {
    return{
        index(req,res){
            return res.render("admin/data")
        },
        data(req , res) {
            // console.log(req.file.filename);
            var menu = new Menu({
                name: req.body.name,
                image: req.file.filename,
                price: req.body.price,
                size: req.body.size
            });
// console.log(menu);
            menu.save((err, doc) => {
                if (!err)
                // console.log(menu);
                    res.redirect('view');
            });
        },
        delete(req,res) {
            Menu.findByIdAndRemove(req.params.id, (err,doc) => {
                if(!err) {
                    res.redirect('/admin/view')
                }
                else {
                    console.log('Failed To Delete Data :( ' + err);
                }
            });
        }
    }
    
}

module.exports = dataController