function TimeLineView() {

	var currentView = 'year';
	var margins = {
        top: 15,
        bottom: 15,
        left: 15,
        right: 15,
        rightAdjust: 15
    };
	var adjust = 10;
	var yAxisDivElement = document.getElementById('timeLineViewYAxis');
	var boxPlotDivElement = document.getElementById('tLV-boxPlotContainer');
	
	var yScale = d3.scaleLinear();
	var svg = d3.select(yAxisDivElement).append("svg").attr("width","100%").attr("height","100%");
	var box = svg.node().getBoundingClientRect();

        var graphWidth = box.width - margins.left - margins.right - margins.rightAdjust;
        var graphHeight = box.height - margins.top - margins.bottom;
		yScale.range([graphHeight+10, 0])
                    .domain([0, 4000]);
		var yAxis = svg.append("g").attr("id","TimeLineY");
		yAxis.attr("transform", "translate(" + (margins.right + margins.rightAdjust+7) + ", " + (10 - 2) + ")")
                    .call(d3.axisLeft(yScale).tickSize(0));
    var boxElements = [];

	var reScale = function() {
        

    };

    //this.reScale = reScale;

    this.draw = function(viewLevel, year, month, data1) { //data1:tweets_per_year_labeled data2:tweets_per_year_features
	//d3.selectAll("#timeLineViewYAxis").selectAll("svg").remove();
	d3.selectAll("#TimeLineYOut").remove();
		while (boxPlotDivElement.firstChild) {
			boxPlotDivElement.removeChild(boxPlotDivElement.firstChild);
		}
		var typeText = document.getElementById('Timeline_Y_axis_Select').options[document.getElementById('Timeline_Y_axis_Select').selectedIndex].value; 
        /*var typeText="tweets";      
            for(i = 0; i < yType.length; i++) { 
                if(yType[i].checked){
					console.log(yType[i].value); 
					typeText = yType[i].value;
					break;
				}
			}*/
		var yAxisDivElement = document.getElementById('timeLineViewYAxis');
		//var boxPlotDivElement = document.getElementById('tLV-boxPlotContainer');
		var yScale = d3.scaleLinear();
		var ty = d3.select("#TimeLineY");
		var svg = d3.select(yAxisDivElement).append("svg").attr("id","TimeLineYOut").attr("width","100%").attr("height","100%");
		var box = svg.node().getBoundingClientRect();
        var graphHeight = box.height - margins.top - margins.bottom;
			d3.selectAll("#TimeLineY").selectAll("#TLViewYLabel").remove();
			d3.select("#TimeLineY").append("text")
				.attr("id","TLViewYLabel")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin.left*2-10)
				.attr("x",0 - (graphHeight / 2))
				.attr("dy", "10em")
				.attr("fill","black")
				.style("text-anchor", "middle")
				.text("# of tweets");
		if(typeText=="tweets"){
		  

			yScale.range([graphHeight+10, 0])
                    .domain([0, 4000]);
			ty.attr("transform", "translate(" + (margins.right + margins.rightAdjust+7) + ", " + (10 - 2) + ")")
                    .call(d3.axisLeft(yScale).tickSize(0));
			
		}else if(typeText=="retweet"){
			document.getElementById("TLViewYLabel").innerHTML="# of retweets";
				yScale.range([graphHeight+10, 0])
                    .domain([0, 22029218]);
			
			ty.attr("transform", "translate(" + (margins.right + margins.rightAdjust+7) + ", " + (10 - 2) + ")")
                    .call(d3.axisLeft(yScale).tickSize(0).tickFormat(d3.formatPrefix(".1", 1e6)));
			
		}else if(typeText=="hashtag"){
			document.getElementById("TLViewYLabel").innerHTML="# of hashtags in tweets";  
			yScale.range([graphHeight+10, 0])
                    .domain([0, 4672]);
			ty.attr("transform", "translate(" + (margins.right + margins.rightAdjust+7) + ", " + (10 - 2) + ")")
                    .call(d3.axisLeft(yScale).tickSize(0));
			
		}else if(typeText=="favorite"){
			document.getElementById("TLViewYLabel").innerHTML="# of favorites";  
			yScale.range([graphHeight+10, 0])
                    .domain([0, 14726]);
			ty.attr("transform", "translate(" + (margins.right + margins.rightAdjust+7) + ", " + (10 - 2) + ")")
                    .call(d3.axisLeft(yScale).tickSize(0));

		}
		//var yAxis = svg.append("g");
		//ty.attr("transform", "translate(" + (margins.right + margins.rightAdjust+7) + ", " + (10 - 2) + ")")
          //          .call(d3.axisLeft(yScale).tickSize(0));

		if(viewLevel == "year") {			
			year.forEach(function(d, i) { 
				result = data1.filter(({ timestamp })=> d==timestamp);
				var divElement = document.createElement("div");
				divElement.style.display = "inline-block";
				divElement.style.width = Math.max(98/year.length, 0) + "%";
				divElement.style.height = "99%";
				divElement.style.background = "#F5F5F5";
				divElement.style.marginRight = "2px";
				//divElement.innerHTML = d;
				var svg = d3.select(divElement).append("svg").attr("id","tLViewPlotSvg" + i).style("width","100%").style("height","100%");
				boxPlotDivElement.appendChild(divElement);
				var boxPlot = new timeLineBox(document.getElementById('tLViewPlotSvg' + i), divElement, result, d, 0,typeText);
				
			});
		}
		else if(viewLevel == "month") {
			
		}
		else if(viewLevel == "day"){
			
		}
        

    };

    //new ResizeObserver(this.reScale).observe(parentDivElement);

}
