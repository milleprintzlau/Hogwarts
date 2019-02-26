let dest = document.querySelector(".data-container");
let students;
let studentsFilter = "all";
document.addEventListener("DOMContentLoaded", hentJson);
function bannerFunction() {
  var x = document.getElementById("myBanner");
  if (x.className === "banner") {
    x.className += " responsive";
  } else {
    x.className = "banner";
  }
}
async function hentJson() {
  let myJson = await fetch("http://petlatkea.dk/2019/students1991.json");
  students = await myJson.json();
  visStudents();
}
document.querySelectorAll(".house-item").forEach(knap => {
  knap.addEventListener("click", filtrering);
});
function filtrering() {
  dest.textContent = "";
  studentsFilter = this.getAttribute("data-house");
  visStudents();
}
function visStudents() {
  let dest = document.querySelector(".data-container"),
    temp = document.querySelector(".data-template");
  //løb personlisten igennem og lav en klon
  students.forEach(students => {
    if (students.house == studentsFilter || studentsFilter == "all") {
      let klon = temp.cloneNode(true).content;
      //indsæt data i klonen
      klon.querySelector(".data-name").textContent = students.fullname;
      klon.querySelector(".data-house").textContent = students.house;
      //placer klon i DOM

      klon.querySelector(".data-name").addEventListener("click", () => {
        visModal(students);
      });

      dest.appendChild(klon);
    }
  });
}
function visModal(students) {
  modal.classList.add("vis");
  modal.querySelector(".modal-house").textContent = students.house;

  modal.querySelector(".modal-navn").textContent = students.fullname;

  //        Man skal kalde på billedet inde i mappen, og derfor skal det laves ligesom det fornede.

  modal.querySelector("button").addEventListener("click", skjulModal);
}
function skjulModal() {
  modal.classList.remove("vis");
}
