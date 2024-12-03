const express = require("express");
const server = express();

let layout = require("express-ejs-layouts");

// Set EJS as the view engine
server.set("view engine", "ejs");
server.set("layout", "parentpage");
server.use(layout);



// Serve static files from the "public" folder
server.use(express.static("public"));

// Route example using EJS
server.get('/', (req, res) => {
    // Use EJS to render a view (e.g., views/about.ejs)
    res.render('index');
});

server.get('/about-me', (req, res) => {
    // Use EJS to render a view (e.g., views/about.ejs)
    res.render('portfolio');
});

// server.post('/about', (req, res) => {
//     // Use EJS to render a view (e.g., views/about.ejs)
//     const data = req.body;
//     console.log(data);
//     res.status(200);
//     res.render('about');
// });


server.listen(5000, () => {
    console.log("Server is running at port 5000");
});
