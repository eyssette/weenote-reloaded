var auto = false; // Mettre ce paramètre sur "true" pour afficher automatiquement le diaporama. Sinon le déclenchement se fait en appuyant sur la touche "p" ou en cliquant sur un élément de classe "startSlides"
var start = false;
var position = 1;
var slide;
var slides = {};

if (auto) { // Pour éviter l'affichage du contenu initial si le déclenchement est configuré sur "auto", il faut masquer ce contenu.
  // Attention : cela suppose de charger le script après la feuille de style
	var defaultStylesheet = document.styleSheets[0];
	if (defaultStylesheet) {
		defaultStylesheet.insertRule(
			"html:not(.slides) {display:none}",
			defaultStylesheet.cssRules.length
		);
	}
}

// Event Listeners

document.addEventListener("DOMContentLoaded", load);
document.addEventListener("keydown", handleKeydown);
document.addEventListener("touchstart", handleTouchstart);

// Fonctions pour les event listeners

function load() {
	if (auto) {
		slideStart();
	} else {
		var startSlides = document.querySelectorAll(".startSlides");
		for (var i = 0; i < startSlides.length; i++) {
			startSlides[i].addEventListener("click", function (e) {
				if (!start) {
					slideStart();
				}
			});
		}
	}
}

const FORWARD = 1;
const BACKWARD = -1;
const keyToSlideDirection = {
	ArrowRight: FORWARD,
	ArrowLeft: BACKWARD,
	PageDown: FORWARD,
	PageUp: BACKWARD,
	ArrowUp: BACKWARD,
	ArrowDown: FORWARD,
};

function handleKeydown(e) {
	if (!start) {
		if (!auto && e.key === "p") {
			slideStart();
		}
	} else {
		if (!auto && (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27)) {
			setTimeout(function () {
				location.reload();
			}, 100);
		} else {
			position = slide + keyToSlideDirection[e.key];
			if (position in slides) location.hash = position;
		}
	}
}

function handleTouchstart(e) {
	if (e.target.href) return;
	var position = slide + (e.touches[0].pageX > innerWidth / 2 ? 1 : -1);
	if (position in slides) location.hash = position;
}

// Fonctions pour calculer le plus long mot d'un élément afin d'ajuster la taille de police en cas de mot très long (qui pourrait dépasser du cadre)

function longer(champ, contender) {
	return contender.length > champ.length ? contender : champ;
}

function longestWord(str) {
	var words = str.split(" ");
	return words.reduce(longer);
}

// Fonction de calcul des styles pour chaque élément

var smallScreen = false

function calculateStyles(el) {
	var style = el.style;
	var i = 300; // Taille de police maximum
	var top;
	var left;

	if (window.innerWidth < 1400) {
		i = 100; // Pour les petits écrans, la taille maximum de la police est : 100
		smallScreen = true;
	}

	style.display = "inline";
	style.fontSize = i + "px";
	style.position = "absolute";

	while (true) {
		if (!el.textContent) break; // S'il n'y a pas de contenu texte, il ne faut pas chercher la taille de police optimale !
		if (el.nodeName === "P" || el.nodeName === "BLOCKQUOTE") {
			smallScreen ? i = Math.min(i, 80) : i = Math.min(i, 150); // Pour les paragraphes, la taille maximum de la police est 150 sur grand écran, 50 sur petit écran
		}
		left = innerWidth - el.offsetWidth;
		top = innerHeight - el.offsetHeight - 60; // Petit décalage vers le haut

		if ((top > 0 && left > 0) || i < 10) break; // Taille de police minimum : 10

		style.fontSize = (i -= i * 0.05) + "px";
	}

	style.display = "block";
	style.top = top / 2 + "px";
	style.left = left / 2 + "px";

	tagName = el.tagName;

	if ((
		tagName == "H1" ||
		tagName == "H2" ||
		tagName == "H3" ||
		tagName == "H4" ||
		tagName == "H5" ||
		tagName == "H6"
		) && !smallScreen
	) {
		style.fontSize = i - 40 + "px";
		longestWordLength = longestWord(el.textContent).length;
		if (longestWordLength > 12) {
			style.fontSize = i - 70 + "px";
		}
		if (longestWordLength > 16) {
			style.fontSize = i - 100 + "px";
		}
	}

	// Enregistre les styles calculés pour cet élément
	el._styles = {
		display: style.display,
		fontSize: style.fontSize,
		position: style.position,
		top: style.top,
		left: style.left,
	};
}

// Démarrage des slides

function slideStart() {
	start = true;
	var body = document.body;
	var html = document.getElementsByTagName("html")[0];
	html.classList.add("slides");

	for (var el, count = 0; (el = body.firstChild); ) {
		if (el.nodeType == 1) {
			calculateStyles(el);
			slides[++count] = el;
		}
		body.removeChild(el);
	}

	body.appendChild(document.createComment(""));

	!(function sync() {
		setTimeout(sync, 10);

		var next = 0 | location.hash.match(/\d+/);

		if (slide == next) return;

		next = Math.max(Math.min(count, next), 1);
		next = slides[(location.hash = slide = next)];

		body.replaceChild(next, body.firstChild);

		// Applique les styles enregistrés pour cet élément
		var styles = next._styles;
		next.style.display = styles.display;
		next.style.fontSize = styles.fontSize;
		next.style.position = styles.position;
		next.style.top = styles.top;
		next.style.left = styles.left;
	})();
}
