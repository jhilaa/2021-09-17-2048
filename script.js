let divGrille = document.getElementById("grille");
let nbLignes = 4;
let nbColonnes = 4;
let tabGrille = [];
let tabZeros = [];

// construction de la grille html
function initGrille() {
  let newL = [];
  for (let l = 0; l < nbLignes; l++) {
    let newC = [];
    for (let c = 0; c < nbColonnes; c++) {
      let divTuile = document.createElement("div");
      divTuile.setAttribute("id", "tuileL" + l + "C" + c);
      divTuile.className = "tuile";
      divGrille.appendChild(divTuile);
    }
  }
  // objet grille qu'on va manipuler en js
  tabGrille = [
    [2, 2, 0, 4],
    [0, 4, 0, 8],
    [0, 0, 4, 2],
    [8, 2, 0, 0],
  ];
}

// dessine la grille html en fonction du tableau tabGrille
function dessinerGrille() {;
  for (let l = 0; l < tabGrille.length; l++) {
    for (let c = 0; c < tabGrille[l].length; c++) {
      let divTuile = document.getElementById("tuileL" + l + "C" + c);
      // si la valeur dans la cellule vaut 0 on n'affiche rien
      divTuile.textContent = tabGrille[l][c] == 0 ? null : tabGrille[l][c];
      // on change la class en fonction de la valeur de la case
      const cls = ["c2", "c4", "c8", "c16", "c32", "c64", "c128", "c256", "c512"];
      divTuile.classList.remove(...cls);
      divTuile.classList.add("c"+tabGrille[l][c]);
    }
  }
}

// rotation de la grille pour n'avoir à gérer que des mouvements vers la droite
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

// supprime les 0 de chaque ligne pour faire se déplacer les autres chiffres vers la droite
// et on ajoute des cases à null à gauche pour compenser (pas des 0 pour ne pas boucler sur la ligne indéfiniment) 
function SupprimerZeroADroite(ligne, colonne) {
  if (tabGrille[ligne][colonne] == 0) {
    tabGrille[ligne].splice(colonne, 1);
    tabGrille[ligne].unshift(null);
    SupprimerZeroADroite(ligne, colonne);
  } else if (colonne - 1 >= 0 && tabGrille[ligne][colonne - 1] != null) {
    SupprimerZeroADroite(ligne, colonne - 1);
  }
}

// si 2 cases sont égales, on fait la somme sur la case de droite
function SommeADroite(ligne, colonne) {
  if (colonne >= 0 && tabGrille[ligne][colonne] != null) {
    if (tabGrille[ligne][colonne] == tabGrille[ligne][colonne - 1]) {
      tabGrille[ligne][colonne] = tabGrille[ligne][colonne] * 2;
      tabGrille[ligne].splice(colonne - 1, 1); //supprime la cellule dont on vient de se servir pour faire  l'addition
      tabGrille[ligne].unshift(null); //nouvelle cellule à gauche du tableau
      SommeADroite(ligne, colonne - 2);
    } else {
      SommeADroite(ligne, colonne - 1);
    }
  }
}

// fonction générale qui lance les 2 fonctions ci dessous
function deplacerADroite() {
  console.log("test");
  for (let ligne = 0; ligne < nbLignes; ligne++) {
    SupprimerZeroADroite(ligne, nbColonnes - 1);
    SommeADroite(ligne, nbColonnes - 1);
  }
}

// on fait la liste des 0 dans 1 tableau pour tirer "au sort" celles qu'on va remplacer par un 2 ou un 4 à chaque début de tour
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

// tire le bloc vide dans lequel on va mettre un nouveau 2 ou un 4
function tirerNouveauBloc() {
  randomSurTabZeros = Math.floor(Math.random() * (tabZeros.length + 1)); // nombre au hazard entre 1 et la taille du tableau des 0
  testNew4 = Math.floor(Math.random() * 10) + 1; // chiffre entre 1 et 10 pour savoir si on va mettre un 4 au lieu d'un 2 (1 chance sur 10)
  cellNew2ou4 = { // coordonnées de la cellule dont on va remplacer le 0 par un 2 ou un 4
    i: tabZeros[randomSurTabZeros].i,
    j: tabZeros[randomSurTabZeros].j,
  };
  tabGrille[cellNew2ou4.i][cellNew2ou4.j] = testNew4 == 10 ? 4 : 2;
}

/** main **********/
initGrille();
listerLesZeros();
dessinerGrille();

//la suite passe par les evenements
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
