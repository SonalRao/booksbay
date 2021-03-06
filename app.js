//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

require("./src/db/conn");
const Register = require('./src/models/userregister')
const port = process.env.PORT || 3000;

const homeStartingContent = "This the page where you are freeto review the books you love. Happy Reading.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
var firstname="";
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts,
    firstname: firstname
    });
});
app.get("/index", function(req, res){
  res.render("index", {firstname: firstname});
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/about", function(req, res){
  res.render("about");
});

// app.get("/contact", function(req, res){
//   res.render("contact", {contactContent: contactContent});
// });

app.get("/compose", function(req, res){
  res.render("compose");
});


app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});



//create a new user in our database
app.post("/register", async (req, res)=>{
    try {
        const password = req.body.password
        const cpassword = req.body.confirmpassword
        if (password === cpassword){
            const registerUser = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                phone : req.body.phone,
                age : req.body.age,
                password : password,
                confirmpassword : cpassword
            })

            const registered = await registerUser.save();
            res.status(201).redirect("index");
        }else{
            res.send('Passwords are not matching')
        }
    } catch (error) {
        res.status(400).send(error)
    }
}),

//login check
app.post("/login", async (req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password
        firstname=req.body.firstname
     
        const  useremail = await Register.findOne({email:email});
        if(useremail.password === password){
            res.status(201).redirect("index")
        }else{
            res.send('Invalid login details...')
        }
    } catch (error) {
        res.status(400).send("Invalid login details...")
    }
})

app.get("/check", function(req, res){
  res.render("check", {name: firstname})
});

app.get('/editprofile', (req, res) =>{
  res.render("user")
})

app.get('/logout', (req, res, next) => {
   delete req.session;
  res.redirect('/');
});


app.listen(port, ()=>{
    console.log(`Server is live at port ${port}`);
})