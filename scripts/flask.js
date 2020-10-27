(function() {
	$.ajaxSetup({
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
	
	var getTCVData = function(user_ids, count, callback) {
		var dataset = 1;
		$.post("http://localhost:5000/tcv", JSON.stringify({"user_ids": user_ids, "count": count, "dataset": dataset}), function(data, status){
			//d3.json(data, function(error, d3data) {
				callback(data);
			//});
			
		}, "json");
	};
	
	var getClusterData = function (algo, params, callback) {
        $.post("http://localhost:5000/cluster", JSON.stringify({"algo": algo, "params": params}), function(data, status){
            callback(data);
		}, "json");
    };
	
	var getTimelineData = function(year, month, day, view, callback) {
		$.post("http://localhost:5000/timeline", JSON.stringify({"year": year, "month": month, "day": day, "view": view}), function(data, status){
			callback(data);
		}, "json");
	};

	window.flask = {
		getTCVData: getTCVData,
		getClusterData: getClusterData,
		getTimelineData: getTimelineData
	}
}());