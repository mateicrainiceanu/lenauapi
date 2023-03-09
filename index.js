const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const Usersql = require("./models/user");
const Directorsql = require("./models/director.js");
const Newssql = require("./models/news");
const Performancesql = require("./models/perfomance")

app.use(cors());
app.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, req.query.name + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("file");

//DIRECTORS PART: crd

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo"] });
});

app.get("/api/directors", async (req, res) => {
  const [result] = await Directorsql.find();

  res.json({ directors: result });
});

app.post("/api/directors/new", async (req, res) => {
  const newDirector = new Directorsql(
    req.body.directorData.index,
    req.body.directorData.name,
    req.body.directorData.role
  );

  const [result] = await newDirector.save();

  if (result.affectedRows === 1) {
    res.json({
      answ: "Director saved succesfully! Refresh the page to see the updated table",
    });
  } else {
    res.json({ answ: "error saving director" });
  }
});

app.post("/api/directors/delete", async (req, res) => {
  const [result] = await Directorsql.delete(req.body.directorId);

  if (result.affectedRows === 1) {
    res.json({ answ: "Director deleted succesfully" });
  } else {
    res.json({ answ: err });
  }
});

//DIRECTORS END

//PERFORMANCES: crd

app.get("/api/performances", async (req, res) => {
    
    const [r] = await Performancesql.find()

    res.json({ performances: r });
});

app.post("/api/performance/new", async (req, res) => {
  const imageLink = req.body.imgname;
  const newPerformance = new Performancesql({
    name: req.body.performance.name,
    paragraphs: [
      req.body.performance.paragraph1,
      req.body.performance.paragraph2,
      req.body.performance.paragraph3,
      req.body.performance.paragraph4,
    ],
    imglink: imageLink
  });

  const [r] = await newPerformance.save();
  if (r.affectedRows === 1) {
    res.json({answ:"ok"})
  } else {
    res.json({answ:"error"})
  }
});

app.post("/api/performances/delete", async (req, res) => {

   const [r] = await Performancesql.delete(req.body.performanceId)
       if (r.affectedRows === 1) {
         res.json({ answer: "OK" });
       } else {
         res.json({ error: err });
       }

//   Performance.deleteOne({ _id: req.body.performanceId }, (err) => {
//   });
});

app.post("/api/news", async (req, res) => {
  let [result] = await Newssql.findAll(req.body.skip, req.body.limit);

  if (result) {
    res.json({ news: result });
  } else {
    res.json({ error: "error" });
  }
});

app.post("/api/news/new", async (req, res) => {
  const newNews = new Newssql(
    req.body.news.newsName,
    req.body.news.paragraph,
    req.body.filename
  );

  const [result] = await newNews.save();

  if (result.affectedRows === 1) {
    res.json({ answ: "ok" });
  } else {
    res.json({ answ: err });
  }
});

app.post("/api/news/delete", async (req, res) => {
  const [result] = await Newssql.delete(req.body.newsId);

  if (result.affectedRows === 1) {
    res.send({ response: "ok" });
  } else {
    res.json({ response: "error" });
  }
});

app.post("/api/upload", (req, res) => {
  upload(req, res, (err) => {
    if (!err) {
      res.send("ok");
    } else {
      console.log(err);
    }
  });
});

//user
app.post("/api/users", async (req, res) => {
  const [users, _] = await Usersql.findAll(req.body.skip);

  res.json({ users: users });
});

app.post("/api/newuser", (req, res) => {
  var role = "user";
  if (req.body.admin) {
    role = "admin";
  }

  const newUser = new Usersql(req.body.username, req.body.password, role);

  const result = newUser.save();

  res.json(result);
});

app.post("/acc/login", async (req, res) => {
  const [[user], _] = await Usersql.findUsername(req.body.username);

  if (user && req.body.password === user.password) {
    res.json({
      status: "ok",
      user: user,
    });
  } else {
    res.json({ status: "Something went wrong" });
  }
});

app.post("/acc/resetpassword", async (req, res) => {
  const [result] = await Usersql.resetPassword(
    req.body.username,
    req.body.newPassword
  );

  if (result.affectedRows === 1) {
    res.json({ answ: "ok" });
  } else {
    res.json({ answ: "error" });
  }
});

app.post("/acc/delete", async (req, res) => {
  const [result] = await Usersql.delete(req.body.userId);

  if (result.affectedRows === 1) {
    res.json({ answ: "ok" });
  } else {
    res.json({ answ: "error" });
  }
});

app.get("/file", (req, res) => {
  //res.send("ok")
  res.sendFile(__dirname + "/uploads/" + req.query.name);
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
