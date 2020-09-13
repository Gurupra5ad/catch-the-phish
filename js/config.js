/* File: config.js

	This config.js is the PART of config.html, when config.html is loaded, this config.js is loaded with it.
	Config is the Options that is used to add Configuration to the Currently Running Extension.
	It Helps use to Fine Tune or create configuration as the users needs. It provides a Granular Approach to Create Configurations to teh Extension.
	This config.js will Initialize Important data into the Table Provided to User which is Nothing but Certified/Blocked/Whitelist Hosts Table


*/

$(document).ready(function(){
	
	/* Initialize Toastr Notification Options: This Toastr API makes it very easy to display Notificatiosn to the users */
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
	
	/* DB Connection */
	//localStorage.clear(); /* Used in Problem Situation */
	//localStorage.removeItem();

	const adapter = new LocalStorage('db')
	const db = low(adapter)

	// Store the Same Local Storage
	//db = getDB_Instance();
	//db = low(window.localStorage);
	
	
	/* [Only Show Home when Accessing the Configuration] Default Show Only Home */
	//$('div.mainContentSection div.Home').removeClass('divHidden');
	//$('div.sideNavSection a:first').addClass('selected');
	
	/* Initalize All the Certified/Blocked/Whitelist Hosts Table */
	initializeAllTables();
	
	function getDB_Instance() {
		requestMessage = { reqMessage: "getDB_Instance", tabId: "UnKnown" };
		db = sendMessage(requestMessage);
		
		console.log("Data inside DB is -> ", { db })
		// fetchFromDB();
		return db;
	}
	
	function fetchFromDB() {
		blockList = db.get('blockList').value();
		whiteList = db.get('whiteList').value();
		certifiedList = db.get('certifiedList').value();
		console.log("[ config.js =>  Func: fetchFromDB() ] Data Fetch from db is: ", { blockList, whiteList, certifiedList } );
	}
	
	/* Side Nav bar */
	$('div.sideNavSection a').on('click', function() {
		$('div.sideNavSection a').removeClass('selected');
		$(this).addClass('selected');
		aText = $(this).text();
		console.log("aText is : ", { aText } );
		$('div.mainContentSection').children().addClass('divHidden');
		$('div.mainContentSection div.' + aText).removeClass('divHidden');
		
	});

	
	mainBar = document.getElementById("mainBar");
	backcard = document.getElementsByClassName("backcard");
	mainContentSection = document.getElementsByClassName("mainContentSection")[0];

	homeDiv = document.getElementById("homeDiv");
	certifiedlistDiv = document.getElementById("certifiedlistDiv");
	blockedlistDiv = document.getElementById("blockedlistDiv");
	whitelistDiv = document.getElementById("whitelistDiv");
	helpDiv = document.getElementById("helpDiv");
	aboutusDiv = document.getElementById("aboutusDiv");
	futurescopeDiv = document.getElementById("futurescopeDiv");
	/**
		Home
		BlockList
		CertifedList
		WhiteList
		Help
		About
		FutureScope
	 */
	home = document.getElementsByClassName("Home")[0];
	certifiedlist = document.getElementsByClassName("CertifedList")[0];
	blocklist = document.getElementsByClassName("BlockList")[0];
	whitelist = document.getElementsByClassName("WhiteList")[0];
	help = document.getElementsByClassName("Help")[0];
	aboutus = document.getElementsByClassName("About")[0];
	futurescope = document.getElementsByClassName("FutureScope")[0];

	homeDiv.addEventListener( 'click', function() {
		console.log("Clicked");
		//document.location = chrome.extension.getURL("config/configTest4_Home.html")
		mainBar.classList.add('divHidden');
		home.classList.remove('divHidden');
	})

	certifiedlistDiv.addEventListener( 'click', function() {
		console.log("Clicked");
		//document.location = chrome.extension.getURL("config/configTest4_Home.html")
		mainBar.classList.add('divHidden');
		certifiedlist.classList.remove('divHidden');
	})

	blockedlistDiv.addEventListener( 'click', function() {
		console.log("Clicked");
		//document.location = chrome.extension.getURL("config/configTest4_Home.html")
		mainBar.classList.add('divHidden');
		blocklist.classList.remove('divHidden');
	})

	whitelistDiv.addEventListener( 'click', function() {
		console.log("Clicked");
		//document.location = chrome.extension.getURL("config/configTest4_Home.html")
		mainBar.classList.add('divHidden');
		whitelist.classList.remove('divHidden');
	})

	helpDiv.addEventListener( 'click', function() {
		console.log("Clicked");
		//document.location = chrome.extension.getURL("config/configTest4_Home.html")
		mainBar.classList.add('divHidden');
		help.classList.remove('divHidden');
	})


	aboutusDiv.addEventListener( 'click', function() {
		console.log("Clicked");
		//document.location = chrome.extension.getURL("config/configTest4_Home.html")
		mainBar.classList.add('divHidden');
		aboutus.classList.remove('divHidden');
	})

	futurescopeDiv.addEventListener( 'click', function() {
		console.log("Clicked");
		//document.location = chrome.extension.getURL("config/configTest4_Home.html")
		mainBar.classList.add('divHidden');
		futurescope.classList.remove('divHidden');
	})



	for (const oneBackcard of backcard) {
		oneBackcard.addEventListener( 'click', function() {
			console.log("Clicked");
			//document.location = chrome.extension.getURL("config/configTest4_Home.html")
			mainBar.classList.remove('divHidden');
			home.classList.remove('divHidden');
			allDivList = mainContentSection.children;
	
			for (let index = 0; index < allDivList.length; index++) {
				const oneDiv = allDivList[index];
				oneDiv.classList.add("divHidden");
			}
	
		})
	}
	



	/**  */
	function dbConnectionInitialization(){
		db.defaults({
			certifiedList: [],
			blockList: [],
			whiteList: [],	
		}).write();
	}


	/* send Data to whiteList */
	function initializeAllTables() {
		requestMessage = { reqMessage: "sendBlockList", tabId: "UnKnown" };
		sendMessage(requestMessage);
		requestMessage = { reqMessage: "sendCertifiedList", tabId: "UnKnown" };
		sendMessage(requestMessage);
		requestMessage = { reqMessage: "sendWhiteList", tabId: "UnKnown" };
		sendMessage(requestMessage);
	}
	
	/* Example Of Data inside the blockList Array: blockHostsDetails { hostnameKeyword: "google.com", urlKeyword: "/images" } */
	function addToBlockHostsTable(response) {
		count = 1 ;
		actionButton = createActionButton("removeRow");
		for ( oneBlockHostDetails of response ) {
			console.log(oneBlockHostDetails);
			addTableData("blockHostsDetails", count, oneBlockHostDetails, actionButton);
			count++;
		}
		// Add DataTables to the Table
		$("#blockHostsDetails").DataTable({
			destroy: true
		  });
	}
	
	/* Example Of Data inside the certifiedList Array: certifiedHostsDetails: { certifiedHost: "google.com", certifiedFor: "Google" } */
	function addToCertifiedHostsTable(response) {
		count = 1 ;
		actionButton = createActionButton("removeRow");
		for ( oneCertifiedHostDetails of response ) {
			console.log(oneCertifiedHostDetails);
			addTableData("certifiedHostsDetails", count, oneCertifiedHostDetails, actionButton);
			count++;
		}
		// Add DataTables to the Table
		$("#certifiedHostsDetails").DataTable({
			destroy: true
		  });
	}
	

	/* Example Of Data inside the blockList Array: whiteListHostsDetails { hostnameKeyword: "express.com", urlKeyword: "" } */
	function addToWhiteListHostsTable(response) {
		count = 1 ;
		actionButton = createActionButton("removeRow");
		for ( onewhiteListHostDetails of response ) {
			console.log(onewhiteListHostDetails);
			addTableData("whiteListHostsDetails", count, onewhiteListHostDetails, actionButton);
			count++;
		}
		// Add DataTables to the Table
		$("#whiteListHostsDetails").DataTable({
			destroy: true
		  });
	}

	
	function addTableData(tableId, count, data, actionButton) {
		keys = Object.keys(data);
		values = Object.values(data);
		tableData = [];
		for ( i = 0; i < keys.length; i++ ) {
			tableData[i] = `<td>` + values[i] + `</td>`;
		}
		tableId = "#" + tableId + "";
		table = $(tableId).DataTable();

		console.log([count, tableData[0], tableData[1] , actionButton]);
		table.row.add([count, tableData[0], tableData[1] , actionButton]);

		/*
		$(tableId).append(
			  `<tr>` +
				`<td>` + count + `</td>` +
				tableData +
				`<td>` + actionButton + `</td>` +
			  `</tr>`
			);
			*/
	}
	
	/* Leave it to static NO dynamic new button can be added 2 buttons are specfied they will be added with the class */
	function createActionButton(deleteClassName){
		return `<button type="button" class="btn btn-danger btn-sm ` + deleteClassName + `">Delete</button>`;
	}
	
	
	function addAllEvents() {
		
		console.log("addAllEvents");
		
		$('#certifiedHostsDetails, #whiteListHostsDetails, #blockHostsDetails').on('click', 'button.removeRow', function() {

			tableId = $(this).closest("table").attr('id');
			tableId = "#" + tableId;			/* Reframe TableId for Processing */
			selectedTR = $(this).parents('tr'); /* find TR in which the Button is */
			table = $(tableId).DataTable({
				destroy: true
			  }); 
			table.row(selectedTR)
					.remove()
					.draw(false);
			
			firstTR_Size = $(tableId + " tbody tr:nth-child(1) td").length;
			if ( firstTR_Size > 1 ) {
				$(".addToDatabase").prop("disabled", false);
			}
			else{
				$(".addToDatabase").prop("disabled", true);
			}

		});
		
		$('#certifiedHostsDetails, #whiteListHostsDetails, #blockHostsDetails').on('click', 'tbody tr', function() {
			
			tableFieldName = $(this).find("td:nth-child(2)").text();
			tableFieldValue = $(this).find("td:nth-child(3)").text();

			console.log("tableFieldName: " + tableFieldName + ", tableFieldCompany: " + tableFieldValue);
			
			$('#detailsShowModal').modal("show");
			$("#detailsShowModal_Name").val(tableFieldName);
			$("#detailsShowModal_Value").val(tableFieldValue);
			
			mainTR = this;
			$('#detailsShowModal_ApplyModal').on('click', function (event) {
				name =  $('#detailsShowModal_Name').val();
				value = $('#detailsShowModal_Value').val();
				console.log("name : " + name + " value : " + value );
				$(mainTR).closest("tr").find("td:nth-child(2)").text(name);
				$(mainTR).closest("tr").find("td:nth-child(3)").text(value);
			});
			
		});
		
		/* Remove Click Event from First and Last Column *NOT NEEDED AS THIS IS DISABLING ALL CLICK EVENTS ON THESE SELECTORS */
		$('#certifiedHostsDetails, #whiteListHostsDetails, #blockHostsDetails').on('click', 'tbody tr td:first-child, tbody tr td:last-child', function(e) {
			e.stopPropagation();
		});

		$('.addTableData').on('click', function() {
			console.log("Inside .addTableData");
			buttonOfTable = this;
			
			$('#addNewDataModal').modal("show");
			$("#addNewDataModal_Name").val("");
			$("#addNewDataModal_Value").val("");
			
			//$('#addNewDataModal_ApplyModal').on('click', function (event) { /* Previous Code */
			$('#addNewDataModal_ApplyModal').click( function (event) {
				
				name =  $('#addNewDataModal_Name').val();
				value = $('#addNewDataModal_Value').val();
				console.log("Inside .addNewDataModal_ApplyModal");
				
				tableId = $(buttonOfTable).parent("div").find("table").attr('id');
				countText = $("#" + tableId + " tr:last td:first").text();
				
				/* Check if CountText is String or Numeric, If it is Numeric then Data is Present parseInt it else No Data is Present in table Start counter with 1 */
				if (!isNaN(countText)) {
					count =  parseInt( countText ) + 1;
				} else {
					count = 1
				}
				
				data = { hostnameKeyword: name, urlKeyword: value };
				actionButton = createActionButton("removeRow");
				
				console.log("tableId : " + tableId + ", count: " + count + " data: ", data );

				$("#" + tableId).DataTable({
					destroy: true
				  }).row.add([
					  count, name, value, actionButton
					]).draw();
				$(this).off('click'); /* Remove Click Listener */
				
				if( $(".addToDatabase").prop("disabled") ) { /* Check if the Button is Disabled -> Then Enable it */
					$(".addToDatabase").prop("disabled", false); /**/
				}
				
			});
			
		});
		
		
		$('.addToDatabase').on('click', function() {
			
			tableMyIdentifier = $(this).parent("div").find("table").attr('myIdentifier');
			tableId = $(this).parent("div").find("table").attr('id');
			tableId = '#'+tableId;
			console.log("onCLick addToDatabase:  [ tableId : " + tableId + " ] [ tableMyIdentifier: " + tableMyIdentifier + " ]");
			
			tableHeadKey = $(tableId + ' thead tr th:nth-child(2)').attr('myIdentifier');
			tableHeadValue = $(tableId + ' thead tr th:nth-child(3)').attr('myIdentifier');
			
			console.log("onCLick addToDatabase:  [ tableHeadKey : " + tableHeadKey + " ] [ tableHeadValue: " + tableHeadValue + " ]");
			
			/* Empty Previous Data [Right Now Best Approach for no neccessary wrong Data]*/
			console.log("Data inside DB is -----------------> ", db)
			db.set(tableMyIdentifier, [])
				.write();
			
			allTbodyTR = tableId + ' tbody tr';

			$(allTbodyTR).each(function (a, b) {
				var key = $(this).find("td:nth-child(2)").text();
				var value = $(this).find("td:nth-child(3)").text();
				db.get(tableMyIdentifier)
					.push({ [tableHeadKey]: key, [tableHeadValue]: value })
					.write();
			});
	
			console.log(db.get(tableMyIdentifier).value());
			
			/*
			const state = db.getState()
			str = JSON.stringify(state, null, 2);
			$('#displayLogs').text(str);
			console.log(str);
			*/
			toastr.success("Added To DataBase");
			/* Also Update all the blocklist, whiteList & certifiedList */
			requestMessage = { reqMessage: "refreshListsUsingDB", tabId: "UnKnown" };
			sendMessage(requestMessage);

		});
				
			
	}

	function sendMessage(requestMessage) {
		/* Execute this Chrome.Tabs API [query] to actually get the Tab Id on which this Popup is openend up and then sendMessage to the Respective other JS Code */
		chrome.tabs.query( { currentWindow: true, active: true },
			function (tabs) { 
				activeTab = tabs[0];
				requestMessage.tabId = activeTab.id;
				chrome.runtime.sendMessage(
					requestMessage,
					function (response) {
						console.log("Request Send With Data: [", requestMessage, "] Response Received: [", response, "]");
						if (response.error_code) {
							console.log("Error received in Response: [ ", response.error_code, "->", response.error_reason, "]");
							$("#errorDisplay").text(response.error_reason);
						}
						else {
							console.log("Success received in Response: [ ", response.success_code, "->", response.success_reason, "]");
							if (requestMessage.reqMessage === "sendBlockList" ) {
								addToBlockHostsTable(response);
							}
							if ( requestMessage.reqMessage === "sendCertifiedList" ){
								addToCertifiedHostsTable(response);
							}
							if ( requestMessage.reqMessage === "sendWhiteList" ){
								addToWhiteListHostsTable(response);
								addAllEvents(); /* ADD All Events */
							}
							if ( requestMessage.reqMessage === "refreshListsUsingDB" ){
								toastr.success(response.success_reason);
							}
							if ( requestMessage.reqMessage === "getDB_Instance" ){
								toastr.success(response.success_reason);
								db = response.success_code;
								console.log("Response from background.js in db is ", response.success_code, { db });
								return db;
							}
						}
					}
				);
			}
		);
	}
});