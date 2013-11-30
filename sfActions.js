

/*
------------------------ ---------------------- --------------- 
sfActions
An Action Sheet javascript microlibrary

sfActions.ask is the main method with two arguments:
options - possible value are:
	- backgroundClass - this generally takes the full screen and can be transparent or semitransparent - the two existing classes are: sfBackgroundTrans, sfActbackgroundGrey (default)
	- innerBoxClass - default:sfActinnerBox
	- innerBoxAlign ("top","bottom","middle")
	- headerTxt
	- headerClass
	- mainTxt
	- mainTxtClass
	- dontFade (dont use fade in and fade out)
	- useOnclicks (generally you want this for testing on a laptop.. for phonegap / touch, this would be set to false
	- forceChoice (pressing on backgound doesnt take action sheet away)
	- position: Can be top-left or botton-right (... center-center willl ba added later)


buttons - an array, with each button an object with:
	- bText:
	- bCallback
	- bCallBackArgs (a list of arguments to be applied to the callback)
	- bClass:
	- bId (defaults to "sfActionsButtNum-"+ position in list
	- bTouchedClass (class when button is touched)
	- noBorder: if there is no header nor any main text, you can use this to remove the borders from the 0th button without having to define a new class. (Of course this can be applied to any other button too)
-------- ----------- ------------- ----------- ----------

sfActions.showing - just a flag set to true when the action sheet is showing.
*/
var sfActions = {};

sfActions.ask = function(options, buttons) {
	sfActions.init();
	sfActions.showing = true;
	sfActions.doFadeIn('sfActionsOuter', options.dontFade)
	
	var backgroundOuter = document.createElement('div');
	backgroundOuter.id = "sfActionsBg";
	backgroundOuter.className = options.backgroundClass || "sfActbackgroundGrey";
	if (!options.forceChoice) {
		if (options.useOnclicks) {
			backgroundOuter.onclick=sfActions.close;
		} else {
			backgroundOuter.addEventListener('touchstart', function (evt) {
				sfActions.lastTouch=evt.touches[0].target.id 
			},false)
			backgroundOuter.addEventListener('touchmove', function (evt) {
				if (evt.touches[0].target.id != sfActions.lastTouch) {
					sfActions.lastTouch = null;
				}
			},false)
			backgroundOuter.addEventListener('touchend', function (evt) {sfActions.buttIsPressed();},false)
		}
			
	}
	$('sfActionsOuter').appendChild(backgroundOuter)

	var sfActionsInner = document.createElement('div');
	sfActionsInner.id = "sfActionsInner";
	$('sfActionsOuter').appendChild(sfActionsInner);
	sfActionsInner.className = options.innerBoxClass || "sfActinnerBox floatl";
	
	var sfHeader = document.createElement('div');
	sfHeader.className = options.headerClass || "sfActHeader";
	if (options.headerTxt) {
		sfHeader.innerHTML = options.headerTxt;
	} 
	sfActionsInner.appendChild(sfHeader);

	if (options.mainTxt) {
		var sfActMainTxt = document.createElement('div');
		sfActMainTxt.className = options.mainTxtClass || "mainTxt";
		sfActMainTxt.innerHTML = options.mainTxt;
		sfActionsInner.appendChild(sfActMainTxt);
	}
	
	var buttParam, buttDiv;
	sfActions.dontFade= options.dontFade || false;
	sfActions.buttons={};
	for (var i=0; i<buttons.length; i++) {
		buttParam = buttons[i];
		buttDiv = document.createElement('div');
		buttDiv.id = buttParam.bId || "sfActionsButtNum-"+i;
		buttDiv.innerHTML = buttParam.bText || "";
		buttDiv.className = buttParam.bClass || "sfActbutt";
		if (buttParam.noBorder) {
			buttDiv.style.border="none";
		}
		sfActionsInner.appendChild(buttDiv);

		sfActions.buttons[buttDiv.id]={'bCallback':buttParam.bCallback, 'bCallBackArgs':buttParam.bCallBackArgs, 'bClass':buttParam.bClass, 'bTouchedClass':buttParam.bTouchedClass}
		//buttDiv.buttonNum=i;
		//buttDiv.bCallback = buttParam.bCallback;
		//buttDiv.bCallBackArgs = buttParam.bCallBackArgs;
		if (options.useOnclicks) {
			sfActions.useOnclicks = true;
			buttDiv.onclick=sfActions.buttIsClicked;
		} else {
			buttDiv.addEventListener('touchstart', function (evt) {
				this.className=(sfActions.buttons[this.id].bTouchedClass? sfActions.buttons[this.id].bTouchedClass : 'sfActbuttTouched'); 
				sfActions.lastTouch=evt.touches[0].target.id ;
			},false)
			buttDiv.addEventListener('touchmove', function (evt) {
				var endTargetId = document.elementFromPoint(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY).id;
				if (sfActions.lastTouch && endTargetId != sfActions.lastTouch) {
					this.className = sfActions.buttons[evt.touches[0].target.id].bClass || "sfActbutt";
					sfActions.lastTouch = null;
				}
			},false)
			buttDiv.addEventListener('touchend', function (evt) {
				sfActions.buttIsPressed();
			},false)
		}
	}
	if (options.position) {
		var position = options.position.split('-');
		if (position[0] == "bottom" || position[0] == "top") {
			sfActionsInner.style[position[0]]="10px"
		}
		if (position[1] == "right" || position[1] == "left") {
			sfActionsInner.style[position[1]]="10px"
		}
	}
}
sfActions.buttIsClicked = function (evt) {
	sfActions.lastTouch = evt.target.id;
	sfActions.buttIsPressed();
}
sfActions.buttIsPressed = function (evt) {
	if (sfActions.lastTouch ) {
		sfActions.close();
		if (sfActions.lastTouch && sfActions.buttons[sfActions.lastTouch].bCallback) {
			sfActions.buttons[sfActions.lastTouch].bCallback.apply(undefined, sfActions.buttons[sfActions.lastTouch].bCallBackArgs)
		}
	}
}

sfActions.init = function() {
	sfActions.buttons={};
	if ($('sfActionsOuter')) {
		$('sfActionsOuter').innerHTML="";
		$('sfActionsOuter').style.display = "none";
	} else {
		var bodyDiv = document.getElementsByTagName('body')[0]; 
		outerWrapDiv = document.createElement('div');
		outerWrapDiv.id = "sfActionsOuter";
		outerWrapDiv.style.display = "none";
		bodyDiv.appendChild(outerWrapDiv);
		outerWrapDiv.className="sfActionsFadeInit";
	}
}

sfActions.close = function() {
	sfActions.doFadeOut('sfActionsOuter', 0, sfActions.dontFade);
	sfActions.showing = false;
	setTimeout(function () {
		removeChildren($('sfActionsOuter'))
	}, 200);
}

sfActions.doFadeIn = function(divID, dontfade) {
	$('sfActionsOuter').style.display="block";
	if (!dontfade) {
		setTimeout(function () {
			$(divID).className="sfActionsFadein";
		}, 50);
	}
}

sfActions.doFadeOut = function(divID, timer, dontfade) {
	if (!dontfade) {
		$(divID).className="sfActionsFadeout";
		timer = (timer || 300)
	} else {
		timer=0;
	}
	setTimeout(function () {
		$(divID).style.display="none";
	}, timer);
}

var $ = function(aDivId) {
	return document.getElementById(aDivId);
}
var removeChildren = function (aNode) {
	if (aNode) {
		while (aNode.firstChild) {
			removeChildren(aNode.firstChild);
			aNode.removeChild(aNode.firstChild);
		}
	} else {
		console.log('potential error removing children of null.')
	}
}