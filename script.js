let divGrille = document.getElementById("grille");
let nbLignes = 4;
let nbColonnes = 4;
let tabGrille = [];
let tabZeros = [];

document.addEventListener("keyup", (e) => {
  if (e.keyCode == "38") {
    // up arrow
    // on tourne la grille d'1/4 de tour pour pouvoir utilise la fonction
    // de déplacement "à droite"
    // on fait 3/4 tour après pour revenir à la normale
    tourADroite(1);
    deplacerADroite();
    tourADroite(3);
    console.log("up");
  } else if (e.keyCode == "40") {
    // down arrow
    tourADroite(3);
    deplacerADroite();
    tourADroite(1);
    console.log("down");
  } else if (e.keyCode == "37") {
    // left arrow
    tourADroite(2);
    deplacerADroite();
    tourADroite(2);
    console.log("left");
  } else if (e.keyCode == "39") {
    // right arrow
    deplacerADroite();
    console.log("right");
  }
  //----------
  listerLesZeros();
  tirerNouveauBloc();
  dessinerGrille();
});

function initGrille() {
  let newL = [];
  for (let l = 0; l < nbLignes; l++) {
    let newC = [];
    for (let c = 0; c < nbColonnes; c++) {
      // construction de la grille
      let divTuile = document.createElement("div");
      divTuile.setAttribute("id", "tuileL" + l + "C" + c);
      divTuile.className = "tuile";
      //divTuile.style.backgroundColor = "#EEE4DA";
      divGrille.appendChild(divTuile);
    }
    //tabGrille.push(newC);
  }
  console.log("----------");
  console.log(tabGrille);
  console.log("----------");
  tabGrille = [
    [2, 2, 0, 4],
    [0, 4, 0, 8],
    [0, 0, 4, 2],
    [8, 2, 0, 0],
  ];
}

function dessinerGrille() {
  //document.getElementById("tuileL2C2").value = "58";
  for (let l = 0; l < 4 /*tabGrille.length*/; l++) {
    for (let c = 0; c < 4 /*tabGrille[l].length*/; c++) {
      let divTuile = document.getElementById("tuileL" + l + "C" + c);
      // divTuile.textContent = tabGrille[l][c];
      divTuile.textContent = tabGrille[l][c] == 0 ? null : tabGrille[l][c];
    }
  }
}

function tourADroite(nbTours) {
  console.log(nbTours);
  console.log("tabGrille");
  console.log(tabGrille);
  let newGrille = [];
  newGrille = tabGrille;
  for (let numTour = 1; numTour <= nbTours; numTour++)
    newGrille = newGrille.map((row, i) =>
      row.map((val, j) => newGrille[newGrille.length - 1 - j][i])
    );
  console.log("newGrille");
  console.log(newGrille);
  tabGrille = newGrille;
}

function SupprimerZeroADroite(ligne, colonne) {
  if (tabGrille[ligne][colonne] == 0) {
    tabGrille[ligne].splice(colonne, 1);
    tabGrille[ligne].unshift(null);
    SupprimerZeroADroite(ligne, colonne);
  } else if (colonne - 1 >= 0 && tabGrille[ligne][colonne - 1] != null) {
    SupprimerZeroADroite(ligne, colonne - 1);
  }
}

function SommeADroite(ligne, colonne) {
  console.log("fonction somme" + ligne);
  if (colonne >= 0 && tabGrille[ligne][colonne] != null) {
    if (tabGrille[ligne][colonne] == tabGrille[ligne][colonne - 1]) {
      tabGrille[ligne][colonne] = tabGrille[ligne][colonne] * 2;
      tabGrille[ligne].splice(colonne - 1, 1);
      tabGrille[ligne].unshift(null); //nouvelle cellule à gauche du tableau
      SommeADroite(ligne, colonne - 2);
    } else {
      SommeADroite(ligne, colonne - 1);
    }
  }
}

function deplacerADroite() {
  console.log("test");
  for (let ligne = 0; ligne < nbLignes; ligne++) {
    SupprimerZeroADroite(ligne, nbColonnes - 1);
    SommeADroite(ligne, nbColonnes - 1);
  }
}

function listerLesZeros() {
  tabZeros = [];
  for (let i = 0; i < nbLignes; i++) {
    for (let j = 0; j < nbColonnes; j++) {
      if (tabGrille[i][j] == 0 || tabGrille[i][j] == null) {
        tabZeros.push({ i: i, j: j });
        tabGrille[i][j] = 0;
      }
    }
  }
}

function tirerNouveauBloc() {
  randomSurTabZeros = Math.floor(Math.random() * (tabZeros.length + 1));
  testNew4 = Math.floor(Math.random() * 10) + 1; // entre 1 et 10
  cellNew2ou4 = {
    i: tabZeros[randomSurTabZeros].i,
    j: tabZeros[randomSurTabZeros].j,
  };
  tabGrille[cellNew2ou4.i][cellNew2ou4.j] = testNew4 == 10 ? 4 : 2;
}

/** main **********/
initGrille();
listerLesZeros();
dessinerGrille();
