// ==========================================================================
//	CiL Viewer Window Popup Management
//		Description: 	These classes represent instances of popup layers,
//						displayed in the viewer window and the controller
//						which has the logic to determine when and how to
//						display them.
//
//		Notes: 	- The class ViewerWindowPopup is a singleton which is
//				  instantiaited at the time the Viewer Window loads.
//
//		Usage:  - Create an instance of the popupLayer class which represents
//				  the popup to be shown. (see docs below for configuration
//				  description)
//				- Register this instance with the ViewerWindowPopup class
//
//		Example:
//			var myConfig = {
//				popupType: 2,
//				popupHTML: popupDIV,
//				popupHeight: 275,
//				popupWidth: 275,
//				popupPriority: priority,
//				popupCloseButton: true,
//				popupCloseButtonText: TXTVW_CLOSE,
//				popupDisplayNow: displayNow,
//				popupUseQueue: useQueue,
//				popupCloseAfterSeconds: displayTime,
//				popupModal: false,
//				popupBorderColor: '#000',
//				popupBorderWidth: '5',
//				popupAllowAutoClose: true,
//				popupAllowAdditionalPopups: false
//			};
//			var myPopupLayer = new popupLayer(myConfig);
//			ViewerWindowPopup.addnew(myPopupLayer);
//
// ==========================================================================




// =======================================================================================================
// = This is a singleton controller which can be used to managed popup layers related to the viewer window
// =======================================================================================================
var ViewerWindowPopup = function() {
	var popups = [];      // array of popup object used to show in layers.
    var popupMaxWidth;
    var popupMaxHeight;
    var popupCloseText;
    var popupContainerID;
    var modalDiv = "popupModalBkgd";
    var popupDiv = "popupDiv";
    var popupTO;
    var popupUseMootools;



	// ======================================
	// = Choose which popup to display next =
	// ======================================
    function selectNextPopup() {
        var maxPriority = -1;
        var nextIndex = -1;
        var activePopups = false;

		// iterate through all of the registered popups to determine
		//		1. Are there any that are active? If so set activePopups = true
		//		2. Identify the index position of the next popup to be shown
		//			-> If a popup has the status `h` then exit and display this one next
        for (var i=0;i<popups.length;i++){
            if (popups[i].getPopupConfig().popupStatus != 'c') {
                activePopups = true;
            }
            if (popups[i].getPopupConfig().popupPriority >= maxPriority && (popups[i].getPopupConfig().popupStatus == 'q' || popups[i].getPopupConfig().popupStatus == 'h')) {
                if (popups[i].getPopupConfig().popupStatus == 'h') {
                    nextIndex = i;
                    break;
                }
                maxPriority = popups[i].getPopupConfig().popupPriority;
                nextIndex = i;
            }
        }

		// If no popups have been found, clean up.
		//		-> 	if no popups exists in the array with a status that wasn't `c` (activePopups)
		//			then call a function to delete the UI DOM and reset the array.
		//		-> 	if we are doing this we exit without any additional processing
        if (nextIndex == -1) {
            if (!activePopups) {
                // nothing active, so lets clean up popup array
				// before cleaning, delete the last div
				// 		NOTE: the delete callback fired from settimeout won't be able to delete the div
				// 		afer the array has been cleared
				deletepopupDivPrivate( popups.length - 1 );
                popups = [];
            }
            return -1;
        }


		// If we've reached this point in the code we know there is another popup to display.
		// determine (via currentLayer) if there are anypopups being shown already.
		// if there are NOT the we can display immediately.  If there are we need to do some other stuff
        var currentIndex = currentLayer();
        if (currentIndex == -1) {
			// no current popups being displayed.  Show the popup at nextIndex
            showNextLayer(nextIndex);
            return nextIndex;
        } else {
			// there is a popup already displayed.  What do we do?
			//		if the popup we want do display is of greater than or equal priority than the currently
			//		displayed popup AND the new popup is configured to display now OR the current
			//		popup allows additionals -> Then we are going to show it
            if ((popups[nextIndex].getPopupConfig().popupPriority >= popups[currentIndex].getPopupConfig().popupPriority
					&& popups[nextIndex].getPopupConfig().popupDisplayNow)
					||  popups[currentIndex].getPopupConfig().popupAllowAdditionalPopups === true) {
				//	If we know that we are going to show it, we determine if it can be shown along with
				//	other popups, or do we need to put the popup currently being shown into the queue
                if (popups[currentIndex].getPopupConfig().popupAllowAdditionalPopups === false) {
                    hideLayer(currentIndex);
                    if (popups[currentIndex].getPopupConfig('popupUseQueue')) {
                        popups[currentIndex].setPopupConfig('popupStatus','h');
                    } else {
                        popups[currentIndex].setPopupConfig('popupStatus','c');
                        ViewerWindowPopup.deletepopupDiv(currentIndex);
                    }
                }
				// show it and return the index value
                showNextLayer(nextIndex);
                return nextIndex;
            } else {
                // can't show this popup, if not queueable, then mark as complete.
                if (popups[nextIndex].getPopupConfig().popupUseQueue === false) {
                    popups[nextIndex].setPopupConfig('popupStatus','c');
                } else {
					// noop?
                }
                return -1;
            }
        }
    }



	// ====================================================================
	// = This routine will show the popup at the index position specified =
	// ====================================================================
    function showNextLayer (index_) {
		// default values / prime the pump
        var popupAllowReposition = true;

		// 	if the popup to be shown has specified that it belongs in an existing DOM element
		//	we get the ID of that element.
		//	Otherwise we are generating a dynamic ID based on the index number
		if (popups[index_].getPopupConfig().popupExistingDiv) {
            var popupDivID = popups[index_].getPopupConfig().popupExistingDiv;
            if (popups[index_].getPopupConfig().popupAllowReposition === false) {
                popupAllowReposition = false;
            }
        } else {
            var popupDivID = popupDiv+index_;
        }


		// get the currentHTML to be displayed.
		if (typeof(popups[index_].getPopupHTML) == 'function') {
            var currHTML = popups[index_].getPopupHTML(popupMaxWidth);
        } else {
            var currHTML = '';
        }

		// 	if the DOM element already exists, we do :
		//		-> specifiy that a new Layer is not necessary (newLayer)
		//		-> if the status is queued and there is HTML we need contnet
		//				other wise we don't
		// 	if the DOM element does not already exist, we specifiy that it's a new layer
		//	AND that we need content
        if (document.getElementById(popupDivID)) {
            var newLayer = false;
            if (popups[index_].getPopupConfig().popupStatus == 'q' && currHTML) {
                var needContent = true;
            } else  {
                var needContent = false;
            }
        } else {
            var newLayer = true;
            var needContent = true;
        }

		// if the popup to be displayed is modal then we flip the modal portion on
		// otherwise we hide it
        if (popups[index_].getPopupConfig().popupModal) {
            document.getElementById(modalDiv).style.display = "inline";
        } else {
            document.getElementById(modalDiv).style.display = "none";
        }


		// 	We have determined that we need content.  So we need to construct this content.
		//	The construction takes things like border colour and width, and whether a close button
		// 	should be displayed into account
        if (needContent) {
			// border colour
            if (popups[index_].getPopupConfig().popupBorderColor) {
                var bordercolor = popups[index_].getPopupConfig().popupBorderColor;
            } else {
                var bordercolor = '#000000';
            }
			// border width
            if (popups[index_].getPopupConfig().popupBorderWidth) {
                var borderwidth = popups[index_].getPopupConfig().popupBorderWidth;
            } else {
                var borderwidth = 10;
            }
			// close button text
            if (popups[index_].getPopupConfig().popupCloseButtonText) {
                var closebuttontext = popups[index_].getPopupConfig().popupCloseButtonText;
            } else {
                var closebuttontext = popupCloseText;
            }
			// close button (show / not show)
            if (popups[index_].getPopupConfig().popupCloseButton) {
                var popupstarthtml = '<div style="background: ' + bordercolor + '; border: 0; margin: 0;" ><div style="position: absolute; z-index: 50; top: 0px; left: 0px;"><a href="#" onClick="javascript: ViewerWindowPopup.closeCurrentLayer(\'' + index_ + '\');return false;" alt="' + closebuttontext + '"><img src="/templates/coveritlive/images/smallclose.gif" width=10 border="0" title="' + closebuttontext + '"/></a></div>';
                var popupendhtml = '<div class="clearingspace" style="background: ' + bordercolor + '; padding: 5px; padding-top: 0px;">&nbsp;&nbsp;<table style="height: 16px;"><tr valign=middle><td><a href="#" onClick="javascript: ViewerWindowPopup.closeCurrentLayer(\'' + index_ + '\');return false;"><img src="/templates/coveritlive/images/icons/close_button.gif" border="0" style="margin-right: 5px;" /></a></td><td><a href="#" onClick="javascript: ViewerWindowPopup.closeCurrentLayer(\'' + index_ + '\');return false;" style="color: #FFFFFF;"><strong>' + closebuttontext + '</strong></a>&nbsp;&nbsp;</td></tr></table></div></div>';
            } else {
                var popupstarthtml = '<div style="background: ' + bordercolor + '; border: 0; margin: 0;" >';
                var popupendhtml = '</div>';
            }

			// ** If we have determined (earlier) that a new layer should be created do that
            if (newLayer) {
                createpopupDiv(index_);
            }

			// popups can specify their content as a sting of HTML or JS DOM.
			// depending on which of these we are running we need to construct the content
			// container slightly differently.
			// finally we update the innerHTML of the container div with the content
            if (typeof currHTML == 'string') {
                var popuphtml = popupstarthtml + '<div id="popupcontent" style="padding: ' + borderwidth + 'px; display: block; background: ' + bordercolor + '; text-align: left; ">' + currHTML + '</div>' + popupendhtml;
            } else {
                var popuphtml = popupstarthtml + '<div id="popupcontent" style="padding: ' + borderwidth + 'px; display: block; background: ' + bordercolor + '; text-align: left; "></div>' + popupendhtml;
            }
            document.getElementById(popupDivID).innerHTML = popuphtml;
        }

		// 	set the opacity on the new div to 0 and it's style to inline
        setOpacity(popupDivID, 0, 0, true);
        document.getElementById(popupDivID).style.display = "inline";

		// 	if we're processing one of the JS DOM types, we append the content into the container
		// 	created above
		if (typeof currHTML != 'string' && needContent) {
		    document.getElementById('popupcontent').appendChild(currHTML);
		}


		// fiddle with the position to get the presentation just right
        if (popupAllowReposition) {
            if (typeof(popups[index_].top) == 'function') {
                var popupTop = popups[index_].top();
            } else {
                var popupTop = 40;
            }
            var currPopupWidth = parseInt(document.getElementById(popupDivID).offsetWidth); // removes the "px" at the end
            if ( currPopupWidth <  100 ) {
                //likely not valid, use popupclass width if available
                if (popups[index_].getPopupConfig().popupWidth) {
                    currPopupWidth = popups[index_].getPopupConfig().popupWidth;
                }
            }
            var divleft = (popupMaxWidth - currPopupWidth) / 2;
            if (divleft < 0) {
                divleft = 0;
            }
            document.getElementById(popupDivID).style.left = divleft+'px';
            document.getElementById(popupDivID).style.top = popupTop+'px';
        }

		// if the popup instance has a launch method, call it
        if (typeof(popups[index_].launch) == 'function') {
            popups[index_].launch();
        }

		// fade the popup in and set it's status to a (active).
		// finally if an automaic close has been setup, configure and set that timeout.
        setOpacity(popupDivID, 0, 1);
        popups[index_].setPopupConfig('popupStatus','a');
        if (popups[index_].getPopupConfig('popupCloseAfterSeconds') && popups[index_].getPopupConfig('popupCloseAfterSeconds') > 0) {
			popupTO = setTimeout("ViewerWindowPopup.closeCurrentLayer('" + index_ + "');",(popups[index_].getPopupConfig('popupCloseAfterSeconds')*1000));
			popups[index_].setPopupConfig('popupTO', popupTO);
        }
        return true;
    }





	// ========================================
	// = Return the currently popped up layer =
	// ========================================
    function currentLayer () {
		// iterate through all of the popups looking for one that meets the following criteria
		//		1. it's state is active `a`
		//		2. it's allowed to auto-close
		//		3. it's configured to NOT allow additional popups
        for (var i=0;i<popups.length;i++){
            if (popups[i].getPopupConfig().popupStatus == 'a'
					&& popups[i].getPopupConfig().popupAllowAutoClose === true
					&& popups[i].getPopupConfig().popupAllowAdditionalPopups === false ) {
                return i;
            }
        }
        return -1;
    }





	// =====================================================================================
	// = Hide either the layer at index position index_, or, the currently displayed layer =
	// =====================================================================================
    function hideLayer (index_) {
		// 	hide the layer at the index poistion of index_, or if index_ is not passed in
		//	hide the layer at the index position of the currentLayer (via currentLayer())
        if (typeof index_ == 'undefined') {
            index_ = currentLayer();
        }

		// nothing to hide so get out of here
        if (index_ == -1) {
            return false;
        }

		// if the item we want to hide is in `active` status then we can run the hide logic
		// The hide logic is as follows:
		//		-> clear any timeout that may auto close the popup
		//		-> determine what the ID of the DOM element containing the popup is
		//		-> set the opacity to 0 (causing a fade)
		//		-> if a modal background id present, get rid of it
		//		-> set the popup instance status to `h` (for hidden)
        if (popups[index_].getPopupConfig().popupStatus == 'a') {
            popupTO = popups[index_].getPopupConfig('popupTO');
            clearTimeout(popupTO);
            if (popups[index_].getPopupConfig().popupExistingDiv) {
                var popupDivID = popups[index_].getPopupConfig().popupExistingDiv;
            } else {
                var popupDivID = popupDiv+index_;
            }

            setOpacity(popupDivID, 1, 0);
            if (popups[index_].getPopupConfig().popupModal) {
                document.getElementById(modalDiv).style.display ='none';
            }
            popups[index_].setPopupConfig('popupStatus','h');
        }
        return true;
    }



	// ==============================================================================
	// = Change the opacity of a DOM element
	// =
	// = Parameters:
	// = 	id_: 			(string) The id of the DOM element to operate on
	// = 	startValue_: 	(float) The starting opactity
	// = 	endValue_:		(float) The ending opacity
	// = 	quick_: 		(bool) do a fade (false[default]) OR just kill it (true)
	// ==============================================================================
    	function setOpacity(id_, startValue_, endValue_, quick_) {

        if (typeof quick_ == 'undefinied') {
            quick_ = false;
        }
        if (popupUseMootools && !quick_) {
            setPopupOpacity = new Fx.Style(id_, 'opacity').start(startValue_, endValue_);
        } else {
            document.getElementById(id_).style.opacity = endValue_;
            document.getElementById(id_).style.filter = 'alpha(opacity=' + endValue_*100 + ')';
        }
    }




	// ==================================================
	// = create a new dom element to display a popup in =
	// ==================================================
    function createpopupDiv (index_) {
		// basically we're creating a new div and appending it to the DOM
        var newdiv = document.createElement("div");
        newdiv.id = popupDiv + index_;
        newdiv.style.backgroundColor = "#000000";
        newdiv.style.position = "absolute";
        newdiv.style.zIndex = "10005";
        newdiv.style.display = "none";
        newdiv.style.margin = "0px auto";
        newdiv.style.top = "0px";
        newdiv.innerHTML = "";
        if (document.getElementById(popupContainerID)) {
            var firstchild = document.getElementById(popupContainerID).firstChild;
            document.getElementById(popupContainerID).insertBefore(newdiv,firstchild);
        } else {
            var firstchild = document.body.firstChild;
            document.body.insertBefore(newdiv,firstchild);
        }
    }




    function deletepopupDivPrivate (index_) {
		try {
        	if (popups[index_].getPopupConfig().popupExistingDiv) {
                //do not delete existing divs
				try {
					document.getElementById(popups[index_].getPopupConfig().popupExistingDiv).innerHTML = '';
				} catch (ex) {
					//noop
				}
                return true;
            } else {
                var popupDivID = popupDiv+index_;
            }
            var deletediv = document.getElementById(popupDivID);
            if (document.getElementById(popupContainerID)) {
                var container = document.getElementById(popupContainerID);
                container.removeChild(deletediv);
            } else {
                document.body.removeChild(deletediv);
            }
            return true;

		}
		catch(ex) {
			return false;
		}
    }







	return {
        init : function(config_) {
            if (document.getElementById(modalDiv)) {
                return true;
            }
            popupMaxWidth = config_.popupMaxWidth;
            popupMaxHeight = config_.popupMaxHeight;
            if (typeof config_.popupCloseText == 'undefined') {
                popupCloseText = 'Close';
            } else {
                popupCloseText = config_.popupCloseText;
            }
            if (typeof config_.popupContainerID == 'undefined') {
                popupContainerID = 'body';
            } else {
                popupContainerID = config_.popupContainerID;
            }
            if (typeof Fx == 'undefined') {
                popupUseMootools = false;
            } else {
                popupUseMootools = true;
            }
            //create veil divs

            var newdiv = document.createElement("div");
            newdiv.id = modalDiv;
            newdiv.style.backgroundColor = "#000000";
            newdiv.style.position = "absolute";
            newdiv.style.zIndex = "5000";
            newdiv.style.display = "none";
            newdiv.style.margin = "0px auto";
            newdiv.style.width = "100%";
            newdiv.style.height = "100%";
            newdiv.style.opacity = 0.65;
            newdiv.style.filter = 'alpha(opacity=65)';
            newdiv.innerHTML = "";
            if (document.getElementById(popupContainerID)) {
                var firstchild = document.getElementById(popupContainerID).firstChild;
                document.getElementById(popupContainerID).insertBefore(newdiv,firstchild);
            } else {
                var firstchild = document.body.firstChild;
                document.body.insertBefore(newdiv,firstchild);
            }

            return true;
        },





        addnew : function(popup_) {
			// if the popup is already displaying then we don't want to display it again
			if (popup_.getPopupConfig("popupID") != false) {
				for (var i=0;i<popups.length;i++) {
					if (popups[i].getPopupConfig('popupID') == popup_.getPopupConfig("popupID")) {
						return;
					}
				}
			}


            //check of popup_ object is valid
            if (typeof(popup_.getPopupConfig) == 'function' && typeof(popup_.setPopupConfig) == 'function' ) {
                popup_.setPopupConfig('popupStatus','q');
                if (popup_.getPopupConfig().popupPriority == 'undefined') {
                    popup_.setPopupConfig('popupPriority',0);
                }
                popups.push ( popup_ );
                selectNextPopup();
                return popups.length-1;
            } else {
                //raise javascript error
                throw(5001);
                return -1;
            }
        },






        selectNextPopup2 : function () {
            selectNextPopup();
        },





		// ==========================================================================
		// = public function called when the current layer is supposed to be closed
		// ==========================================================================
        closeCurrentLayer : function(index_, type_) {
			// if you don't pass an index_ set the value of index to the result
			// of a call to the currentLayer method
            if (typeof index_ == "undefined") {
                var currentIndex = currentLayer();
            } else {
                var currentIndex = index_;
            }

            if (currentIndex == -1) {
                if (typeof type_ != "undefined") {
                    for (var i=0;i<popups.length;i++){
                        if (popups[i].getPopupConfig().popupType == type_
								&& (popups[i].getPopupConfig().popupStatus == 'a'
								|| popups[i].getPopupConfig().popupStatus == 'h')) {
                            hideLayer(i);
                            popups[i].setPopupConfig('popupStatus','c');
                            if (typeof(popups[i].close) == 'function') {
                                popups[i].close();
                            }
                            setTimeout("ViewerWindowPopup.deletepopupDiv(" + i + ");", 500);
                        }
                    }
                    setTimeout("ViewerWindowPopup.selectNextPopup2();", 500);
                }
            } else {
                hideLayer (currentIndex);
                popups[currentIndex].setPopupConfig('popupStatus','c');
                if (typeof(popups[currentIndex].close) == 'function') {
                    popups[currentIndex].close();
                }
                setTimeout("ViewerWindowPopup.deletepopupDiv(" + currentIndex + ");ViewerWindowPopup.selectNextPopup2();", 500);
            }
            return true;
        },



		getPopups : function() {
			return popups;
		},



        deletepopupDiv: function(index_) {
			deletepopupDivPrivate(index_);
        }
	}

}();




// =======================================================================
// = popupLayer(config_)
//		Description: 	Represents an instance of a popup.
//
//		Config:	Options Available
//
//			popupType: ?
//			popupHTML: 					- String of HTML or HTMLDomElement
//			popupHeight: 				- (int) Height in pixels of popup layer
//			popupWidth: 				- (int) Width in pixels of popup layer
// 			popupPriority: 				- (int) Prioirty used when determining ability to replace
//										  existing popups and where to queue popups if using
//										  queuing
//			popupCloseButton: 			- (bool) Display a close button on the bottom of the popup?
//			popupCloseButtonText		- (string) What should the close button say?
//			popupDisplayNow				- (bool) Display immediately.  Only displays now if a popup
//										  with higher priority isn't already showing
//			popupUseQueue				- (bool) Queue for later display if not able to display
//										  immediately
//			popupCloseAfterSeconds		- (int) Number of seconds to display for before automatically
//										  closing
//			popupModal					- (bool) Display a modal background behind popup
//			popupBorderColor			- (string) Border colour of popup
//			popupBorderWidth			- (int) Width of popup border
//			popupAllowAutoClose			- (bool)
//			popupAllowAdditionalPopups	- (bool)
//
// =======================================================================
function popupLayer(config_) {
    var popupConfig = {};     // Configuration Object

    popupConfig = config_;

    return {
        getPopupHTML : function(width_) {
			if (typeof popupConfig.popupHTML != "object") {
	            var html = unescape(popupConfig.popupHTML.replace(/qzzq/g, '"'));
	            if (typeof popupConfig.popupWidth != 'undefined') {
	                if (popupConfig.popupWidth == 400 && width_ < 420) {
	                    var widthratio = (width_/420);
	                    var newwidth = Math.round(popupConfig.popupWidth * widthratio);
	                    var newheight =  Math.round(popupConfig.popupWidth * widthratio);
	                    html = html.replace(/width: 400/g, 'width: ' + newwidth);
	                    html = html.replace(/height: 300/g, 'height: ' + newheight);
	                    popupConfig.popupWidth = newwidth;
	                } else if (popupConfig.popupWidth == 330 && width_ < 350) {
	                    var widthratio = (width_/350);
	                    var newwidth = Math.round(300 * widthratio);
	                    html = html.replace(/width: 300/g, 'width: ' + newwidth);
	                    popupConfig.popupWidth = newwidth + 10;
	                } else if ((width_ - 50) < popupConfig.popupWidth && popupConfig.popupWidth != 401) {
	                    var widthratio = (maxwidth/400);
	                    var newwidth = Math.round(popupConfig.popupWidth * widthratio);
	                    var newheight =  Math.round(popupConfig.popupHeight * widthratio);
                        var count = html.match('/width="'+popupConfig.popupWidth+'"/g');
                        if (count > 0) {
                            html = html.replace('/width="'+popupConfig.popupWidth+'"/g', 'width="'+newwidth+'"');
                            popupConfig.popupWidth = newwidth;
                        }
                        var count = html.match(/width: 300/g);
                        if (count > 0) {
                            html = html.replace(/width: 300/g, 'width: ' + newwidth);
                            popupConfig.popupWidth = newwidth;
                        }
                        html = html.replace('/height="'+popupConfig.popupHeight+'"/g', 'height="'+newheight+'"');
	                }
	            }
				return html;
			} else {
				return popupConfig.popupHTML;
			}

        },



        getPopupConfig : function(param_) {
            if (typeof param_ != 'undefined') {
                if (typeof popupConfig[param_] != 'undefined') {
                    return popupConfig[param_];
                } else {
                    return false;
                }
            } else {
                return popupConfig;
            }
        },



        setPopupConfig : function(param_, value_) {
            popupConfig[param_] = value_;
            return true;
        },



        top : function () {
            if (popupConfig.popupType == 'livevideo') {
                if (document.getElementById('altcast_title')) {
                    return document.getElementById('altcast_title').offsetHeight + 3;
                } else {
                    return 40;
                }
            } else {
                return 40;
            }
        },



        launch : function() {
            if (typeof(os) != 'undefined' && typeof(browser) != 'undefined' && typeof(browserversion) != 'undefined' &&  typeof(document.getElementById('mainchat')) != 'undefined') {
                if ((os == 'mac' && ((browser == 'firefox' && browserversion < 3) || browser == 'camino'))) {
                    document.getElementById('mainchat').style.overflow = "hidden";
                }
            }
            if (typeof(enterprise) != 'undefined' && typeof(orientation) != 'undefined' && typeof(showEvents) != 'undefined') {
                if (popupConfig.popupType == 'livevideo' && (enterprise == 'y' && orientation == 'SBS')) {
                    showEvents ('');
                }
            }
            return true
        },



        close : function() {
            if (typeof(os) != 'undefined' && typeof(browser) != 'undefined' && typeof(browserversion) != 'undefined' &&  typeof(document.getElementById('mainchat')) != 'undefined') {
                if ((os == 'mac' && ((browser == 'firefox' && browserversion < 3) || browser == 'camino'))) {
                    document.getElementById('mainchat').style.overflow = "auto";
                }
            }
            if (typeof(enterprise) != 'undefined' && typeof(orientation) != 'undefined' && typeof(showEvents) != 'undefined') {
                if (popupConfig.popupType == 'livevideo' && (enterprise == 'y' && orientation == 'SBS')) {
                    showEvents ('all');
                }
            }
            return true;
        }
    }
};









// =============================================================================
// = Functions located below this comment pre-existed the introduction of this
// = new popup management functionality.  At present they act as an interface
// = the new functionality allowing it to be included without recoding all of
// = the places which invoked popups in the past.
// =============================================================================

function launchLayer(num, divsrc, divheight, divwidth, timeout) {
    if (num == 4) {
        var myCloseButton = true;
    } else {
        var myCloseButton = false;
    }

    if (num == 5) {
        var myConfig = {
        popupType: num,
        popupExistingDiv: 'modalitem5',
        popupAllowReposition: false,
        popupHTML: divsrc,
        popupWidth: divwidth,
        popupPriority: 5,
        popupUseQueue: true,
        popupBorderColor: '#000000',
        popupAllowAutoClose: false,
        popupAllowAdditionalPopups: true
        };
    } else {
        var myConfig = {
        popupType: num,
        popupHTML: divsrc,
        popupHeight: divheight,
        popupWidth: divwidth,
        popupPriority: 5,
        popupCloseButton: myCloseButton,
        popupCloseButtonText: TXTVW_CLOSE,
        popupDisplayNow: false,
        popupUseQueue: true,
        popupCloseAfterSeconds: 0,
        popupModal: false,
        popupBorderColor: '#000000',
        popupBorderWidth: '5',
        popupAllowAutoClose: true,
        popupAllowAdditionalPopups: false
        };
    }
    if (typeof timeout != 'undefined') {
        myConfig.popupCloseAfterSeconds = timeout;
    } else if (num == 2) {
        myConfig.popupCloseAfterSeconds = 20;
    }
    var myPopupLayer = new popupLayer(myConfig);
    ViewerWindowPopup.addnew(myPopupLayer);
}

function closeLayer(num){
    if (typeof num == 'undefined') {
        num = 1;
    }
    ViewerWindowPopup.closeCurrentLayer(-1,num);
}




function madPopupShow(ad_type) {
    if ((custom_ads == 'y' && ad_type == 999) || (curr_event_ads == 'y'  && (ad_type == 2 || ad_type == 3 || ad_type == 6 || ad_type == 7 || ad_type > 10))) {
        if (custom_ads == 'y') {
            var adwidth = parseInt(document.getElementById('madModal').clientWidth);
        } else {
            var adwidth = 300;
        }
        var myConfig = {
        popupType: 'ad',
        popupHTML: '',
        popupExistingDiv: 'madModal',
        popupAllowReposition: true,
        popupHeight: 250,
        popupWidth: adwidth,
        /*popupPriority: 10,*/
		popupPriority: 25,
        popupDisplayNow: true,
        /*popupUseQueue: true,*/
		popupUseQueue: false,
        popupModal: true,
        popupBorderColor: '#000000',
        popupBorderWidth: '0',
        popupAllowAutoClose: true,
        popupAllowAdditionalPopups: false
        };

        if (ad_type > 10 || custom_ads == 'y') { } else {
            myConfig.popupCloseAfterSeconds = 30;
        }
        var myPopupLayer = new popupLayer(myConfig);
        ViewerWindowPopup.addnew(myPopupLayer);
    }
}


function closeMad(closetype) {
    if (custom_ads == 'y' && closetype != 'manual' ) {
        return;
    }
    if (closetype == 'auto' && prerollAdType == 'video') {} else {
        if (prerollAdType != 'video') {
            ViewerWindowPopup.closeCurrentLayer(-1,'ad');
        }
    }

    if (closetype != 'auto' && event_has_titlepage == 'n') {
        ViewerWindowController.goLive();
    }
    if (event_status != 'c' && custom_ads == 'n') {
        madTO = setTimeout('reshowPreRollAd ();', adredotime);
    }
}