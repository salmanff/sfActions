sfActions
=========

action sheet microlibrary

An easy way to show action-sheet-like dialogie with call-forwarding which accepts arguments. For example:
	sfActions.ask({
		'headerTxt':'Sample confirm box title',
		'mainTxt':'sample confirm box explanatory text..',
		'useOnclicks':true, // you need this if you want to try it on a laptop
		'position':'top-right'
	 },[{'bText':'press me to alert',
		'bCallback':alert,
		'bCallBackArgs':['This is the first argument in a list passed to the function for button 1'],
		'bTouchedClass':'sfActbuttTouched'
	 },{
		'bText':'cancel'
	 }
	])


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


Auhor: salmanff
License: MIT License (with attribution)
