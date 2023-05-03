var start = false;
var position = 1;
var slide;
var slides = {};

// Event Listeners

document.addEventListener("DOMContentLoaded", function () {
	var startSlides = document.querySelectorAll(".startSlide");
	for (var i = 0; i < startSlides.length; i++) {
		startSlides[i].addEventListener("click", function (e) {
			if (!start) {
				slideStart();
			}
		});
	}
});

document.addEventListener("keydown", handleKeydown);
document.addEventListener("touchstart", handleTouchstart);

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
		if (e.key === "p") {
			slideStart();
		}
	} else {
		if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
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

// Fonction de calcul des styles pour chaque élément

function calculateStyles(el) {
	var style = el.style;
	var i = 300; // Taille de police maximum
	var top;
	var left;

	style.display = "inline";
	style.fontSize = i + "px";
	style.position = "absolute";

	while (true) {
		if (!el.textContent) break // S'il n'y a pas de contenu texte, il ne faut pas chercher la taille de police optimale !
		// Pour les paragraphes, la taille maximum de la police est 150
		if (el.nodeName === "P" && i > 150) {
			i = 150;
		}
		left = innerWidth - el.offsetWidth;
		top = innerHeight - el.offsetHeight - 60; // Petit décalage vers le haut

		if ((top > 0 && left > 0) || i < 10) break; // Taille de police minimum : 10

		style.fontSize = (i -= i * 0.05) + "px";
	}

	style.display = "block";
	style.top = top / 2 + "px";
	style.left = left / 2 + "px";

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
