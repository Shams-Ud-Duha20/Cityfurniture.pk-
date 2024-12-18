const express = require("express");
let router = express.Router();

let Product = require("../../models/products.model");
let USER = require("../../models/user.model");


let authMiddleware = require("../../middlewares/authentication.middle");
let adminMiddleware = require("../../middlewares/admin.middleware");
let webMiddleware = require("../../middlewares/web.middleware");
router.use(webMiddleware);

router.get("/admin/products/create", (req, res) => {
    res.render("admins_ejs_files/form-products", {
        layout : "AdminParent",
        title: "Create Your Products"
    });
});

router.get("/admin/products/delete/:id" , async(req, res) => {
    let params = req.params;
    let product = await Product.findByIdAndDelete(req.params.id);
    // let query = req.query;
    // res.send({query, params});
    // res.send(product);
    return res.redirect("/admin/products");
});


router.get("/admin/products/edit/:id" , async(req, res) => {
    
    let product = await Product.findById(req.params.id);
    
    return res.render("admins_ejs_files/edit-form-products",
    {
        layout : "AdminParent",
        title: "Edit Your Products",
        product,
    });
});



router.post("/admin/products/edit/:id" , async (req, res) => {
    
    let product = await Product.findById(req.params.id);

    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    
    await product.save();
    return res.redirect("/admin/products");
});


router.post("/admin/products/create" , async (req, res) => {
    let data = req.body;
    let newProduct = new Product(data);
    newProduct.title = data.title;

    await newProduct.save();

    return res.redirect("/admin/products");
});

router.get("/admin/products", adminMiddleware , async (req, res) => { //  change here
    
    let products = await Product.find();

    res.render("admins_ejs_files/products" , {
        layout: 'AdminParent',
        title: "Products List",
        Heading: "Manage your Products",
        products,
    });
});


router.get("/admin/users", adminMiddleware , async(req, res) => {
    let users = await USER.find();
    res.render("admins_ejs_files/Registered_users" , {
        layout: 'AdminParent',
        title: "Login Page",
        Heading: "Registered Users",
        users,
    });
});


router.get("/admin/:page?" , async(req, res) => {
    let page = req.params.page;
    page = page? Number(page):1;
    let pageSize = 3;
    let totalRecords = await Product.countDocuments();
    let totalPages = Math.ceil(totalRecords / pageSize);


    let pds = await Product.find()
    .limit(pageSize)
    .skip((page - 1 ) * pageSize);


    res.render("admins_ejs_files/availableProducts" , {
        layout: 'AdminParent',
        title: "My Featured Products",
        pds,
        page,
        pageSize,
        totalPages,
        totalRecords,
    });
});




router.get("/login" , (req, res) => {

    res.render("admins_ejs_files/login" , {
        layout: 'AdminParent',
        title: "Login Page",
    });
});



router.post("/login", async(req, res) => {
    let data = req.body;
    let user = await USER.findOne({email: data.username});
    if(!user)
    {
        console.log("user not available");
        return res.redirect("/registration");
    }

    let isValid;
    isValid = user.password == data.password;

    if(user &&  !isValid)
    {
        console.log("wrong password");
        return res.redirect("/login");
    }
    req.session.user = {
        email : user.email,
        role: user.role,
    };

    console.log("session Set : " , req.session.user);
    return res.redirect("/");

});


router.get("/registration", (req, res) => {
    res.render("admins_ejs_files/registration", {
        layout: "AdminParent",
        title: "Registration Page",
    });
});


router.post("/registration", async (req, res) => {
    let data = req.body;
    // let user = new USER(data);
    let user = await USER.findOne({email: data.email});
    if(user)
    {
        return res.redirect("/registration");
    }
    user = new USER(data);
    // user.email = data.email;

    await user.save();
    res.redirect("/login");
});



module.exports = router;