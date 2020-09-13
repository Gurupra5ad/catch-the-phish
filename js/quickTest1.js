$(document).ready(function() {

    var myDataTable = $("#myDataTable").DataTable({ lengthChange: true });

    /*
    var myDataTableColumns = [
                                { title: "atTime" },
                                { title: "cacheStatus" },
                                { title: "clientIP" },
                                { title: "cnameList" },
                                { title: "dnsQueryType" },
                                { title: "domainName" },
                                { title: "domainName_Proper" },
                                { title: "ipAddressList" },
                                { title: "keyIdentifier" },
                                { title: "policyApplied" },
                                { title: "rootDnsServerWhoProvided" },
                                { title: "status" },
                                { title: "timeStatsInMillis" },
                                { title: "webCategory" }
                            ];
    */

    var myDataTableColumns = [
                                    { data: "atTime" },
                                    { data: "cacheStatus" },
                                    { data: "clientIP" },
                                    { data: "cnameList" },
                                    { data: "dnsQueryType" },
                                    { data: "domainName" },
                                    { data: "domainName_Proper" },
                                    { data: "ipAddressList" },
                                    { data: "keyIdentifier" },
                                    { data: "policyApplied" },
                                    { data: "rootDnsServerWhoProvided" },
                                    { data: "status" },
                                    { data: "timeStatsInMillis" },
                                    { data: "webCategory" }
                                ];


     // Important Functions [COPIED]
    function isIterable(object) {
          // checks for null and undefined
          if (object == null) {
              return false;
          }
          return typeof object[Symbol.iterator] === 'function';
     }

    /** Load Test Data Just to Check if Data can be Added in Table Using Simple 1 Json Data from Server **/
    $("#loadData_Test").click(function() {
        var customUrl = "http://localhost:8080/testjsondata";
        console.log("Using URL -> " + customUrl);
        populateDataUsingAJAX_Call('get', customUrl);
        //populateMyDataTable(actualDataJsonArray);
    });

    /** Load Actual Select Query Data with Limit 1000 Just to Check if Data can be Added in Table Using Complex [ Java ArrayList<> To JsonArray ] Json Data from Server **/
    $("#loadData_Actual").click(function() {
        var customUrl = "http://localhost:8080/sendallsqldata";
        console.log("Using URL -> " + customUrl);
        populateDataUsingAJAX_Call('get', customUrl);
        //populateMyDataTable(actualDataJsonArray);
    });

    // loadData_CustomUrl
    $("#loadData_CustomUrl").click(function() {
            var urlIdentity = $("#urlIdentity").val();
            var sqlLimit = $("#sqlLimit").val();
            console.log("Using URL [$(\"#urlIdentity\").val();] -> ", { urlIdentity }, ", Using SqlLimit [$(\"#sqlLimit\").val();] -> ", { sqlLimit });
            postData = { "url": urlIdentity, "sqlLimit": sqlLimit };
            console.log("[PostData -> ", { postData });
            populateDataUsingAJAX_Call_Post('post', urlIdentity, postData);
            //populateMyDataTable(actualDataJsonArray);
    });


    function populateDataUsingAJAX_Call_Post(method, customUrl, postData) {

            $.ajax({
                type: method,
                url: customUrl,
                contentType: "text/plain",
                dataType: 'json',
                data: JSON.stringify(postData),
                success: function (data) {
                    myJsonData = data;
                    console.log("[Success] Received Data as shown below");
                    console.log( { myJsonData } );
                    populateMyDataTable(myJsonData);
                },
                error: function (e) {
                    console.log("[Error] There was an error with your request...", JSON.stringify(e));
                }
            });
    }

    function populateDataUsingAJAX_Call(method, customUrl) {

        $.ajax({
            type: method,
            url: customUrl,
            contentType: "text/plain",
            dataType: 'json',
            success: function (data) {
                myJsonData = data;
                console.log("[Success] Received Data as shown below");
                console.log( { myJsonData } );
                populateMyDataTable(myJsonData);
            },
            error: function (e) {
                console.log("[Error] There was an error with your request...", JSON.stringify(e));
            }
      });

    }

    // populate the data table with JSON data
    function populateMyDataTable(rowData) {

        console.log("Data to be Populated in myDataTable -> [", { rowData }, "], Before Doing so Call clear() to Clear Previous DataTable Record");

        myDataTable.clear();

        // table.rows.add(

        //console.log( " TRYING THIS myDataTable.rows.add( JSON.stringify(data) ); " );
        //myDataTable.rows.add( JSON.stringify(data) );

        // destroy: true,


        if (isIterable(rowData)) {
            console.log("Data is Iterable. Do Not Modify the JsonData Array ");
        } else {
            rowData = new Array(rowData);
            console.log("Data is NOT Iterable. make the Json Data as Array as -> ", rowData);
        }

        myDataTable = $("#myDataTable").DataTable({
                                        destroy: true,
                                        data: rowData,
                                        columns: myDataTableColumns
                                        });

        /*
        if (isIterable(data)) {
            console.log("Data is Iterable.");
            for ( oneData of data ) {
                testData = Object.values(oneData);
                console.log(testData);
                myDataTable.row.add(testData)
            }
        } else {
            console.log("Data is NOT Iterable.");
            testData = Object.values(data);
            console.log(testData);
            myDataTable.row.add(testData)
        }
*/
        myDataTable.draw();// Add new data
      }

});