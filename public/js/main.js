function printlayer(layer) {

    var gen = window.open(",'name,");
    var laye = document.getElementById(layer);
    gen.document.write(laye.innerHTML.replace("Print Me"));


    gen.print();
    gen.close();
}




document.body.classList.add(localStorage.getItem("pageColor") || "white")


var el = document.querySelectorAll(".color-switcher li");
var classesList = [];

for (var i = 0; i < el.length; i++) {

    classesList.push(el[i].getAttribute("data-color"));
    el[i].addEventListener('click', function() {
        document.body.classList.remove(...classesList);
        document.body.classList.add(this.getAttribute("data-color"));

        localStorage.setItem("pageColor", this.getAttribute("data-color"));


    }, false);

}
/* si tu veux enlever le theme de couleur et revenir a l'original enleve le dernier commentaire Linge 35*/
// localStorage.removeItem("pageColor");

