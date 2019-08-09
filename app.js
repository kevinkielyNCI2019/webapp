var express = require("express"); // call the express module which is default provided by Node

var app = express(); // we to declare our app which is the envoked express application

app.set('view engine', 'ejs'); // this code sets the template engine, meaning .ejs files can be viewed rather than .html

app.use(express.static("views")); // allows access to views folder
app.use(express.static("style")); // allows access to style folder holding the stylesheets
app.use(express.static("images")); // allows access to the images folder

var mysql = require('mysql'); // needed for the mysql code to connect with the database

// body parser to get information

var fs = require('fs') // this code enables the reading and writing to a JSON file
var bodyParser = require("body-parser") // call body parser module and make use of it
app.use(bodyParser.urlencoded({extended:true}));

const fileUpload = require('express-fileupload'); // this is needed to enable file uploading into the mysql database.
app.use(fileUpload());

// ============ START OF SQL -========================== //

// first we need to tell the app where to find database

const db = mysql.createConnection({
    
    host: 'den1.mysql6.gear.host',
    user: 'bikes77',
    password: 'Uq4XF_H68Ln_',
    database: 'bikes77'
    
    
});


// next we create the connection and log messages to tell us whether it was successful or not //

db.connect((err) =>{
    
    if(err){
        console.log("Go back and check connection details, something is wrong")
    }
    
    else {
        console.log("The database connected successfully!")
    }
    
    
})

// This route will create the required database table //

app.get('/createtable', function(req, res) {
    
    let sql = 'CREATE TABLE bike_tbl (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Mtb_name varchar(255), Mtb_price int, Mtb_image varchar(255), Mtb_description varchar(255), Mtb_cat varchar(255))';

    let query = db.query(sql, (err,res) => {
        
         if(err) throw err;
        
        console.log(res);
        
     });
     
     res.send("You created your first database table")

    
})

// This route will create a bike product on entering of the /insert url in the browser bar


 app.get('/insert', function(req,res){
     // Inserts into the table the following bike attributes
     let sql = 'INSERT INTO bike_tbl (Mtb_name, Mtb_price, Mtb_image, Mtb_description, Mtb_cat) VALUES ("Ammaco Colorado", 125.99, "ammacoColorado.jpg", "Great value mountain bike style style; with front suspension; a lightweight alloy frame and 21 Shimano gears", "Mountain") ';
    
    let query = db.query(sql, (err,res) => {
        
       if(err) throw err;
        
        console.log(res);
        
    });
         res.send("You created your first Bike Product")
    
 })
 
 // Url to show the bike products in the /bikes url page

app.get('/bikes', function(req,res){
    // Selects all details from the table
    let sql = 'SELECT * FROM bike_tbl';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('bikes', {result}) // this renders the bikes page and data is displayed using the result keyword.
        
    });
    
    //res.send("You created your first Product")
    
})

// URL to get the add bike page
app.get('/addbike', function(req,res){
    
        res.render('addbike') // renders the add bike page
        
})

// post request to write info to the database including image upload //


app.post('/addbike', function(req,res){
    
 let sampleFile = req.files.sampleFile;
   filename = sampleFile.name;
    
    sampleFile.mv('./images/' + filename, function(err){ // this code uploads the selected image into the /images folder
        
        if(err)
        
        return res.status(500).send(err);
        console.log("Image you are uploading is " + filename)
       // res.redirect('/');
    })
    
    
    
    // Inserts into the table the required data including the newly uploaded image file
    let sql = 'INSERT INTO bike_tbl (Mtb_name, Mtb_price, Mtb_image, Mtb_description, Mtb_cat) VALUES ("'+req.body.page_mtb_bikename+'", '+req.body.page_mtb_bikeprice+', "'+filename+'", "'+req.body.page_mtb_bikedesc+'", "'+req.body.page_mtb_bikecat+'") ';
    
    
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
    
    res.redirect('/bikes') // loads the bikes page with the newly created bike record and data
    
})

// URL to get the edit bike page 

app.get('/editbike/:id', function(req,res){
    
        let sql = 'SELECT * FROM bike_tbl WHERE Id = "'+req.params.id+'" '; // determines which bike is being edited
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('editbike', {result})
        
    });
    
})

// URL to post the edited mountain bike data

app.post('/editbike/:id', function(req,res){
    
   
    let sampleFile = req.files.sampleFile;
   var filename = sampleFile.name;
    
    sampleFile.mv('./images/' + filename, function(err){
        
        if(err)
        
        return res.status(500).send(err);
        console.log("Image you are uploading is " + filename)
       // res.redirect('/');
    })
    
    // sql code to edit the data
    let sql = 'UPDATE bike_tbl SET Mtb_name = "'+req.body.page_mtb_bikename+'", Mtb_price = '+req.body.page_mtb_bikeprice+', Mtb_image = "'+filename+'", Mtb_description = "'+req.body.page_mtb_bikedesc+'", Mtb_cat = "'+req.body.page_mtb_bikecat+'" WHERE Id = "'+req.params.id+'" ';
    
    
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
    
    res.redirect('/bikes')
    //res.send("You created your first Product")
    
})

// URL TO delete a mountain bike

app.get('/deletebike/:id', function(req,res){
    
        let sql = 'DELETE FROM bike_tbl WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
       
        
    });
    
    res.redirect('/bikes')
    
    
})

// Url to see individual bike

app.get('/bikes/:id', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'SELECT * FROM bike_tbl WHERE Id = "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(res);
        res.render('bikes', {result})
    });
    
   // res.redirect('/products')
    //res.send("You created your first Product")
    
})

// Search utility


app.post('/search', function(req,res){
    
        let sql = 'SELECT * FROM bike_tbl WHERE Mtb_name LIKE "%'+req.body.search+'%" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('bikes', {result})
        
    });
    
})

// Filter the products from homepage images links

// Road bikes filter

app.get('/bikesroad', function(req,res){
    // Query to select all bike details from "roadbike" category
    let sql = 'SELECT * FROM bike_tbl WHERE Mtb_cat = "Road" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('bikes', {result})
        
    });
    
    
})

// Mountain bikes filter

app.get('/bikesmtb', function(req,res){
    // Query to select all bike details from "roadbike" category
    let sql = 'SELECT * FROM bike_tbl WHERE Mtb_cat = "Mountain" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('bikes', {result})
        
    });
    
    
})

// Hybrid bikes filter

app.get('/bikeshybrid', function(req,res){
    // Query to select all bike details from "roadbike" category
    let sql = 'SELECT * FROM bike_tbl WHERE Mtb_cat = "Hybrid" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('bikes', {result})
        
    });
    
    
})

// Classic bikes filter

app.get('/bikesclassic', function(req,res){
    // Query to select all bike details from "roadbike" category
    let sql = 'SELECT * FROM bike_tbl WHERE Mtb_cat = "Classic" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('bikes', {result})
        
    });
    
    
})

// ################################# From here is JSON Data ###########################################
var jsoncomment = require("./model/comments.json");


// set up simple hello world application using the request and response function
app.get('/', function(req, res) {
res.render("index"); 
//res.send("Hello World"); // we set the response to send back the string hello world
console.log("Hello World"); // used to output activity in the console
});

// this gets the feedback page "comments"
app.get('/comments', function(req, res){
    res.render("comments", {jsoncomment}); // get the bikes page when somebody visits the /comments URL
    console.log("I found the comments page!");
});

// this loads the add comment page

app.get('/addcomment', function(req, res){
      res.render("addcomment")
     console.log("You are on the add contacts page")
});

// post request to send JSON data to the server

app.post('/addcomment', function(req, res){
    
// step 1 - find the largest ID number in JSON file

    function getMax(allcomments, id){     // ! allcomments can by anything as long as properly referenced in following code!!
        
        var max; // variable declared here but still not known
        
        for(var i=0; i<allcomments.length; i++){ // loop thru the bikes in the json file as long as there are bikes to read
            if(!max || parseInt(jsoncomment[i][id])> parseInt(max[id]))
            max = allcomments[i];
            
        }
        
        return max;
    }
    
    // make a new id for the next item in the json file
    
    maxCid = getMax(jsoncomment, "id") // this calls the getMax function from above and passes in parameters
    
    var newId = maxCid.id + 1; // add 1 to old largest to make new largest and lets show the result in console
    console.log("the new id is " + newId)
    
    // we need to get access to what user types in the form
    // and pass it to our JSON file as the new data
    
    var newcomment = {
        
        id: newId,
        name: req.body.page_commentname,
        custnum: req.body.page_custnum,
        emailadd: req.body.page_emailadd,
        feedback: req.body.page_feedback,
        rating: req.body.page_rating
        
    }
    
    fs.readFile('./model/comments.json', 'utf8', function readfileCallback(err){
        
        if(err){
            throw(err)
        }
        else
        {
           jsoncomment.push(newcomment); // add the new data to the json file
           var json = JSON.stringify(jsoncomment, null, 4); // this line structures the JSON so it is easy to read#
           fs.writeFile('./model/comments.json', json, 'utf8')
        }
    });
    
    res.redirect('/comments');
    
});

// get page to edit the comments

app.get('/editcomment/:id', function(req,res){
    // Now we build the actual information based on the changes made by the user 
   function chooseComment(indcomm){
       return indcomm.id === parseInt(req.params.id)
       }


  var indcomm = jsoncomment.filter(chooseComment)
    
   res.render('editcomment', {res:indcomm}); 
    
});

// Perform the edit on the comments page

app.post('/editcomment/:id', function(req,res){
    
     // firstly we need to stringify our JSON data so it can be call as a variable an modified as needed
    var json = JSON.stringify(jsoncomment)
    
    // declare the incoming id from the url as a variable 
    var keyToFind = parseInt(req.params.id)
    
    // use predetermined JavaScript functionality to map the data and find the information I need 
    var index = jsoncomment.map(function(jsoncomment) {return jsoncomment.id}).indexOf(keyToFind)
    
    // the next three lines get the content from the body where the user fills in the form
    
    var z = parseInt(req.params.id);
    var cn = req.body.page_commentname;
    var cnum = req.body.page_custnum;
    var em = req.body.page_emailadd;
    var fe = req.body.page_feedback;
    var rat = req.body.page_rating;
    
     // The next section pushes the new data into the json file in place of the data to be updated  

    jsoncomment.splice(index, 1, {id: z, name: cn, custnum: cnum, emailadd: em, feedback: fe, rating: rat })
    
    // now we reformat the JSON and push it back to the actual file
    json = JSON.stringify(jsoncomment, null, 4); // this line structures the JSON so it is easy on the eye
    fs.writeFile('./model/comments.json',json, 'utf8', function(){})
    
    
    
    res.redirect("/comments");
    
    
})

// this code will delete the required comment

app.get('/deletecomment/:id', function(req,res){
    
    
    // firstly we need to stringify our JSON data so it can be call as a variable an modified as needed
    var json = JSON.stringify(jsoncomment)
    
    // declare the incoming id from the url as a variable 
    var keyToFind = parseInt(req.params.id)
    
    // use predetermined JavaScript functionality to map the data and find the information I need 
    var index = jsoncomment.map(function(jsoncomment) {return jsoncomment.id}).indexOf(keyToFind)
    

    jsoncomment.splice(index, 1)
    
    // now we reformat the JSON and push it back to the actual file
    json = JSON.stringify(jsoncomment, null, 4); // this line structures the JSON so it is easy on the eye
    fs.writeFile('./model/comments.json',json, 'utf8', function(){})
    
    res.redirect("/comments");
    
})

// ################################# More JSON for the Mailing list ###########################################

var jsonml = require("./model/mailinglist.json");

// this gets the mailing list page
app.get('/mailinglist', function(req, res){
    res.render("mailinglist", {jsonml}); // get the mailing list page
    console.log("I found the mailing list page!");
});

// this loads the add to mailing list page

app.get('/addmailinglist', function(req, res){
      res.render("addmailinglist")
     console.log("You are on the add to mailing list page")
});

// post request to send JSON data to the server

app.post('/addmailinglist', function(req, res){
    
// step 1 - find the largest ID number in JSON file

    function getMax(all_ml, id){     // ! all_ml can by anything as long as properly referenced in following code!!
        
        var max; // variable declared here but still not known
        
        for(var i=0; i<all_ml.length; i++){ // loop thru the bikes in the json file as long as there are bikes to read
            if(!max || parseInt(jsonml[i][id])> parseInt(max[id]))
            max = all_ml[i];
            
        }
        
        return max;
    }
    
    // make a new id for the next item in the json file
    
    maxCid = getMax(jsonml, "id") // this calls the getMax function from above and passes in parameters
    
    var newId = maxCid.id + 1; // add 1 to old largest to make new largest and lets show the result in console
    console.log("the new id is " + newId)
    
    // we need to get access to what user types in the form
    // and pass it to our JSON file as the new data
    
    var newml = {
        
        id: newId,
        name: req.body.page_ml_name,
        emailadd: req.body.page_ml_emailadd
        
    }
    
    fs.readFile('./model/mailinglist.json', 'utf8', function readfileCallback(err){
        
        if(err){
            throw(err)
        }
        else
        {
           jsonml.push(newml); // add the new data to the json file
           var json = JSON.stringify(jsonml, null, 4); // this line structures the JSON so it is easy to read#
           fs.writeFile('./model/mailinglist.json', json, 'utf8')
        }
    });
    
    res.redirect('/mailinglist');
    
});

// get page to edit the mailing list page

app.get('/editmailinglist/:id', function(req,res){
    // Now we build the actual information based on the changes made by the user 
   function chooseML(indml){
       return indml.id === parseInt(req.params.id)
       }


  var indml = jsonml.filter(chooseML)
    
   res.render('editmailinglist', {res:indml}); 
    
});


// Perform the edit on the mailing list page

app.post('/editmailinglist/:id', function(req,res){
    
     // firstly we need to stringify our JSON data so it can be call as a variable an modified as needed
    var json = JSON.stringify(jsonml)
    
    // declare the incoming id from the url as a variable 
    var keyToFind = parseInt(req.params.id)
    
    // use predetermined JavaScript functionality to map the data and find the information I need 
    var index = jsonml.map(function(jsonml) {return jsonml.id}).indexOf(keyToFind)
    
    // the next three lines get the content from the body where the user fills in the form
    
    var zz = parseInt(req.params.id);
    var cn2 = req.body.page_ml_name;
    var em2 = req.body.page_ml_emailadd;
    
     // The next section pushes the new data into the json file in place of the data to be updated  

    jsonml.splice(index, 1, {id: zz, name: cn2, emailadd: em2 })
    
    // now we reformat the JSON and push it back to the actual file
    json = JSON.stringify(jsonml, null, 4); // this line structures the JSON so it is easy on the eye
    fs.writeFile('./model/mailinglist.json',json, 'utf8', function(){})
    
    
    
    res.redirect("/mailinglist");
    
    
})

// this code will delete the required mailing list entry

app.get('/deletemailinglist/:id', function(req,res){
    
    
    // firstly we need to stringify our JSON data so it can be call as a variable an modified as needed
    var json = JSON.stringify(jsonml)
    
    // declare the incoming id from the url as a variable 
    var keyToFind = parseInt(req.params.id)
    
    // use predetermined JavaScript functionality to map the data and find the information I need 
    var index = jsonml.map(function(jsonml) {return jsonml.id}).indexOf(keyToFind)
    

    jsonml.splice(index, 1)
    
    // now we reformat the JSON and push it back to the actual file
    json = JSON.stringify(jsonml, null, 4); // this line structures the JSON so it is easy on the eye
    fs.writeFile('./model/mailinglist.json',json, 'utf8', function(){})
    
    res.redirect("/mailinglist");
    
})



// this code provides the server port for our application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
console.log("Yippee its running");
  
});