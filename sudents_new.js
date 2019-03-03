"use strict";

//This is all my global variable.
let students;
let arrayOfStudents = [];
let arrayOfExpelled = [];
let arrayOfInSquad = [];
let showexpelled = false;
let activeArray;
let housefilter = "All";
let sortBy = "None";
let activeId;

let Hack = document.querySelector("#Hack");

let Mille = {
  fullname: "Mille P. Wienberg",
  house: "Ravenclaw",
  bloodstatus: "Pure"
};

// Prototype
const studentPrototype = {
  fullname: "-student name-",
  Firstname: "-student Firstname-",
  Lastname: "-student Firstname-",
  house: "-student house-",
  image: "-image-",
  Expelled: "-Expelled-",
  bloodstatus: "-bloodstatus-",
  inSquad: "-inquisitorialSquad-",

  setJSONdata(studentData) {
    const firstSpace = studentData.fullname.indexOf(" ");
    const lastSpace = studentData.fullname.lastIndexOf(" ");
    let name = this.fullname;

    this.fullname = studentData.fullname;
    this.Firstname = studentData.fullname.substring(0, firstSpace);
    this.Lastname = studentData.fullname.substring(lastSpace + 1);
    this.house = studentData.house;
    this.image = this.Lastname + "_" + this.Firstname.substring(0, 1) + ".png";

    this.Expelled = false;
    this.bloodstatus = "none";
    this.inSquad = false;
  }
};

//Starting this whole shit.
window.addEventListener("DOMContentLoaded", init);

//Filtering with the buttons.
function init() {
  document.querySelector("#all").addEventListener("click", filterAll);
  document
    .querySelector("#hufflepuff")
    .addEventListener("click", filterHufflepuff);
  document
    .querySelector("#gryffindor")
    .addEventListener("click", filterGryffindor);
  document
    .querySelector("#ravenclaw")
    .addEventListener("click", filterRavenclaw);
  document
    .querySelector("#slytherin")
    .addEventListener("click", filterSlytherin);
  document
    .querySelector("#Firstname")
    .addEventListener("click", sortByFirstname);

  document.querySelector("#Lastname").addEventListener("click", sortByLastname);
  document.querySelector("#House").addEventListener("click", sortByHouse);

  document.querySelector("#Expelled").addEventListener("click", ExpelledButton);
  // document.querySelector("#Enrolled").addEventListener("click", EnrolledButton);

  //Calling for next function "getJson"
  getJson();
}

//	Gets the JSON
async function getJson() {
  console.log("getJson");
  let Json = await fetch("https://petlatkea.dk/2019/hogwarts/students.json");

  students = await Json.json();
  //when loaded, prepare objects

  getJsonFam(students);
}
//	get JSON with the blood families
async function getJsonFam(students) {
  let JsonFam = await fetch("http://petlatkea.dk/2019/hogwarts/families.json");
  let families = await JsonFam.json();
  studentObject(students, families);
}

// StudentObject - the beginning of the sorting of Firstname - Lastname - Houses.

function studentObject(students, families) {
  console.log("studentObject");
  students.forEach(studentData => {
    // create, clone and add studentObject
    const student = Object.create(studentPrototype);
    student.setJSONdata(studentData);
    arrayOfStudents.push(student);
  });

  getHalfBloods(families);
  getPureBloods(families);
  setMuggleBloods();
  corrrectNames();

  activeArray = arrayOfStudents;

  createMille();
}

function getHalfBloods(families) {
  console.log("getHalfBloods");
  let halfBloods = families.half;
  let bloodLabel = "Halfblood";
  halfBloods.forEach(bloodName => {
    setBloodStatus(bloodName, bloodLabel);
  });
}

function getPureBloods(families) {
  console.log("getPureBloods");
  let pureBloods = families.pure;
  let bloodLabel = "Pureblood";
  pureBloods.forEach(bloodName => {
    setBloodStatus(bloodName, bloodLabel);
  });
}

function setBloodStatus(bloodName, bloodLabel) {
  console.log("setBloodStatus");
  let objIndex = arrayOfStudents.findIndex(obj => obj.lastName == bloodName);
  if (objIndex !== -1) {
    arrayOfStudents[objIndex].bloodstatus = bloodLabel;
  }
}

function setMuggleBloods() {
  console.log("setMuggleBloods");
  arrayOfStudents.forEach(student => {
    if (student.bloodstatus === "None") {
      student.bloodstatus = "Muggleblood";
    }
  });
}

function corrrectNames() {
  arrayOfStudents.forEach(student => {
    // Bloodhack is here!
    if (
      student.bloodstatus === "Halfblood" ||
      student.bloodstatus === "Muggleblood"
    ) {
      student.bloodstatus = "Pureblood";
    } else {
      let randomStuff = Math.random();
      if (randomStuff > 0.5) {
        student.bloodstatus = "Half-blood";
      } else {
        student.bloodstatus = "Muggleblood";
      }
    }
  });
  activeArray = arrayOfStudents;
  addIdToStudents();
}

//Plugin of myself.
function createMille() {
  const student = Object.create(studentPrototype);
  student.setJSONdata(Mille);
  arrayOfStudents.push(student);
  filterStudents();
}

//ID to the students

function addIdToStudents() {
  console.log("addIdToStudents");
  //add unique id to students
  arrayOfStudents.forEach(student => {
    const idMade = makeId(student.fullname);
    student.id = idMade;
  });
  activeArray = arrayOfStudents;
  filterStudents();
}

function makeId(input) {
  console.log("makeId");
  let idMade = "";
  for (let i = 0; i < input.length; i++) {
    idMade += input[i].charCodeAt(0);
  }
  return idMade;
}

//ERXPEL STUDENT
function expelStudent(badStudentId) {
  //Expel status is true

  let objIndex = arrayOfStudents.findIndex(obj => obj.id === badStudentId);
  arrayOfStudents[objIndex].Expelled = true;
  let ExpelledStudent = arrayOfStudents[objIndex];
  arrayOfExpelled.unshift(ExpelledStudent);

  //remove student from display
  arrayOfStudents = arrayOfStudents.filter(function(el) {
    return el.Expelled === false;
  });
  activeArray = arrayOfStudents;
  filterStudents();
}

//JOIN InSq

function joinInSq(StudentId) {
  console.log("joinInSq");

  let objIndex = arrayOfStudents.findIndex(obj => obj.id === StudentId);
  let inSquadStudent = arrayOfStudents[objIndex];

  if (
    inSquadStudent.bloodstatus === "Pureblood" ||
    (inSquadStudent.bloodstatus === "Halfblood" &&
      inSquadStudent.house === "Slytherin")
  ) {
    arrayOfStudents[objIndex].inSquad = true;
    arrayOfInSquad.unshift(inSquadStudent);
    activeArray = arrayOfStudents;
    filterStudents();
  } else {
    alert("No can do!");
  }
}

//EXIT InSq
function exitInSq(StudentId) {
  console.log("exitInSq");

  let objIndex = arrayOfStudents.findIndex(obj => obj.id === StudentId);
  let inSquadStudent = arrayOfStudents[objIndex];
  arrayOfInSquad.splice(inSquadStudent);
  arrayOfStudents[objIndex].inSquad = false;
  activeArray = arrayOfStudents;
  filterStudents();
}

//EXPEL KNAPPEN
function ExpelledButton() {
  activeArray = arrayOfExpelled;

  housefilter = "All";
  document.querySelector("#Expelled").classList.add("on");
  document.querySelector("#Enrolled").classList.remove("on");
  document.querySelector("#Enrolled").classList.add("off");

  filterStudents();
}

//Filter for Alle Houses
function filterAll() {
  housefilter = "All";

  if (showexpelled === false) {
    activeArray = arrayOfStudents;
    filterStudents();
  } else {
    activeArray = arrayOfExpelled;
  }
  filterStudents();
}

//Filter for hufflepuff
function filterHufflepuff() {
  housefilter = "hufflepuff";
  filterStudents();
}

//Filter for gryffindor
function filterGryffindor() {
  housefilter = "gryffindor";

  filterStudents();
}

//Filter for ravenclaw
function filterRavenclaw() {
  housefilter = "ravenclaw";

  filterStudents();
}

//Filter for slytherin
function filterSlytherin() {
  housefilter = "slytherin";

  filterStudents();
}

//Array for filtering students to the Housefilter.
function filterStudents() {
  if (showexpelled == false) {
    if (housefilter === "All") {
      sortStudents(arrayOfStudents);
    } else {
      activeArray = arrayOfStudents.filter(function(student) {
        return student.house === housefilter;
      });
      sortStudents();
    }
  }
}

function sortByFirstname() {
  sortBy = "Firstname";
  sortStudents();
}

function sortByLastname() {
  sortBy = "Lastname";
  sortStudents();
}

function sortByHouse() {
  sortBy = "house";
  sortStudents();
}

function sortStudents() {
  if (sortBy === "None") {
    displayStudents();
  }
  if (sortBy === "Firstname") {
    activeArray.sort(function(a, b) {
      if (a.Firstname < b.Firstname) {
        return -1;
      } else {
        return 1;
      }
    });
    displayStudents();
  }

  if (sortBy === "Lastname") {
    activeArray.sort(function(a, b) {
      if (a.Lastname < b.Lastname) {
        return -1;
      } else {
        return 1;
      }
    });
    displayStudents();
  }
  if (sortBy === "House") {
    activeArray.sort(function(a, b) {
      if (a.house < b.house) {
        return -1;
      } else {
        return 1;
      }
    });
    displayStudents();
  }
}

//Displaying

function displayStudents() {
  console.log("displayList");

  let template = document.querySelector("[data-template]");
  let container = document.querySelector("[data-container]");

  container.innerHTML = "";

  //forEach

  activeArray.forEach(student => {
    console.log(student);

    //Creating the klon
    let klon = template.cloneNode(true).content;

    //Set klon data
    klon.querySelector("[data-fullname]").textContent = student.fullname;

    klon.querySelector("[data-img]").src = "images/" + student.image;

    klon.querySelector("[data-fullname]").addEventListener("click", () => {
      visModal(student);
    });
    klon.querySelector("[data-house]").textContent = student.house;

    if (showexpelled === false) {
      klon.querySelector(".expel").addEventListener("click", () => {
        expelStudent(student.id);
      });
    } else {
      klon.querySelector(".expel").remove();
    }

    if (student.inSquad === false) {
      klon.querySelector(".insquad").textContent = "Join the InSquad";
      klon.querySelector(".insquad").addEventListener("click", () => {
        joinInSq();
      });
    }
    if (student.inSquad === true) {
      klon.querySelector(".insquad").textContent = "Exit InSquad";
      klon.querySelector(".insquad").addEventListener("click", () => {
        exitInSq();
      });
    }
    container.appendChild(klon);
  });
  countStudents();
}

function visModal(person) {
  modal.classList.add("vis");

  modal.querySelector(".modal-house").textContent = person.house;

  modal.querySelector(".bloodstatus").textContent = person.bloodstatus;

  modal.querySelector(".modal-navn").textContent = person.fullname;

  modal.querySelector(".modal-billede").src = "images/" + person.image;

  // Virker ikke!!!!

  if (person.house == "Gryffindor") {
    document.querySelector("#modal-content").classList.add("gryffindor");
    document.querySelector("#modal-content").classList.remove("hufflepuf");
    document.querySelector("#modal-content").classList.remove("slytherin");
    document.querySelector("#modal-content").classList.remove("ravenclaw");
    document.querySelector(".house-billede").src = "images/gryf.png";
  }
  if (person.house == "Hufflepuff") {
    document.querySelector("#modal-content").classList.add("hufflepuf");
    document.querySelector("#modal-content").classList.remove("gryffindor");
    document.querySelector("#modal-content").classList.remove("slytherin");
    document.querySelector("#modal-content").classList.remove("ravenclaw");
    document.querySelector(".house-billede").src = "images/huf.png";
  }
  if (person.house == "Slytherin") {
    document.querySelector("#modal-content").classList.add("slytherin");
    document.querySelector("#modal-content").classList.remove("hufflepuf");
    document.querySelector("#modal-content").classList.remove("gryffindor");
    document.querySelector("#modal-content").classList.remove("ravenclaw");
    document.querySelector(".house-billede").src = "images/slyth.png";
  }
  if (person.house == "Ravenclaw") {
    document.querySelector("#modal-content").classList.add("ravenclaw");
    document.querySelector("#modal-content").classList.remove("hufflepuf");
    document.querySelector("#modal-content").classList.remove("gryffindor");
    document.querySelector("#modal-content").classList.remove("slytherin");
    document.querySelector(".house-billede").src = "images/rav.png";
  }
  //        Man skal kalde på billedet inde i mappen, og derfor skal det laves ligesom det fornede.

  modal.querySelector("button").addEventListener("click", skjulModal);
}
function skjulModal() {
  modal.classList.remove("vis");
}

function countStudents() {
  const countExpelled = arrayOfExpelled.length;
  document.querySelector("#expelled_counter").textContent = countExpelled;
}
