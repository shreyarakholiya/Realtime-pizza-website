const Menu = require('../../../models/menu');

function updateController() {
    return {
        view(req, res) {
            // console.log(req.params.id);
            Menu.findById(req.params.id, (err, doc) => {
                if(!err) {
                    doc = doc.toObject()

                    res.render('admin/update', {menu: doc})
                    // console.log(doc);

                }
            })
        },
        data(req, res) {
            
            Menu.findByIdAndUpdate(req.params.id,req.body,(err, doc) => {
                // console.log("hello");
                if(!err) {
                    res.redirect("/admin/view");
                }
                else {
                    console.log('Error During Record Update :( ' + err);
                }
            })
        }
    }
}

module.exports = updateController