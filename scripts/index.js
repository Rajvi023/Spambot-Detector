(function () {
	Split({
		columnGutters: [
		{
			track: 1,
			element: document.querySelector('#grid-col1col2-gutter'),
		},
		{
			track: 1,
			element: document.querySelector('#grid-col1-row2-col1col2-gutter'),
		},
		{
			track: 3,
			element: document.querySelector('#grid-col1-row2-col2col3-gutter'),
		}
		],
		rowGutters: [{
			track: 1,
			element: document.querySelector('#grid-col1-row1row2-gutter'),
		},
		{
			track: 3,
			element: document.querySelector('#grid-col1-row2row3-gutter'),
		}]
	});
	
	dRViewContainer = d3.select('#dRViewContainer');
	dRClusterView = new ClusterView(document.getElementById('dRViewScatterPlot'), document.getElementById('dRViewContainer'));
	tCViewScatterPlotContainer = d3.select('#tCView-scatterPlotContainer');
	tCViewScatterPlot = new ScatterPlot(document.getElementById('tCView-ScatterPlot'), document.getElementById('tCView-scatterPlotContainer'));
	wc = new wordCloud('#tCView-wordCloudContainer');
	window.tcvwcControl = {
		minSize: 10,
		maxSize: 10
	}
	tcvwcControl.update = function() {
		var minSizeSlider = document.getElementById('topicFontSizeRangeMin').value;
		var maxSizeSlider = document.getElementById('topicFontSizeRangeMax').value;
		tcvwcControl.minSize = parseInt(minSizeSlider);
		tcvwcControl.maxSize = parseInt(maxSizeSlider);
		wc.updateSize();
	}
	
	document.getElementById('topicFontSizeRangeMin').onchange = tcvwcControl.update;
	document.getElementById('topicFontSizeRangeMax').onchange = tcvwcControl.update;
	
	tCViewScatterPlot.selectedUsers = []
	var tCToolTip = tCViewScatterPlot.createTooltip('scatterPlotTooltip');
	tCViewScatterPlot.selectDots = function(userList) {		
		console.log('Coloring TCV dots');
		tCViewScatterPlot.dots.attr('fill', function(d) {
			var fill_color = 'black';
			d.users.forEach(function(userid) {
				if(userList.includes(userid + '')) {
					fill_color = 'red';
				}
			});
			return fill_color;
		});
	}
	
	tCViewScatterPlot.updateSelected = function() {
		var remainingSelectedUsers = []
		for (var key in selectedUsers) {
		
			if (selectedUsers.hasOwnProperty(key)) {           
				remainingSelectedUsers.push(selectedUsers[key].id);
			}
		}
		tCViewScatterPlot.selectDots(remainingSelectedUsers);
	}
	
	
	
	window.updateTcvView = tCViewScatterPlot.updateSelected;
	
	tCViewScatterPlot.clearSelection = function() {
		tCViewScatterPlot.dots.attr('fill', 'black');
	}
	timeLineView = new TimeLineView();
	
	function drawViews(error, cf_results, tweets, tsne, tweets_per_year_labeled,tweets_per_year_features) {
		
		var label = {}
		
		cf_results.forEach(function(d) {
			label[d['twitter_user_id']] = d['class']
		});
		window.label = label;
		
		//TimeLineView Change on different feature selection
		var timeLineType = d3.select("#Timeline_Y_axis_Select");
		
		/*var tweetRadioButton = d3.select("#timeLine_tweets_radio_button");
		var retweetRadioButton = d3.select("#timeLine_retweet_radio_button");
		var replyRadioButton = d3.select("#timeLine_reply_radio_button");
		var favoriteRadioButton = d3.select("#timeLine_favorite_radio_button");
		*/
		timeLineType.on("change", TimeLineSelectionOptionChanged);
		
		/*tweetRadioButton.on("change", TimeLineSelectionOptionChanged);
		retweetRadioButton.on("change", TimeLineSelectionOptionChanged);
		replyRadioButton.on("change", TimeLineSelectionOptionChanged);
		favoriteRadioButton.on("change", TimeLineSelectionOptionChanged);
		*/
		window.timeLineData = tweets_per_year_labeled;
		function TimeLineSelectionOptionChanged() {
			//console.log("changed");
			
			timeLineView.draw("year", ["2007","2008","2009","2010","2011", "2012", "2013","2014","2015"], [], window.timeLineData);
		}
		timeLineView.draw("year", ["2007","2008","2009","2010","2011", "2012", "2013","2014","2015"], [], window.timeLineData);
		//TimeLineView Change End

		var computeDRFields = d3.select('#ComputeDRFields');
		computeDRFields.on('click', DisplayDimenstionView);

		function DisplayDimenstionView(){
			var algo = d3.select('input[name="DRTechnique_Selector"]:checked').node().value;
			var transformation = d3.select('input[name="DimensionTransformation"]:checked').node().value;
			var params={
				'transformation': transformation
			};
			if(algo==='tsne'){
				params["perplexity"] = parseInt(document.getElementById("perplexity_input").value, 10);
				params["early_exaggeration"] = parseInt(document.getElementById("early_exaggeration_input").value, 10);
				params["lr"] = parseInt(document.getElementById("learning_rate_input").value, 10);
			}
			else if(algo === 'pca'){
				params["kernel"] = d3.select("#KernalTypesSelector").node().value;
				params["gamma"] = parseInt(document.getElementById("Gamma_input").value, 10);
				params["degree"] = parseInt(document.getElementById("Degree_input").value, 10);
				params["coef0"] = parseInt(document.getElementById("coef0_input").value, 10);
			}
			else{
				params["n_neighbors"] = parseInt(document.getElementById("n_neighbors_input").value, 10);
			}
			//console.log(params);

			flask.getClusterData(algo, params, function(data){
				var DRDots = dRClusterView.draw(data, "user_id", "x", "y", algo.concat("-1"), algo.concat("-2"));
			});
		}

		flask.getClusterData("lle", {'transformation': 'none', 'n_neighbors':3}, function(data){
			var DRDots = dRClusterView.draw(data, "user_id", "x", "y", "lle-1", "lle-2");
		});

		tCViewScatterPlot.updateTCV = function(userList) {
			flask.getTCVData(userList, 50, function(data){
				console.log('Draw topic cluster view');
				var tCVdots = tCViewScatterPlot.draw(data, "word", "polarity", "subjectivity", "polarity", "subjectivity", null);
				tCViewScatterPlot.dots = tCVdots;
				tCViewScatterPlot.changeScale('xy', [-1,1]);
				
				wc.update(data);
				
				tCVdots.on("mouseover", function(d){
							return tCToolTip.style("visibility", "visible");}
						)
						.on("mousemove", function(d){
							var htmlText = "<b>" + d.word + "</b>"
							return tCToolTip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").html(htmlText);
						})
						.on("mouseout", function(d){
							return tCToolTip.style("visibility", "hidden");}
						)
						.on("click", function(d){
							if(selectionOption == 0) {
								d.users.forEach(function(userID) {onAdding(userID)});
							}
							else {
								d.users.forEach(function(userID) {onRemoving(userID)});
							}							
						});
						tCViewScatterPlot.updateSelected();
			});
		}
		
		
		
		tCViewScatterPlot.updateWithSelectedUsers = function() {
			var remainingSelectedUsers = []
			for (var key in selectedUsers) {
		
				if (selectedUsers.hasOwnProperty(key)) {           
					remainingSelectedUsers.push(selectedUsers[key].id);
				}
			}
			tCViewScatterPlot.updateTCV(remainingSelectedUsers);
			
		}
		
		window.updateTCVDataset = tCViewScatterPlot.updateWithSelectedUsers;
		
		document.getElementById('updateTCV').onclick = function() {
			tCViewScatterPlot.updateWithSelectedUsers();
			
		}
		
		
		
		tCViewScatterPlot.updateTCV([]);

		

		drawActivityView();

		refreshFeatureExplorer();
	}
	
	d3_queue.queue().defer(d3.csv, "./data/crowdflower_sample.csv/crowdflower_results_detailed.csv")
		.defer(d3.csv, "./data/genuine_accounts_sample.csv/tweets.csv") 
		.defer(d3.csv, "./data/tsne.csv") 
		.defer(d3.csv, "./data/tweets_per_year_labeled.csv")
		.defer(d3.csv, "./data/tweets_per_year_features.csv")
		.await(drawViews);
	

}());
