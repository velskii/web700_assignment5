const fs = require("fs");
const { resolve } = require("path");

class Data {
  students;
  courses;
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;
let studentsData = [];
let coursesData = [];
module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/students.json", "utf8", function (err, data) {
      if (err) {
        reject("unable to read students.json");
      }
      studentsData = JSON.parse(data);

      fs.readFile("./data/courses.json", "utf8", function (err, data) {
        if (err) {
          reject("unable to read courses.json");
        } else {
          coursesData = JSON.parse(data);
          // console.log("fs courses: " + coursesData);
          dataCollection = new Data(studentsData, coursesData);
          resolve(dataCollection);
        }
      });
    });
  });
};

module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    if (studentsData.length > 0) {
      resolve(dataCollection.students);
    } else {
      reject("no results returned");
    }
  });
};

module.exports.addStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    let originalLength = dataCollection.students.length;
    studentData.studentNum = originalLength + 1;
    dataCollection.students.push(studentData);

    if (originalLength >= dataCollection.students.length) {
      reject("add student failed.");
    } else {
      resolve(dataCollection.students);
    }
  });
};

module.exports.getCourses = function () {
  return new Promise((resolve, reject) => {
    if (coursesData.length > 0) {
      resolve(dataCollection.courses);
    } else {
      reject("no results returned");
    }
  });
};

module.exports.getCourseById = function (id) {
  return new Promise((resolve, reject) => {
    let courseById;
    courseById = dataCollection.courses.find((item) => {
      return item.courseId == id;
    });
    // console.log(courseById);
    if (courseById != undefined) {
      resolve(courseById);
    } else {
      reject("query returned 0 results");
    }
  });
};

module.exports.getStudentsByCourse = (course) => {
  return new Promise((resolve, reject) => {
    let studentsByCourse;
    studentsByCourse = dataCollection.students.filter(
      (item) => item.course == course
    );
    if (studentsByCourse.length > 0) {
      resolve(studentsByCourse);
    } else {
      reject("no results returned");
    }
  });
};

module.exports.getStudentByNum = (num) => {
  return new Promise((resolve, reject) => {
    let studentByNum;
    studentByNum = dataCollection.students.find((item) => {
      return item.studentNum == num;
    });
    if (studentByNum != undefined) {
      resolve(studentByNum);
    } else {
      reject("no results returned");
    }
  });
};
module.exports.updateStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    // let theStudent = dataCollection.students.find((item) => {
    //   return item.studentNum == studentData.studentNum;
    // });
    dataCollection.students = dataCollection.students.filter((item) => {
      return item.studentNum != studentData.studentNum;
    });

    dataCollection.students.push(studentData);

    console.log(studentData);
    // theStudent.indexOf();
    resolve();
  });
};
