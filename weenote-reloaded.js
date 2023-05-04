var auto = false; // Mettre ce paramètre sur "true" pour afficher automatiquement le diaporama. Sinon le déclenchement se fait en appuyant sur la touche "p" ou "s" ou en cliquant sur un élément de classe "startSlides"
var start = false;
var position = 1;
var slide;
var slides = {};

// On utilise textFit pour les éléments code et math
// Source : https://github.com/STRML/textFit
(function(root,factory){"use strict";if(typeof define==="function"&&define.amd){define([],factory)}else if(typeof exports==="object"){module.exports=factory()}else{root.textFit=factory()}})(typeof global==="object"?global:this,function(){"use strict";var defaultSettings={alignVert:false,alignHoriz:false,multiLine:false,detectMultiLine:true,minFontSize:6,maxFontSize:80,reProcess:true,widthOnly:false,alignVertWithFlexbox:false};return function textFit(els,options){if(!options)options={};var settings={};for(var key in defaultSettings){if(options.hasOwnProperty(key)){settings[key]=options[key]}else{settings[key]=defaultSettings[key]}}if(typeof els.toArray==="function"){els=els.toArray()}var elType=Object.prototype.toString.call(els);if(elType!=="[object Array]"&&elType!=="[object NodeList]"&&elType!=="[object HTMLCollection]"){els=[els]}for(var i=0;i<els.length;i++){processItem(els[i],settings)}};function processItem(el,settings){if(!isElement(el)||!settings.reProcess&&el.getAttribute("textFitted")){return false}if(!settings.reProcess){el.setAttribute("textFitted",1)}var innerSpan,originalHeight,originalHTML,originalWidth;var low,mid,high;originalHTML=el.innerHTML;originalWidth=innerWidth(el);originalHeight=innerHeight(el);if(!originalWidth||!settings.widthOnly&&!originalHeight){if(!settings.widthOnly)throw new Error("Set a static height and width on the target element "+el.outerHTML+" before using textFit!");else throw new Error("Set a static width on the target element "+el.outerHTML+" before using textFit!")}if(originalHTML.indexOf("textFitted")===-1){innerSpan=document.createElement("span");innerSpan.className="textFitted";innerSpan.style["display"]="inline-block";innerSpan.innerHTML=originalHTML;el.innerHTML="";el.appendChild(innerSpan)}else{innerSpan=el.querySelector("span.textFitted");if(hasClass(innerSpan,"textFitAlignVert")){innerSpan.className=innerSpan.className.replace("textFitAlignVert","");innerSpan.style["height"]="";el.className.replace("textFitAlignVertFlex","")}}if(settings.alignHoriz){el.style["text-align"]="center";innerSpan.style["text-align"]="center"}var multiLine=settings.multiLine;if(settings.detectMultiLine&&!multiLine&&innerSpan.scrollHeight>=parseInt(window.getComputedStyle(innerSpan)["font-size"],10)*2){multiLine=true}if(!multiLine){el.style["white-space"]="nowrap"}low=settings.minFontSize;high=settings.maxFontSize;var size=low;while(low<=high){mid=high+low>>1;innerSpan.style.fontSize=mid+"px";if(innerSpan.scrollWidth<=originalWidth&&(settings.widthOnly||innerSpan.scrollHeight<=originalHeight)){size=mid;low=mid+1}else{high=mid-1}}if(innerSpan.style.fontSize!=size+"px")innerSpan.style.fontSize=size+"px";if(settings.alignVert){addStyleSheet();var height=innerSpan.scrollHeight;if(window.getComputedStyle(el)["position"]==="static"){el.style["position"]="relative"}if(!hasClass(innerSpan,"textFitAlignVert")){innerSpan.className=innerSpan.className+" textFitAlignVert"}innerSpan.style["height"]=height+"px";if(settings.alignVertWithFlexbox&&!hasClass(el,"textFitAlignVertFlex")){el.className=el.className+" textFitAlignVertFlex"}}}function innerHeight(el){var style=window.getComputedStyle(el,null);return el.clientHeight-parseInt(style.getPropertyValue("padding-top"),10)-parseInt(style.getPropertyValue("padding-bottom"),10)}function innerWidth(el){var style=window.getComputedStyle(el,null);return el.clientWidth-parseInt(style.getPropertyValue("padding-left"),10)-parseInt(style.getPropertyValue("padding-right"),10)}function isElement(o){return typeof HTMLElement==="object"?o instanceof HTMLElement:o&&typeof o==="object"&&o!==null&&o.nodeType===1&&typeof o.nodeName==="string"}function hasClass(element,cls){return(" "+element.className+" ").indexOf(" "+cls+" ")>-1}function addStyleSheet(){if(document.getElementById("textFitStyleSheet"))return;var style=[".textFitAlignVert{","position: absolute;","top: 0; right: 0; bottom: 0; left: 0;","margin: auto;","display: flex;","justify-content: center;","flex-direction: column;","}",".textFitAlignVertFlex{","display: flex;","}",".textFitAlignVertFlex .textFitAlignVert{","position: static;","}"].join("");var css=document.createElement("style");css.type="text/css";css.id="textFitStyleSheet";css.innerHTML=style;document.body.appendChild(css)}});

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
		if (!auto && (e.key === "p" || e.key ==="s")) {
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
			smallScreen ? i = Math.min(i, 80) : i = Math.min(i, 150); // Pour les paragraphes et les blockquotes, la taille maximum de la police est 150 sur grand écran, 50 sur petit écran
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

	// On ajuste la taille de police pour les titres en cas de mots longs dans le titre
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

		// Pour les éléments code et math : on utilise textFit
		var codeElement = document.getElementsByTagName("pre")
		if (codeElement) {textFit(codeElement,{multiLine: true});}
		var mathElement = document.querySelectorAll(".math.display")
		if (mathElement) {textFit(mathElement,{multiLine: true, maxFontSize: 150});}
		
	})();
}
