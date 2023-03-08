const express = require("express");
const app = express();
const multer  = require('multer')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()


const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL);

var storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, 'uploads/');
    },
    filename:function(req, file, cb){
        cb(null, req.query.name+file.originalname)
    }
})

var upload = multer({storage:storage}).single('file');



//DIRECTORS PART: crd

const directorSchema = new mongoose.Schema({
    //need to add a image link
    name: String,
    role: String,
    index: Number
});

const performanceSchema = new mongoose.Schema({
    name:String,
    paragraphs: Array,
    imglink: String,
    owner:String
});

const newsSchema = new mongoose.Schema({
    name: String,
    paragraph: String,
    link: String,
    owner: String
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
});

const oferSchema = new mongoose.Schema({
    nrclase: String,
    profile: String

})

const User = mongoose.model("User", userSchema);

const News = mongoose.model("News", newsSchema);

const Performance = mongoose.model('Performance', performanceSchema);

const Director = mongoose.model('Director', directorSchema);

const Ofer = mongoose.model('Ofer', oferSchema)

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo"] })
});

app.get("/api/directors", (req, res) => {

    Director.find({}, (err, docs) => {
        if (!err){
            res.json({directors: docs});
        }
    }).sort({index: 1});

});

app.post("/api/directors/new", (req, res) => {

    const newDirector = new Director({
        name: req.body.directorData.name,
        role: req.body.directorData.role,
        index: req.body.directorData.index
    });

    newDirector.save((err) => {
        if (!err){
            res.json({answ: "Director saved succesfully! Refresh the page to see the updated table"})

        } else {
            res.json({answ:"error saving director" + err});
        }
    });
});

app.post("/api/directors/delete", (req, res) => {
    Director.deleteOne({_id:req.body.directorId}, (err) => {
        if(!err) {
            res.json({answ:"The performance has been saved!"});
                } else {
            res.json({answ: err});
        }});

    
});

//DIRECTORS END

app.get("/api/ofer", (req, res) => {
    Ofer.find({}, (err, result) => {
        if (!err) {
            res.json(result)
        } else {
            res.json(err)
        }
    
    })
})

//PERFORMANCES: crd

app.get("/api/performances", (req, res) => {

    Performance.find({}, (err, docs) => {
        if (!err){
            res.json({performances: docs});
        }
    });
});

app.post("/api/performances", (req, res) => {
    Performance.find(req.body.filter, (err, docs) => {
        if (!err){ res.json({performances: docs});
        } else { res.json({error: err})};
    });
});


app.post('/api/performance/new', (req, res) => {

    const imageLink = req.body.imgname
    const newPerformance = new Performance({
        name: req.body.performance.name,
        paragraphs: [req.body.performance.paragraph1, req.body.performance.paragraph2, req.body.performance.paragraph3, req.body.performance.paragraph4],
        imglink: imageLink,
        owner: req.body.performance.owner
    });
    newPerformance.save((err) => {
        if (!err){
            res.send({response: "performance saved"});
        } else {
            res.json({response: err});
        }
    });

})

app.post("/api/performances/delete", (req, res) => {
    Performance.deleteOne({_id:req.body.performanceId}, (err) => {
        if(!err) {
            res.json({answer:"OK"});
        } else {
            res.json({error: err});
        }});
});

app.get("/api/news", (req, res) =>{
    console.log(req.body);
    News.find({},{}, {skip:req.body.skip, limit:req.body.limit ,sort:{_id: -1} }, (err, docs) => {
        if (!err){ res.json({news: docs});
        } else { res.json({error: err})};
    });
});

app.post("/api/news", (req, res) => {
    News.find(req.body.filter, {} ,{skip:req.body.skip, limit:req.body.limit ,sort:{_id: -1} },(err, docs) => {
        if (!err){ res.json({news: docs});
        } else { res.json({error: err})};
    })
});

app.post("/api/news/new", (req, res) => {

    const fileLink = req.body.filename
    const newNews = new News({
        name: req.body.news.newsName,
        paragraph: req.body.news.paragraph,
        link: fileLink,
        owner: req.body.news.owner
    });

    newNews.save((err) => {
        if (!err){ 
            res.json({answ: "ok"});
        } else {
            res.json({answ: err});
        }
    });
});

app.post("/api/news/delete", (req, res) => {
    News.deleteOne({_id: req.body.newsId}, (err) => {
        if (!err){
            res.send({response: "ok"});
        } else {
            res.json({response: err});
        }
    } );
})


app.post('/api/upload', (req, res) => {
    upload(req, res, (err) => {
        if (!err) {
            res.send("ok")
        } else {
            console.log(err);
        }
    });
})


//user
app.post("/api/users", (req, res)=>{

    User.find({}, {}, {skip: req.body.skip, limit:req.body.limit}, (err, result)=>{
        if (!err){
            res.json({users:result});
        } else {
            res.json({err: err});
        }
    })
})

app.post("/api/newuser", (req, res) => {

    var role = "user";
    if (req.body.admin){
        role = "admin";
    }

    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        role: role
    });

    newUser.save((err) => {
        if (!err)
            res.json("user registerd succesfully");
        else
            res.json(err);
    });
});

app.post("/acc/login", (req, res) => {
    User.findOne({username:req.body.username}, (err, result) => {
        if(!err && result && req.body.password === result.password){
            res.json({
                status: "ok",
                user:result
            }); 
        } else {
            res.json({status: "Something went wrong"});
        }
    })
});

app.post("/acc/resetpassword", (req, res) => {
    User.updateOne({username: req.body.username}, {password:req.body.newPassword}, (err, resp) => {
        if (!err){
            res.json({answ:"ok"});
        }
    })
});

app.post("/acc/delete", (req, res) => {
    User.deleteOne({_id:req.body.userId}, (err) => {
        if (!err){
            res.json({answ:"ok"});
        }
    })
})

app.get("/file", (req, res) => {
    //res.send("ok")
    res.sendFile(__dirname+"/uploads/"+req.query.name);
})


app.listen(3001, () => { console.log("Server is running on port 3001"); });