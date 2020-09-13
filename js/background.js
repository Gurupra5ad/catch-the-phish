/*
	background.js:
	Intro:		This is the JavaScript file which handles most of the Chrome API Integration and Interaction
	Location: 	js/background.js
*/

/* DB Connection */
const adapter = new LocalStorage('db')
const db = low(adapter)

/* Used For Url onUpdated */
var currentUrl = [];
var newUrl = [];
var chromeURL = new RegExp("^(chrome(:|-extension:)|file:)");
var mainSitename = new Array();
var blockList = new Array();
var whiteList = new Array();
var certifiedList = new Array();
var hostsList = {};
var error = {};
var isDataInList = false;

console.log("Created Variables Above");
if (blockList == undefined) {
	console.log("Tension!!!!!!!! " , blockList);
} else {
	console.log("Very Big Problem !!!!!!!! " , blockList);
}

/* 	Database Functions 
	Database Write & Delete

	>>>>>>>	Write >>
	db.get(tableMyIdentifier)
		.push({ hostnameKeyword: "example.com", urlKeyword: "" })
		.write();
	
	>>>>>>>	Delete >>
	db.get(tableMyIdentifier)
		.remove({ hostnameKeyword: "example.com", urlKeyword: "" })
		.write();
		
*/


/* Comments Needed: */
function writeToDB(tableMyIdentifier, data) {
	funcName = "Function Called: writeToDB: ";
	console.log(funcName);
	db.get(tableMyIdentifier)
		.push(data)
		.write();
}

/* Comments Needed: */
function removeFromDB(tableMyIdentifier, data) {
	db.get(tableMyIdentifier)
		.remove()
		.write();
}

function initializeBlockList() {
	if (blockList == undefined) {
		console.log("Tension!!!!!!!! " , blockList);
	} else {
		console.log("Very Big Problem !!!!!!!! " , blockList);
	}
	blockList.push({ hostnameKeyword: "express.com", urlKeyword: "" });
	blockList.push({ hostnameKeyword: "json.com", urlKeyword: "/images/wrong" });
	blockList.push({ hostnameKeyword: "facebook.com", urlKeyword: "/images/wrong" });
	blockList.push({ hostnameKeyword: "", urlKeyword: "/images/wrong" });
	blockList.push({ hostnameKeyword: "", urlKeyword: "hacking" });
	blockList.push({ hostnameKeyword: "adservice.google.co(m|.in)", urlKeyword: "" });
	blockList.push({ hostnameKeyword: "google-analytics.com", urlKeyword: "" });
	blockList.push({ hostnameKeyword: "advertising.com|dotomi.com", urlKeyword: "" });
	blockList.push({ hostnameKeyword: "doubleclick.(com|net)|adnxs.com", urlKeyword: "" });
	//blockList.push({ hostnameKeyword: "", urlKeyword: "" }); // Wrong Config
}

function initializeCertifiedList() {
	certifiedList.push({ certifiedHost: "google.co(m|\.in)$", certifiedFor: "Google" });
	certifiedList.push({ certifiedHost: "(facebook|fb|fbcdn|fbcbx|messenger).(com|net)", certifiedFor: "FaceBook" });
	certifiedList.push({ certifiedHost: "(^|\.)(twitter.com|t.co|twimg.com)$", certifiedFor: "Twitter" });
	certifiedList.push({ certifiedHost: "github.com", certifiedFor: "GitHub" });
	certifiedList.push({ certifiedHost: "microsoft.com", certifiedFor: "Microsoft" });
	certifiedList.push({ certifiedHost: "yahoo.com", certifiedFor: "Yahoo" });
	certifiedList.push({ certifiedHost: "stackoverflow.com", certifiedFor: "StackOverflow" });
	certifiedList.push({ certifiedHost: "gitlab.com", certifiedFor: "GitLab" });
	certifiedList.push({ certifiedHost: "(^|\.)(sbi.(com|co.in)|onlinesbi.com|sbicard)$", certifiedFor: "SBI Bank" });
	certifiedList.push({ certifiedHost: "(^|\.)(hdfcbank.com)$", certifiedFor: "HDFC Bank" });
	certifiedList.push({ certifiedHost: "(^|\.)(yesbank.in)$", certifiedFor: "Yes Bank" });
	certifiedList.push({ certifiedHost: "(^|\.)(axisbank.co.in|axisbank.com)$", certifiedFor: "AXIS Bank" });

}

function initializeWhiteList() {
	whiteList.push({ hostnameKeyword: "express.com", urlKeyword: "" });
	//whiteList.push({ hostnameKeyword: "express.com", urlKeyword: "" }); // Wrong Config
}

function resetDB() {
	db.set('whiteList', [])
		.write();
	db.set('blockList', [])
		.write();
	db.set('certifiedList', [])
		.write();
}

function fetchFromDB() {
	const adapter = new LocalStorage('db')
	const db = low(adapter)
	blockList = db.get('blockList').value();
	whiteList = db.get('whiteList').value();
	certifiedList = db.get('certifiedList').value();
	console.log("[ Func: fetchFromDB() ] Data Fetch from db is: ", blockList, whiteList, certifiedList);
}

function writeListToDB() {
	for ( oneData of blockList ) {
		writeToDB("blockList", oneData);
	}
	for ( oneData of whiteList ) {
		writeToDB("whiteList", oneData);
	}
	for ( oneData of certifiedList ) {
		writeToDB("certifiedList", oneData);
	}
}

function showDB_Status() {
	dbState = db.getState()
	console.log(" --- dbState ---", dbState)
	jsonData = JSON.stringify(dbState, null, 2); /* Beautify It */
	console.log(jsonData);
	return jsonData;
}


/* Chrome Extension Installation and Update Feature */
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("It is a First Install, Add initialize all List and add Data To DataBase");
		
		/* Initialize Data into Our Respective Array */
		initializeBlockList();
		initializeCertifiedList();
		initializeWhiteList();
		console.log("[ Initialized Data ] Data: ", blockList, whiteList, certifiedList);
		
		/* Reset DB and Add To DB */
		resetDB();
		writeListToDB();
		console.log("[ Initialized Database ] Below is the Database Data : ");
		showDB_Status();
		isDataInList = true;
    }
	else if(details.reason == "update"){
        console.log("It is a Update, Handle it Later");
		console.log("[ Current Database Status ] Below is the Database Data : ");
		showDB_Status();
		fetchFromDB();
		isDataInList = true;
    }
	else {
		console.log("Browser Openoned Now --------------------------------------------------------------");
	}
});

function isEmpty(obj) {
	console.log("  ===== Object.keys(obj).length========= ", Object.keys(obj).length)
	for (const key in obj) {
		console.log("Iterating Over Keys ");
		if (obj.hasOwnProperty(key)) {
			const element = obj[key];
			console.log(element)
		}
	}
	console.log("JSON.stringify(obj) ", JSON.stringify(obj));
	console.log("JSON.stringify({}) ", JSON.stringify({}));

	/******* Not The Ideal But a Solution to Check if DB is Empty */
    if ( JSON.stringify(obj) === '"{}"' ) {
		console.log("JSON.stringify(obj) ", JSON.stringify(obj));
		return true;
	}
	return false;
}

if (!isDataInList) {
	console.log("[ Current Database Status ] Below is the Database Data : " );
	var dbData = showDB_Status();
	console.log("[ Data : Not DataList Therefore Add it from the Database " );
	if (isEmpty(dbData)) {
		console.log("[ Current Database Status ] [Reason: db.isEmpty] Threfore do not fetch  : ", dbData );
		showDB_Status();
	} else {
		console.log("[ Current Database Status ] DB is NOT EMPTY : ", dbData );
		showDB_Status();
		fetchFromDB();
	}
}

/*
	Example Of Data inside the blockList Array:
	{
		hostnameKeyword: "google.com",
		urlKeyword: "/images"
	}
	Example Of Data inside the certifiedList Array:
	{
		certifiedHost: "google.com",
		certifiedFor: "Google"
	}
	Example of Data Inside hostsList
	
	hostsList
	{
		109: { mainSitename: "www.google.com", 
				hostnames: new Array[ 
				​​						0: Object { host: "www.google.com", count: 10, status: "certified" }
										1: Object { host: "my.google.com", count: 9, status: "certified" }
						​			]
			},
		110: { mainSitename: "www.google.com", 
				hostnames: new Array[ 
	​​									0: Object { host: "www.google.com", count: 10, status: "certified" }
										1: Object { host: "my.google.com", count: 9, status: "certified" }
						​			]
			}
	}
​​
*/



/**************		Chrome Tab API	Starts	************************/

/* tabInfo is Tab Class Object, It Contains tabId and Few more Data */

/* When a New Tab is Created */
chrome.tabs.onCreated.addListener(
	function(tabInfo) {
		console.log("tabs API: onCreated Tab With [ Tab ID: " + tabInfo.id + " ]");
		// Create a New Key : tabId and Value as a Array
		hostsList[tabInfo.id] = { mainSitename: "", hostnames: new Array() }
	}

);

/* When a Update on a Tab is Processed */
chrome.tabs.onUpdated.addListener(
	function(tabId, changeInfo, tabInfo) {
		console.log("tabs API: onUpdated Tab  [ Tab ID: " + tabId + " ] With Url if changed [ From URL : " + currentUrl[tabId] + " ] [ To URL : " + newUrl[tabId] + " ] ");
		console.log("tabs API: onUpdated Tab  [ Tab ID: " + tabId + " ] Value os tabInfo.url : " , tabInfo , " ");

		// add tabInfo.url
		// Still "#" will create Problem keep that in mind Example: https://www.google.com -> https://www.google.com# -> Please check and confirm
		
		/* If URL is Present & it is not ChromeURL */
		if( tabInfo.url && !chromeURL.test(tabInfo.url) ){

			currentUrl[tabId] = tabInfo.url;
			mainSitename[tabId] = new URL(currentUrl[tabId]).hostname;
			
			if( currentUrl[tabId] !== newUrl[tabId] ){
				
				console.log(" [ TabId: " + tabId + " ] URL Changed [ From: " + currentUrl[tabId] + " ] [ To: " + newUrl[tabId] + " ]. Hence: Reset/Re-Initialize the Variables");
				currentURL = new URL(currentUrl[tabId]);
				mainSitename[tabId] = currentURL.hostname;
				hostsList[tabId] = { mainSitename: mainSitename[tabId], hostnames: new Array() }
				
				status = "unknown";
				if ( processBlockListChecking(mainSitename[tabId], currentURL.pathname + currentURL.search ) && !processWhiteListChecking(mainSitename[tabId], currentURL.pathname + currentURL.search ) ) {
					status = "blocked"
				}
				else {
					status = "allowed"
				}
				addToHostsList(mainSitename[tabId], tabId, status);
				newUrl[tabId] = currentUrl[tabId];
			}

		}
		// Testing Purpose
		//console.log(hostsList);
		
		// Testing Purpose
		// removeFromBlockedList("ashish.com", "")
		
	}
);

/* When the Tab is Removed  */
chrome.tabs.onRemoved.addListener(
	function(tabId, removeInfo) {
		funcName = "chrome.tabs.onRemoved: ";
		console.log(funcName, "tabs API: onRemoved Tab With [ TabId: ", tabId, " ]");
		
		if(currentUrl[tabId]){
			delete currentUrl[tabId];
		}
		if(newUrl[tabId]){
			delete newUrl[tabId];
		}
		if(mainSitename[tabId]){
			delete mainSitename[tabId];
		}
		if(hostsList[tabId]){
			delete hostsList[tabId];
		}	
	}
);

/**************		Chrome Tab API	Completed	************************/


/**************		Chrome WebRequest API	Starts	************************/
/*
	Read  on this https://developer.chrome.com/extensions/webRequest: BlockingResponse also try out other extension that block websites might help us

	chrome.webRequest.onBeforeRequest.addListener(
		//Do some Processing 
        function(details) { return {cancel: true}; },
		//For which URL we have do the Processing
        {urls: ["*://www.evil.com/*"]},
		// After Processing if it Returns { cancel: true } then what to do
        ["blocking"]
	);

*/


chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		console.log("webRequest API: onBeforeRequest, URL Received is [ URL : " + details.url + " ]");
		
		// Don't Process if it is an Chrome URL
		if ( chromeURL.test(details.url) ) {
			console.log("Do Not Process [ Chrome URL: " + details.url + " ] ");
			return;
		}
		else {
			console.log("Process [ Request URL: " + details.url + " ] ");
			// The Below Function will do the Further Processing
			return handle_OnBeforeRequest(details)
		}
	},
	{
		urls: ["<all_urls>"]
	},
	["blocking"]
);


function handle_OnBeforeRequest(details) {
	funcName = "Function Called: handle_OnBeforeRequest: ";

	cancel = false;
	tabId = details.tabId;
	reqURL = details.url;
	urlObject = new URL(reqURL);
	reqProtocol = urlObject.protocol;
	reqHostname = urlObject.host;
	reqFilePath = urlObject.pathname;
	reqSearchFields = urlObject.search;
 	
	console.log(funcName, "Request=> ", { tabId } ," Received=> ", { reqURL });
	console.log(funcName, "Request=> Extracted: ", { reqProtocol, reqHostname, reqFilePath, reqSearchFields });
	
	/****** Just a Test Case: *******/
	reqFilePath = reqFilePath + reqSearchFields;
	
	
	/* 
		Note IMP: Over here we are not taking the Search Fields will intergate it later
		Example:
		http://www.surveygizmo.com/s3/1234567/my-survey?variable=value
		In the above Example SearchFields are: variable=value
		i.e values after "?"
		? included
	*/

	/* Function to Check for Blocking */
	cancel = processBlockListChecking(reqHostname, reqFilePath);
	
	/** Checking WhiteList */

	if (cancel) {
		console.log("[STATUS: BLOCKED], [WebReq: " + reqHostname + "], [Reason: By BlockedList Feature]");
	}

	/* Function to Check for Whitelist: If WhiteList Return True which means it is Allowed But cancel Should be False so will Block Request if cancel is true */
	if ( processWhiteListChecking(reqHostname, reqFilePath) ) {
		cancel = false;
	}
		
	if (hostsList[tabId]) {
		if (cancel) {
			status = "blocked"
			addToHostsList(reqHostname, tabId, status);
			console.log("[STATUS: BLOCKED], [WebReq: " + reqHostname + "]");
		}
		else {
			status = "allowed"
			addToHostsList(reqHostname, tabId, status);
			console.log("[STATUS: ALLOWED], [WebReq: " + reqHostname + "]");
		}
	}
	else {
		error[tabId] = { error_code: 100, error_reason: "Tab was Already Open, onCreated & onUpdated was Not Called. Please Open a New Tab " }
	}
	
	/* Function to Check for Certified Host */
	/* For testing Purpose it has been added here */
	// response = processCertifiedListChecking(reqHostname);
	
	/* [IMP] Left to process, if it is certified then change it to certified rather than allowed */
	
	// Testing Purpose
	// console.log(funcName, "Data:hostsList: ", hostsList);


	return { cancel: cancel };
}

// Actual Logic to Check Each hostname and FilePath in the BlockList and Block if a Match is Found
function processBlockListChecking(reqHostname, reqFilePath) {
	funcName = "Function Called: processBlockListChecking: ";
	console.log(funcName, blockList);
	for ( oneItem of blockList ) { 
		if ( oneItem.hostnameKeyword === "" && oneItem.urlKeyword === "" ) {
			console.log(funcName, "Block All Request : [Warning]: Wrong [ Config => Data: ", oneItem, " ]; Therefore Block => [ Hostname: ", reqHostname, " ] With [ FilePath: ", reqFilePath, " ]");
			return true
		}
		else if ( oneItem.hostnameKeyword !== "" && oneItem.urlKeyword === "" ) {
			blockHostnameRegex = new RegExp(oneItem.hostnameKeyword);
			if ( blockHostnameRegex.test(reqHostname) ) {
				console.log(funcName, "Matched with [ BlockList Item: ", oneItem, " ] with [ Request: ", reqHostname, " ]");
				return true
			}
		}
		else if ( oneItem.hostnameKeyword === "" && oneItem.urlKeyword !== "" ) {
			blockFilePathRegex = new RegExp(oneItem.urlKeyword);
			if ( blockFilePathRegex.test(reqFilePath) ) {
				console.log(funcName, "Matched with [ BlockList Item: ", oneItem, " ] with [ FilePath: ", reqFilePath, " ]");
				return true
			}
		}
		else {
			blockHostnameRegex = new RegExp(oneItem.hostnameKeyword);
			blockFilePathRegex = new RegExp(oneItem.urlKeyword);
			if ( blockHostnameRegex.test(reqHostname) && blockFilePathRegex.test(reqFilePath) ) {
				console.log(funcName, "Matched with [ BlockList Item: ", oneItem, " ] with [ Request: ", reqHostname, " ] & [ FilePath: ", reqFilePath, " ]");
				return true
			}
		}
	}
	return false;
}


/* As per our Previous Working of the Logic 
	 */
function processWhiteListChecking(reqHostname, reqFilePath) {
	console.log("Inside Func: processWhiteListChecking", whiteList);
	
	for ( oneItem of whiteList ) { 
		console.log("One Data of WhiteList is: ", oneItem)
		
		if ( oneItem.hostnameKeyword === "" && oneItem.urlKeyword === "" ) {
			console.log("ALlow All Request : Warning: Wrong Config, Blocklist will not work", oneItem);
			console.log("Allow Hostname: " + reqHostname + " With FilePath: " + reqFilePath);
			return true
		}
		else if ( oneItem.hostnameKeyword !== "" && oneItem.urlKeyword === "" ) {
			console.log("This Allow Config Item should be used to only match with the Hostname, Data is  ", oneItem);
			allowHostnameRegex = new RegExp(oneItem.hostnameKeyword);
			if ( allowHostnameRegex.test(reqHostname) ) {
				console.log("Allow This Host", reqHostname ," Regardless of the FilePath: ", reqFilePath);
				return true
			}
		}
		else if ( oneItem.hostnameKeyword === "" && oneItem.urlKeyword !== "" ) {
			console.log("This Allow Config Item should be used to only match with the any filePath Data, Data is  ", oneItem);
			allowFilePathRegex = new RegExp(oneItem.urlKeyword);
			if ( allowFilePathRegex.test(reqFilePath) ) {
				console.log("Allow This FilePath in Url Regardless of the Host: " + reqFilePath);
				return true
			}
		}
		else {
			console.log("Match for Both, oneItem Config Data : ", oneItem);
			
			allowHostnameRegex = new RegExp(oneItem.hostnameKeyword);
			allowFilePathRegex = new RegExp(oneItem.urlKeyword);
			
			if ( allowHostnameRegex.test(reqHostname) && allowFilePathRegex.test(reqFilePath) ) {
				console.log("Allow Hostname: " + reqHostname + " With FilePath: " + reqFilePath);
				return true
			}
		}
	}
	return false;
}




// Add Data from config to the Database and In-Memory Object
/* Left to add $ at last of the Regex, this Important in situation like a.google.com.ashish.uk */
function OLD_addToBlockedList(hostnameKeyword, urlKeyword) {
	userBlockReq = { hostnameKeyword: hostnameKeyword, urlKeyword: urlKeyword };
	console.log("Func: addToBlockedList: Values", userBlockReq);
	isInBlocklist = false;
	isInBlockListRegex = false;
	for ( oneItem of blockList ) { 
		console.log("Data is: ", oneItem);
		if ( JSON.stringify(oneItem) === JSON.stringify(userBlockReq) ) {
			console.log("Matched With: ");
			console.log(oneItem);
			isInBlocklist = true;
			break;
		}
		else if( (new RegExp((oneItem.hostnameKeyword))).test(userBlockReq.hostnameKeyword) && (oneItem.urlKeyword==="" ? true : new RegExp(oneItem.urlKeyword).test(userBlockReq.urlKeyword)) ) {
			console.log("Matched With a Regex, : ", oneItem, "Not Added in BlockList");
			isInBlocklist = true;
			isInBlockListRegex = true;
			break;
		}
	}
	if (!isInBlocklist) {
		blockList.push(userBlockReq);
		console.log("Added To blockList");
		return { success_code:102, success_reason: "Newly Added" };
	}
	else {
		// The Code willl reach here if the website req by user is in the blockList, also check the whitelist of the website is in whitelist if present remove it.
		
		if(isInBlockListRegex){
			return { success_code:102, success_reason: "Already Present in Regex" };
		}
		else {
			return { success_code:102, success_reason: "Already Present in The List" };
		}
	}
	
}


// Add Data from config to the Database and In-Memory Object
/* Left to add $ at last of the Regex, this Important in situation like a.google.com.ashish.uk */
function addToBlockedList(hostnameKeyword, urlKeyword) {
	userBlockReq = { hostnameKeyword: hostnameKeyword, urlKeyword: urlKeyword };
	console.log("Func: addToBlockedList: Values", userBlockReq);
	isInBlocklist = processBlockListChecking(hostnameKeyword, urlKeyword);
	isInWhitelist = processWhiteListChecking(hostnameKeyword, urlKeyword);
	
	/* 
		If you want to block a host or domain and it is present in whitelist then it will be removed
		If you want to block a host or domain and it is present in whitelist in  form of regex then we work on it in future
	*/
	if (isInWhitelist) {
		console.log("Cannot Add, Request Present in Whitelist");
		return { error_code: 106, error_reason: "Cannot Add, Request Present in Whitelist"};
	}
	
	if (!isInBlocklist) {
		blockList.push(userBlockReq);
		writeToDB("blockList", userBlockReq); /* Add it to DataBase */ 
		console.log("Added To blockList");
		return { success_code:102, success_reason: "Newly Added" };
	}
	else {
		console.log("Already Present in BlockList");
		return { error_code:102, error_reason: "Already Added" };
	}
	
}



/** Comments Needed: Over here we are going to use temporary list to store all that is not matched and then override it */
function removeFromBlockedList(hostnameKeyword, urlKeyword) {
	userAllowReq = { hostnameKeyword: hostnameKeyword, urlKeyword: urlKeyword };
	response = { error_code: 100, error_reason: "Host was not Found in blockList, Nothing Processed"};
	
	tmpBlockList = new Array();
	console.log("Func: removeFromBlockedList(hostnameKeyword, urlKeyword): Values", userAllowReq);
	isInBlocklist = false;
	isInBlockListRegex = false;
	isInWhitelist = false;
	
	for ( oneItem of blockList ) { 
		console.log("Data is: ", oneItem);
		if ( JSON.stringify(oneItem) === JSON.stringify(userAllowReq) ) {
			console.log("Matched With: ", oneItem);
			isInBlocklist = true;
			removeFromDB("blockList", userAllowReq); /* Remove From DataBase */
			response = { success_code: 200, success_reason: "Found and Removed from Blocklist, The site is now allowed" };
		}
		/** Using Ternary Operator */
		else if( (new RegExp((oneItem.hostnameKeyword))).test(userAllowReq.hostnameKeyword) && (oneItem.urlKeyword==="" ? true : new RegExp(oneItem.urlKeyword).test(userAllowReq.urlKeyword)) ) {		
			console.log("Matched RegExp With: ", oneItem);
			isInBlocklist = true;
			isInBlockListRegex = true;
			tmpBlockList.push(oneItem);
			
		}
		else {
			tmpBlockList.push(oneItem);
		}
	}
	
	isInWhitelist = processWhiteListChecking(hostnameKeyword, urlKeyword);

	/* Send a Response */
	if (isInBlocklist) {
		console.log("The Website is in Block List, User Requested to allow it.");
		blockList = tmpBlockList;
		if(isInBlockListRegex){
			if(isInWhitelist) {
				response = { error_code: 204, error_reason: "Found in Whitelist Regex, Already Allowed" };
				// whiteList.push(userAllowReq); /* [UnNecesssary] */
				return response;
			}
			else {
				response = { success_code: 200, success_reason: "Found in BlockList Regex, Added to whiteList, The site is now allowed" };
				whiteList.push(userAllowReq);
				writeToDB("whiteList", userAllowReq); /* Add it to DataBase */
				return response;
			}
		}
		else{
			return response;
		}
	}
	else {
		return response;
	}
}


function TESTING_removeFromBlockedList(hostnameKeyword, urlKeyword) {
	userAllowReq = { hostnameKeyword: hostnameKeyword, urlKeyword: urlKeyword };
	console.log("Func: removeFromBlockedList(hostnameKeyword, urlKeyword): Values: ", userAllowReq);
	response = { error_code: 100, error_reason: "Host was not Found in blockList"};
	tmpBlockList = new Array();
	isInBlocklist = false;
	isInWhitelist = false;
	
	isInBlocklist = processBlockListChecking(hostnameKeyword, urlKeyword);
	isInWhitelist = processWhiteListChecking(hostnameKeyword, urlKeyword);
	
	/* 
		If you want to block a host or domain and it is present in whitelist then it will be removed
		If you want to block a host or domain and it is present in whitelist in  form of regex then we work on it in future
	*/
	if (isInWhitelist) {
		console.log("Cannot Remove, Request Present in Whitelist");
		return { error_code: 106, error_reason: "Cannot Remove, Request Present in Whitelist"};
	}
	
	if (!isInBlocklist) {
		blockList.push(userBlockReq);
		console.log("Added To blockList");
		return { success_code:102, success_reason: "Newly Added" };
	}
	else {
		console.log("Already Present in BlockList");
		return { error_code:102, error_reason: "Already Added" };
	}

}



/* Comment: The Function Checks in the certifiedList and returns the certifiedList data if it is not present it will return unknown: true  */
function processCertifiedListChecking(reqHostname) {
	console.log("Inside Func: processCertifiedListChecking", certifiedList);
	for ( oneItem of certifiedList ) { 
		console.log("Processing [ Data: ", oneItem, " ] => [ certifiedHost: ", oneItem.certifiedHost, "] [ certifiedFor: ", oneItem.certifiedFor, " ] Checking Against [ reqHostname: ", reqHostname);
		certifiedHostRegex = new RegExp(oneItem.certifiedHost);
		if ( certifiedHostRegex.test(reqHostname) ) {
			console.log("[ reqHostname: ", reqHostname," ] Qualified inside [ Certified Host: ", oneItem.certifiedHost," ]");
			return { certifiedHost: reqHostname, certifiedFor: oneItem.certifiedFor };
		}
	}
	// The code will reach Here if it does not finds the Certified hosts in the certifiedList, which means it is not Certified
	return { unknown: true, host: reqHostname };
}


/* Comment Needed */
function addToCertifiedList(certifiedHost, certifiedFor) {
	userCertifiedReq = { certifiedHost: certifiedHost, certifiedFor: certifiedFor }
	isInCertifiedlist = false;
	for ( oneItem of certifiedList ) { 
		console.log("Processing [ Data: ", oneItem, " ] => [ certifiedHost: ", oneItem.certifiedHost, "] [ certifiedFor: ", oneItem.certifiedFor, " ] Checking Against [ userCertifiedReq: ", userCertifiedReq);
		response = processCertifiedListChecking(certifiedHost)
		if ( !response.unknown ) {
			isInCertifiedlist = true;
			break;
		}
	}
	if (!isInCertifiedlist) {
		certifiedList.push(userCertifiedReq);
		writeToDB("certifiedList", userCertifiedReq); /* Add it to DataBase */
		console.log("[ userCertifiedReq: ", userCertifiedReq," ] Added To certifiedList");
		return { success_code: 102, success_reason: "Newly Added" };
	}
	else {
		return { success_code: 102, success_reason: "Already Added" };
	}
}



function addToHostsList(hostname, tabId, status){
	
	for ( oneHostArray of hostsList[tabId].hostnames ) {
		console.log("Data: [ oneHostArray: ", oneHostArray, " ] -> Input Data: [ ToAdd :", hostname, tabId, status , " ]");
		if ( oneHostArray.host === hostname && oneHostArray.status === status) {
			oneHostArray.count++;	
			return { result: "updated_old" };
		}
		else if ( oneHostArray.host === hostname && oneHostArray.status !== status) {
			oneHostArray.status = status;
			oneHostArray.count = 1;
			console.log("[updated_new] Data: [ oneHostArray: ", oneHostArray, " ] -> Input Data: [ ToAdd :", hostname, tabId, status , " ]");
			return { result: "updated_new" };
			
		}
		else {
			console.log("[ INSIDE ELSE: ] Data: [ oneHostArray: ", oneHostArray, " ] -> Input Data: [ ToAdd :", hostname, tabId, status , " ]");
		}
	}
	// The Code will reach here if the host is not in the hostsList
	if (status) {
		hostsList[tabId].hostnames.push(createHostsJson(hostname, status));
	}
	else {
		hostsList[tabId].hostnames.push(createHostsJson(hostname, "unknown"));
	}
	return { result: "created" };
	
}


function createHostsJson(host, status) {
	return { host: host, count: 1, status: status };
}






/******************************************* Message Passing *********************************************/
/* Chrome Runtime Mesaage Passing  */

chrome.runtime.onMessage.addListener(

	function(request, sender, sendResponse) {
		funcName = "[Function: handleEvent_OnMessage(request, sender, sendResponse)]";
		console.log( funcName + " Called");
		response = {};
		if (request.reqMessage === "mainSitename"){
			messageFromTabId = sender.tab.id;
			sitename = mainSitename[messageFromTabId];
			console.log(funcName + "Received Request for HostName List, Sending It To: [TabID: " + messageFromTabId + "] with [ MainSiteName: " + sitename + " ]");
			response = processCertifiedListChecking(sitename);
			console.log("Response: Send is: ", response);
			sendResponse(response);
			// Use return to remove the process of the remaining logic
		}
		
		if (request.reqMessage === "sendHostsList"){
			messageFromTabId = request.tabId;
			if(hostsList[messageFromTabId]) {
				response = hostsList[messageFromTabId]
			}
			else {
				error[messageFromTabId] = { error_code: 101, error_reason: "Please Open a New Tab, Please Reload this Tab" }
				response = error[messageFromTabId]
				hostsList[messageFromTabId] = { mainSitename: "", hostnames: new Array() };
			}
			console.log("Response: ", response);
			sendResponse(response);
		}
		
		if (request.reqMessage === "sendBlockList"){
			messageFromTabId = request.tabId;
			response = blockList;
			console.log("Response: ", response);
			sendResponse(response);
		}
		
		if (request.reqMessage === "sendCertifiedList"){
			messageFromTabId = request.tabId;
			response = certifiedList;
			console.log("Response: ", response);
			sendResponse(response);
		}
	
		if (request.reqMessage === "sendWhiteList"){
			messageFromTabId = request.tabId;
			response = whiteList;
			console.log("Response: ", response);
			sendResponse(response);
		}
	
		if (request.reqMessage === "addToCertifiedList"){
			messageFromTabId = request.tabId;
			response = addToCertifiedList(request.certifiedHost, request.certifiedFor);	
			console.log("Response: ", response);
			sendResponse(response);
		}
		
		if (request.reqMessage === "addToBlockedList"){
			messageFromTabId = request.tabId;
			response = addToBlockedList(request.hostnameKeyword, request.urlKeyword);
			console.log("Response: ", response);
			sendResponse(response);
		}
		
		/* removeFromBlockedList(hostnameKeyword, urlKeyword) */
		if (request.reqMessage === "removeFromBlockedList"){
			messageFromTabId = request.tabId;
			response = removeFromBlockedList(request.hostnameKeyword, request.urlKeyword);	
			console.log("Response: ", response);
			sendResponse(response);
		}
		
		if (request.reqMessage === "refreshListsUsingDB"){
			messageFromTabId = request.tabId;
			fetchFromDB();
			response = { success_code: 206, success_reason: "Refreshed all the List from DB" };
			console.log("Response: ", response);
			sendResponse(response);
		}
		
		if (request.reqMessage === "getDB_Instance"){
			messageFromTabId = request.tabId;
			response = { success_code: db, success_reason: "Got The DB Instance, Using the Same" };
			console.log("Response: ", response);
			sendResponse(response);
		}
		
	}
	
);

