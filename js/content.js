/*** File: Content.js

	Config.js File Contains the js code that will be added to the website accessed by the User.
	This allows us to add HTML Content and few more Additional Javscript Functionality to that Particular Website 
	This is how we add Logo / Icon & some Html Content [Name & Category]

*/


function setCertifiedFlag(){
	
	node = document.createElement('div');
	node.setAttribute('class', 'ext-certified-section');

	imgTag = document.createElement("img");
	imgTag.src = chrome.extension.getURL("images/not_known_flag.png");
	imgTag.setAttribute('class', 'ext-certified-flag');
	
	pTag = document.createElement("label");
	pTag.id = "pTag";
	pTag.setAttribute("width", "50");
	pTag.setAttribute("height", "50");
	
	getHostInfo(pTag, imgTag);
	
	node.appendChild(imgTag);
	node.appendChild(pTag);
	document.body.appendChild(node);
}

setCertifiedFlag();

function getHostInfo(pTag, imgTag){
	
	message = { reqMessage: "mainSitename" }

	chrome.runtime.sendMessage( message,
		function(response) {			
			console.log("[Request & Response]: ",  { message, response } );
			if ( response.unknown ) {
				console.log("Response: ", response.host)
				siteHostname = response.host 														// Extract the siteHostname
				pTag.innerHTML = "<b>" + siteHostname + "</b>";
			} else {
				console.log("Response: ", { response });
				siteHostname = response.certifiedHost; 												// Extract the siteHostname
				pTag.innerHTML = "<b>" + response.certifiedFor + ": " + siteHostname + "</b>";
				imgTag.src = chrome.extension.getURL("images/certified_flag.png"); 					// Get Chrome Extension URL
			}
		}
	);
}