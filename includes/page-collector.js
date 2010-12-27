// ==UserScript==
// @name Page collector
// @author Mikael Jansson <mail@mikael.jansson.be>
// @version 1.0.0
// @description Open links in background window on long press.
// @ujs:documentation http://ruzanow.ru/index/0-5
// @ujs:download http://ruzanow.ru/userjs/open-in-background-with-long-press.js
// ==/UserScript==


(function(opera, extension, storage){
var delay = 500;
var timerId = 0;
var clear = function(){if(timerId){clearTimeout(timerId); timerId = 0}};

opera.addEventListener('BeforeEvent.mousedown', function(e){
  var loc = window.location, evt = e.event, target = evt.target;
  if(evt.button == 0 && evt.ctrlKey!=true && evt.shiftKey!=true && evt.altKey!=true){
	timerId = setTimeout(function(){
		var link = target.nodeName.toLowerCase() == 'a' ? target : target.selectSingleNode('ancestor-or-self::*[(local-name()="a" or local-name()="area") and @href]');
		if(link && link.protocol.toLowerCase() != 'javascript:'){
			evt.stopPropagation();
			evt.preventDefault();
			if(link.hash && link.href.replace(link.hash, '') == loc.href.replace(loc.hash, '')){
				loc.hash = link.hash;
			}
			else{
				document.addEventListener('click', function(ev){
					if(ev.target == target){
						ev.stopPropagation();
						ev.preventDefault();
					};
					document.removeEventListener(ev.type, arguments.callee, true);
				}, true);
                var tag = prompt("tag");

                opera.postError("storage = "+storage);

				extension.postMessage(JSON.stringify({url: link.href,
                        parent: window.location.href,
                        tag: tag,
                        storage: storage}));
			}
		}
	}, delay);
  }
}, false);

document.addEventListener('mouseup', clear, false);
document.addEventListener('mousemove', clear, false);
})(window.opera, opera.extension, window.opera.scriptStorage);
