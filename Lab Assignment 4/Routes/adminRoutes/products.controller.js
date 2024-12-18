const express = require("express");
let router = express.Router();

let Product = require("../../models/products.model");
let USER = require("../../models/user.model");
let Order = require("../../models/order.Model");

router.use(express.urlencoded({ extended: true }));

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

// router.get("/admin/products", adminMiddleware , async (req, res) => { //  change here
    
//     let products = await Product.find();

//     res.render("admins_ejs_files/products" , {
//         layout: 'AdminParent',
//         title: "Products List",
//         Heading: "Manage your Products",
//         products,
//     });
// });

router.get("/admin/products", adminMiddleware, async (req, res) => {
    // Fetch query parameters for search and sorting
    const { search, sort } = req.query;

    let query = {};
    if (search) {
        query.title = { $regex: search, $options: "i" }; // Case-insensitive search by title
    }

    let sortOptions = {};
    if (sort) {
        sortOptions.price = sort === "asc" ? 1 : -1; // Sort by price: ascending or descending
    }

    // Fetch filtered and sorted products
    let products = await Product.find(query).sort(sortOptions);

    res.render("admins_ejs_files/products", {
        layout: "AdminParent",
        title: "Products List",
        Heading: "Manage your Products",
        products,
        search: search || "",
        sort: sort || "",
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


// router.get("/admin/:page?" , async(req, res) => {
//     let page = req.params.page;
//     page = page? Number(page):1;
//     let pageSize = 3;
//     let totalRecords = await Product.countDocuments();
//     let totalPages = Math.ceil(totalRecords / pageSize);


//     let pds = await Product.find()
//     .limit(pageSize)
//     .skip((page - 1 ) * pageSize);


//     res.render("admins_ejs_files/availableProducts" , {
//         layout: 'AdminParent',
//         title: "My Featured Products",
//         pds,
//         page,
//         pageSize,
//         totalPages,
//         totalRecords,
//     });
// });

router.get("/admin/:page?", async (req, res) => {
    let page = req.params.page ? Number(req.params.page) : 1; // Current page
    let pageSize = 3; // Number of products per page

    let { search = "", sort = "asc" } = req.query; // Default values for search and sort
    let filter = {};

    // Add search filter if search query is provided
    if (search) {
        filter.title = { $regex: search, $options: "i" }; // Case-insensitive search on title
    }

    // Determine the sorting order
    let sortOrder = sort === "desc" ? -1 : 1;

    // Count total matching records
    let totalRecords = await Product.countDocuments(filter);

    // Calculate total pages
    let totalPages = Math.ceil(totalRecords / pageSize);

    // Fetch filtered and sorted products with pagination
    let pds = await Product.find(filter)
        .sort({ price: sortOrder })
        .limit(pageSize)
        .skip((page - 1) * pageSize);

    res.render("admins_ejs_files/availableProducts", {
        layout: "AdminParent",
        title: "My Featured Products",
        pds,
        page,
        pageSize,
        totalPages,
        totalRecords,
        search,
        sort,
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



router.post("/ViewCart/Checkout/placeOrder", async (req, res) => {
    let { name, street, city, postalCode, cart } = req.body;

    // Parse the cart (comes as a JSON string)
    let items = JSON.parse(cart);

    // Calculate the total amount
    let totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    // Create the new order
    let newOrder = new Order({
        orderId: 'ORD-${Date.now()}',  // Corrected string interpolation
        customer: { name, street, city, postalCode },
        items,
        totalAmount,
    });

    await newOrder.save();

    // Clear the cart cookie
    res.clearCookie("cart");

    // Redirect to a confirmation page or back to the checkout
    res.redirect("/ViewCart/Checkout");
});



router.get("/Orders-of-People", adminMiddleware, async (req, res) => {
    try {
        // Fetch all orders from the database
        let orders = await Order.find().populate('customer'); // Use populate if you have a reference to a customer model, otherwise you can skip this part
        res.render("admins_ejs_files/ListofOrders", {
            layout: "AdminParent",
            title: "Orders List",
            Heading: "Orders of People",
            orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Server Error");
    }
});




module.exports = router;