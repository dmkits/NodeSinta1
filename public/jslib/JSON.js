define(["dojo/request/xhr", "dojo/domReady!"],
    function (xhr) {
        return {

            jsonHeader: {"X-Requested-With": "application/json; charset=utf-8"},

            getJSONData: function (params, callback) {
                if (!params) return;

                var url = params["url"], condition = params["condition"], consoleLog = params["consoleLog"];
                if (condition) url = url + "?" + condition;
                xhr.get(url, {headers: this.jsonHeader, handleAs: "json"}).then(
                    function (data) {
                        if (callback)callback(true, data);
                    }, function (error) {
                        if (showRequestErrorDialog) doRequestErrorDialog();
                        if (consoleLog) console.log("getJSONData ERROR! url=", url, " error=", error);
                        if (callback)callback(false, error);
                    });
            },

            postJSONData: function (params, callback) {
                if (!params) return;
                var url = params["url"], condition = params["condition"], consoleLog = params["consoleLog"];
                if (condition) url = url + "?" + condition;
                xhr.post(url, {headers: this.jsonHeader, handleAs: "json", data: params["data"]}).then(
                    function (data) {
                        if (callback)callback(true, data);
                    }, function (error) {
                        if (showRequestErrorDialog)  doRequestErrorDialog();
                        if (consoleLog) console.log("postJSONData ERROR! url=", url, " error=", error);
                        if (callback)callback(false, error);
                    });
            }
        }
    });