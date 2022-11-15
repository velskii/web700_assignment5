/*********************************************************************************
 * WEB700 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Feiliang Zhou Student ID: 102661220 Date: Noverber 14, 2022
 *
 * Online (Cyclic) Link: https://blue-mysterious-cygnet.cyclic.app
 *
 ********************************************************************************/
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");

const db = require("./modules/collegeData");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute
            ? ' class="nav-item active"'
            : ' class="nav-item"') +
          '><a class="nav-link" href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3) {
          throw new Error("handlebars Helper equal needs 2 parameters");
        }
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);

app.set("view engine", ".hbs");

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo");
});

app.get("/students/add", (req, res) => {
  res.render("addStudent");
});

app.get("/students", function (req, res) {
  if (req.query.course != undefined) {
    db.getStudentsByCourse(req.query.course)
      .then((studnetsByCourse) => {
        res.send(studnetsByCourse);
      })
      .catch((err) => {
        res.json({ message: "no results" });
      });
  } else {
    db.getAllStudents()
      .then((data) => {
        res.render("students", {
          students: data,
        });
      })
      .catch((err) => {
        res.render("students", {
          message: "no results",
        });
      });
  }
});

app.post("/students/add", (req, res) => {
  req.body.TA = req.body.TA ? true : false;
  req.body.status = req.body.status ? req.body.status : "Full Time";

  db.addStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/courses", (req, res) => {
  db.getCourses()
    .then((data) => {
      res.render("courses", {
        courses: data,
      });
    })
    .catch((err) => {
      res.render({ message: "no results" });
    });
});

app.get("/course/:id", (req, res) => {
  db.getCourseById(req.params.id)
    .then((data) => {
      res.render("course", {
        course: data,
      });
    })
    .catch((err) => {
      res.render("course", { message: err });
    });
});

app.get("/student/:num", (req, res) => {
  db.getStudentByNum(req.params.num)
    .then((data) => {
      res.render("student", {
        student: data,
      });
    })
    .catch((err) => {
      res.render("student", { message: "no results" });
    });
});

app.post("/student/update", (req, res) => {
  req.body.TA = req.body.TA ? true : false;
  console.log(req.body);

  db.updateStudent(req.body)
    .then((data) => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.json({ message: "update student failed" });
    });
});

app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

db.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Express http server listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("db is not loaded successfully: " + err.message);
  });
