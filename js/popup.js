/* File: popup.js 

	This popup.js is the PART of popup.html, when popup.html is loaded, this popup.js is loaded with it.
	PopUp is the Event Occured when the User Clicks on the Chrome Extension Icon on the Top Right Next to the Address Bar.
	This popup.js will Initialize Important data into the Table Provided to User which is Nothing but Hosts Table


*/

$(document).ready(function(){
	
	initializeData();
	
	/** This Toastr API makes it eaily to Display Notifications to User */
	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "1000",
		"hideDuration": "1000",
		"timeOut": "1000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}

	/** This Function Will Create actionButton and Get the Hosts List  */
	function initializeData() {
		
		actionButton = 	`<div class="btn-group">` +
							`<button type="button" class="btn btn-default btn-sm addToCertifiedList certified"></button>` +
							`<button type="button" class="btn btn-default btn-sm addToBlockedList blocked"></button>` +
							`<button type="button" class="btn btn-default btn-sm removeFromBlockedList allowed"></button>` +
						`</div>`;
		

		/* Fill Table on StartUp */
		getHostsList();
		
	}
	
	
	/* Send a Message[Request] to the background.js to send details about the Websites Accessed*/
	function getHostsList() {
		requestMessage = { reqMessage: "sendHostsList", tabId: "UnKnown" },
		sendMessage(requestMessage)
	}
	
	function addToTable(response) {
		/** Clear the Current Table */
		$("#hostsDetails tbody").empty();
		
		/* [Feature: Update] statusUpdate: Newly Added Feature. It will display total blocked Count */
		
		/*	[+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++] */

		blockCounter = 0;
		for ( oneHostDetails of response.hostnames ) {
			if ( oneHostDetails.status === "blocked" ) {
				blockCounter += oneHostDetails.count
			}
		}
		statusUpdate = "Total " + blockCounter + " Requests Blocked in this Page"
		$(".statusUpdate").text(statusUpdate);
		
		/*	[+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++] */

		/** Add All Accessed/Blocked Domains Data to Table */
		count = 1 ;
		for ( oneHostDetails of response.hostnames ) {
			tickIcon = "<label class=\""+ oneHostDetails.status +"\"> </label>";
			tableId = "hostsDetails";
			data = { host: oneHostDetails.host, count: oneHostDetails.count, status: tickIcon };
			addTableData(tableId, count, data, actionButton);
			count++;
		}

		/* After Table is Create Add the Listeners */
		addAllClickEvents();
		
		/* AFter Table Data is added, Add DataTable*/
		// DataTable
		//NOT NEEDED: $("#hostsDetails").DataTable();
	}
	
	
	function addTableData(tableId, count, data, actionButton) {
		keys = Object.keys(data);
		values = Object.values(data);
		tableData = "";
		for ( i = 0; i < keys.length; i++ ) {
			tableData += `<td>` + values[i] + `</td>`;
		}
		$("#" + tableId + "").append(
				  `<tr>` +
					`<td>` + count + `</td>` +
						tableData +
					`<td>` + actionButton + `</td>` +
				  `</tr>`
				);
	}	
	
	function addAllClickEvents() {
		$(".addToCertifiedList").on("click", handleClickEventOn_addToCertifiedList);
		$(".addToBlockedList").on("click", handleClickEventOn_addToBlockedList);
		$(".removeFromBlockedList").on("click", handleClickEventOn_removeFromBlockedList);
		$(".reload").on("click", handleClickEventOn_reload);
	}
		
	function handleClickEventOn_reload() {
		getHostsList();
	}

	function handleClickEventOn_addToCertifiedList(){
		hostname = $(this).closest("tr").find("td:nth-child(2)").text();
		console.log("Hostname is", hostname);
		requestMessage = { reqMessage: "addToCertifiedList", tabId: "UnKnown", certifiedHost: hostname, certifiedFor: "UserCertified" };
		sendMessage(requestMessage);
	}
	
	/* Example of Data to be send { hostnameKeyword: "express.com", urlKeyword: "" } */
	function handleClickEventOn_addToBlockedList(){
		hostname = $(this).closest("tr").find("td:nth-child(2)").text();
		console.log("Hostname is: ", hostname);
		requestMessage = { reqMessage: "addToBlockedList", tabId: "UnKnown", hostnameKeyword: hostname, urlKeyword: "" };
		sendMessage(requestMessage);
		// Display an info toast with no title
	}

	
	function handleClickEventOn_removeFromBlockedList(){
		hostname = $(this).closest("tr").find("td:nth-child(2)").text();
		console.log("Hostname is", hostname);
		requestMessage = { reqMessage: "removeFromBlockedList", tabId: "UnKnown", hostnameKeyword: hostname, urlKeyword: "" };
		sendMessage(requestMessage);
	}
	
	/** This Function will use Chrome Messaging API to send Message to background.js to Send or Retrieve Data from the List  **/
	function sendMessage(requestMessage) {

		chrome.tabs.query( 
			{ currentWindow: true, active: true },
			function (tabs) { 
				activeTab = tabs[0];
				requestMessage.tabId = activeTab.id;
				chrome.runtime.sendMessage( requestMessage,
					function (response) {
						console.log("Response Received: ", { response } );
						if (response.error_code) {
							console.log("Response Received: Error: " + response.error_reason );
							toastr.error(response.error_reason);
						}
						else {
							if (response.hostnames) {
								addToTable(response);
							}
							else {
								console.log("Response Received: Success: " + response.success_reason );
								toastr.success(response.success_reason);
							}
						}
					}
				);
			}
		);
		
	}
	
});