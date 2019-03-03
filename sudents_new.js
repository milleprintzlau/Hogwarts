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
let thisBloodList;

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
  House: "-student House-",
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
    this.House = studentData.House;
    this.image = this.Lastname + "_" + this.Firstname.substring(0, 1) + ".png";

    this.Expelled = false;
    this.bloodstatus = this.Lastname;
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
  console.log("getJsonFam");
  let JsonFam = await fetch("http://petlatkea.dk/2019/hogwarts/families.json");
  let families = await JsonFam.json();
  studentObject(students, families);
  checkBloodStatus(lastname);
}

function checkBloodStatus(lastname) {
  let pureBlood;
  let halfBlood;
  let muggleBlood;

  if (lastname === "Wienberg") {
    pureBlood = "Pure";
  }

  thisBloodList.pure.forEach(student => {
    if (student === lastname) {
      let randomNumber = Math.random();
      if (randomNumber < 0.49) {
        pureBlood = "Muggle";
      } else {
        pureBlood = "Half";
      }
    } else {
      muggleBlood = "Pure";
    }
  });

  thisBloodList.half.forEach(student => {
    if (student === lastname) {
      halfBlood = "Pure";
    }
  });
  return pureBlood || halfBlood || muggleBlood;
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

  activeArray = arrayOfStudents;
  addIdToStudents();

  createMille();
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
  return idMade.substring(0, 7);
}

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
    alert("No!");
  }
}

function exitInSq(StudentId) {
  console.log("exitInSq");

  let objIndex = arrayOfStudents.findIndex(obj => obj.id === StudentId);
  let inSquadStudent = arrayOfStudents[objIndex];
  arrayOfInSquad.splice(inSquadStudent);
  arrayOfStudents[objIndex].inSquad = false;
  activeArray = arrayOfStudents;
  filterStudents();
}

// function EnrolledButton() {
//   console.log("EnrolledButton");
//   activeArray = arrayOfStudents;

//   housefilter = "All";
//   document.querySelector("#Enrolled").classList.remove("off");
//   document.querySelector("#Expelled").classList.remove("on");
//   document.querySelector("#Expelled").classList.add("off");
//   filterStudents();
// }

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
        return student.House === housefilter;
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
  sortBy = "House";
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
      if (a.House < b.House) {
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

  modal.querySelector("[data-modalbloodstatus]").textContent =
    person.bloodstatus;

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
