var start = false

function slideStart() {
  start = true;
  var body = document.body;
  var html = document.getElementsByTagName( 'html' )[0];
html.classList.add("slides");
  var slides = {};
  var slide;

  // Calcule les styles pour un élément donné
  function calculateStyles(el) {
    var style = el.style;
    var i = 300; // Taille de police maximum
    var top;
    var left;

    style.display = "inline";
    style.fontSize = i + "px";
    style.position = "absolute";

    while (1) {
      // Pour les paragraphes, la taille maximum de la police est 150
      if (el.nodeName =="P" && i>150) {
        i=150
      }
      left = innerWidth - el.offsetWidth;
      top = innerHeight - el.offsetHeight;

      if (top > 0 && left > 0) break;

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
      left: style.left
    };
  }

  for (var el, count = 0; el = body.firstChild;) {
    if (el.nodeType == 1) {
      calculateStyles(el);
      slides[++count] = el;
    }
    body.removeChild(el);
  }

  body.appendChild(document.createComment(""));

  !function sync() {
    document.onkeydown = function(e) {
      if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {location.reload();}
      else {
        var i = slide + keyToSlideDirection[e.key]
        if (i in slides) location.hash = i
      }
    }

    setTimeout(sync, 10);

    var next = 0 | location.hash.match(/\d+/);

    if (slide == next) return;

    next = Math.max(Math.min(count, next), 1);
    next = slides[location.hash = slide = next];

    body.replaceChild(next, body.firstChild);

    // Applique les styles enregistrés pour cet élément
    var styles = next._styles;
    next.style.display = styles.display;
    next.style.fontSize = styles.fontSize;
    next.style.position = styles.position;
    next.style.top = styles.top;
    next.style.left = styles.left;
  }();

  const FORWARD = 1;
  const BACKWARD = -1;
  const keyToSlideDirection = {
    "ArrowRight": FORWARD,
    "ArrowLeft": BACKWARD,
    "PageDown": FORWARD,
    "PageUp": BACKWARD
  };

  document.ontouchstart = function(e) {
    if (e.target.href) return;

    var i = slide + (e.touches[0].pageX > innerWidth / 2 ? 1 : -1);

    if (i in slides) location.hash = i;
  };
};

document.onkeydown = function(e) {
  if (!start && e.key==="p") {slideStart()}
}