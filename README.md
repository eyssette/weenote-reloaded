# Weenote-reloaded

Weenote-reloaded est un fork de [weenote](https://github.com/jed/weenote).

## Le principe

L'idée initiale est conservée : il s'agit de proposer un outil simple pour pouvoir transformer une page HTML en un diaporama.

- Chaque élément enfant de `body`devient une page automatiquement ajustée pour s'adapter à la fenêtre.
- On peut naviguer dans le document avec les flèches ou en appuyant à droite ou à gauche d'un écran tactile.

## Les ajouts par rapport au projet initial

Par rapport au script initial, il propose :

1. Une réécriture et optimisation du code.
2. La possibilité de démarrer le diapo en appuyant sur une touche (`s`ou `p`) ou sur un élément auquel on a appliqué la classe `startSlides`.
3. Un thème par défaut
4. Un meilleur affichage de plusieurs éléments : les balises codes et math (qui sont redimensionnées à l'aide de [textFit](https://github.com/STRML/textFit)), les titres avec des mots longs.
