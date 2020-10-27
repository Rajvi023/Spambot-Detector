function timeLineBox(svgElement, parentDivElement,data1,year,startX,type) {
window.selectionOption = 0; // 0 - Add | 1 - Delete

var addRadioButton = d3.select("#add_radio_button");
var deleteRadioButton = d3.select("#delete_radio_button");

addRadioButton.on("change", SelectionOptionChanged);
deleteRadioButton.on("change", SelectionOptionChanged);


function SelectionOptionChanged() {
    var radios = document.getElementsByName('selection_option');
    var option;
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            option = radios[i].value;
            break;
        }
    }

    switch(option) {
        case "add":
            window.selectionOption = 0;
            break;
        case "delete":
            window.selectionOption = 1;
            break;
    }
}

var clickFn = function(){ // Call this function when uid in any view is selected with add
		d3.selectAll("#TLViewGreen").filter(function(d){
				return d["user_id"] in window.selectedUsers;})
			.attr('fill','red');
		d3.selectAll("#TLViewPurple").filter(function(d){
				return d["user_id"] in window.selectedUsers;})
			.attr('fill','red');
		d3.selectAll("#TLViewBlue").filter(function(d){
				return d["user_id"] in window.selectedUsers;})
			.attr('fill','red');
		
	};

var clickRemoveFn = function(uid){ // Call this function when uid in any view is selected with subtract
		d3.selectAll("#TLViewGreen").filter(function(d){
				return d["user_id"] == uid;})
			.attr('fill','green');
		d3.selectAll("#TLViewPurple").filter(function(d){
				return d["user_id"] == uid;})
			.attr('fill','purple');
		d3.selectAll("#TLViewBlue").filter(function(d){
				return d["user_id"] == uid;})
			.attr('fill','blue');
	};

if(type == "tweets"){
	var svg = d3.select(svgElement);

    var margins = {
        top: 15,
        bottom: 15,
        left: 15,
        right: 15,
        rightAdjust: 15
    };
	spamBox=[];
	genuineBox=[];
	unableBox=[];
	data1.forEach(function(d){
		if(window.label[d["user_id"]]=="spambot"){
			spamBox.push(parseInt(d.tweets));
		}else if(window.label[d["user_id"]]=="genuine"){
				genuineBox.push(parseInt(d.tweets));
		}else if(window.label[d["user_id"]]=="unable"){
				unableBox.push(parseInt(d.tweets));
		}
	});
	this.svg = svg;
	var yearT = year;
    var xScale1 = d3.scaleLinear();
	var xScale = d3.scaleOrdinal().range([0,30,70,90]);
    var yScale = d3.scaleLinear();
    var xScale2 = d3.scaleLinear();
	var tempData = [["0001","Genuine","200"],["0002","Unlabeled","500"],["0003","Spam","600"],["0001","Genuine","700"]];
	
    var adjust = 10;
    //var xAxis = this.svg.append("g");
	if(year=="2007")
		var yAxis = this.svg.append("g");
	
        var box = svg.node().getBoundingClientRect();

        var graphWidth = box.width - margins.left - margins.right - margins.rightAdjust;
        var graphHeight = box.height - margins.top - margins.bottom;
	
	xScale1.range([90, 90])
                  .domain(d3.extent(tempData, function(d,i){ return 0;}));
    yScale.range([graphHeight+10, 0])
                    .domain([0, 4000]);
	
	
	//boxPlot code
	spamBox=spamBox.sort(d3.ascending);
	genuineBox=genuineBox.sort(d3.ascending);
	unableBox=unableBox.sort(d3.ascending);
    
	var sq1 = d3.quantile(spamBox, .25);
	var smedian = d3.quantile(spamBox, .5);
	var sq3 = d3.quantile(spamBox, .75);
	var sinterQuantileRange = sq3 - sq1;
	
	var gq1 = d3.quantile(genuineBox, .25);
	var gmedian = d3.quantile(genuineBox, .5);
	var gq3 = d3.quantile(genuineBox, .75);
	var ginterQuantileRange = gq3 - gq1;
	
	var uq1 = d3.quantile(unableBox, .25);
	var umedian = d3.quantile(unableBox, .5);
	var uq3 = d3.quantile(unableBox, .75);
	var uinterQuantileRange = uq3 - uq1;
	
	
	//boxPlot Genuine
	svg.append("rect")
	  .attr("x", 20)
	  .attr("y", yScale(gq3) )
	  .attr("height", (yScale(gq1)-yScale(gq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "green")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([gmedian])
	.enter()
	.append("line")
	.attr("x1", 20)
	.attr("x2", 40)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	
	//boxPlot Spam
	svg.append("rect")
	  .attr("x", 40)
	  .attr("y", yScale(sq3) )
	  .attr("height", (yScale(sq1)-yScale(sq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "Purple")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([smedian])
	.enter()
	.append("line")
	.attr("x1", 40)
	.attr("x2", 60)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	//boxPlot Unable
	svg.append("rect")
	  .attr("x", 60)
	  .attr("y", yScale(uq3) )
	  .attr("height", (yScale(uq1)-yScale(uq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "Blue")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([umedian])
	.enter()
	.append("line")
	.attr("x1", 60)
	.attr("x2", 80)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	//boxPlot end
	
	 var tooltip = d3.select("#tLV-boxPlotContainer")
		.append("div")
		.style("background-color", "white")
		.style("color","black")
		.style("opacity",0.8)
		.style("position", "absolute")
		.style("z-index", "1")
		.style("visibility", "hidden");
		
	
	
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20)
		.attr("x2", 100)
		.attr("y2", graphHeight+20)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
	
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
		
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-2*graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-2*graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
	
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-3*graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-3*graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
	var circle = svg.selectAll("circle").data(data1).enter();
	circle.filter(function(d){return window.label[d["user_id"]] == "genuine"})
                    .append('circle')
					.attr("id","TLViewGreen")
                    .attr("cx", startX+30 )
                    .attr("cy", function (d) { return yScale(d["tweets"]); } )
                    .attr("r", 4)
                    .attr("transform", "translate(0,10)")
                    .attr('fill','green')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["tweets"]+"</font></div>");
					})
	.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	.on("mouseout", function(){
		d3.select(this).attr("stroke-width",0);
		return tooltip.style("visibility", "hidden");})
	.on("click",function(d){
		if(window.selectionOption == 0){
				onAdding(d["user_id"]);
		}else{
				onRemoving(d.user_id);
			}
	});
	
	
	circle.filter(function(d){return window.label[d["user_id"]]=="spambot"}).append('circle')
					.attr("id","TLViewPurple")
					.attr("cx", startX+50 )
                    .attr("cy", function (d) { return yScale(d["tweets"]); } )
                    .attr("r", 4)
					.attr("transform", "translate(0,10)")
                    .attr('fill','Purple')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["tweets"]+"</font></div>");
					})
					.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
					.on("mouseout", function(){
						d3.select(this).attr("stroke-width",0);
						return tooltip.style("visibility", "hidden");})
					.on("click",function(d){
					if(window.selectionOption == 0){
							onAdding(d.user_id);
					}else{
							onRemoving(d.user_id);
						}
				});              
                    
	circle.filter(function(d){return window.label[d["user_id"]]=="unable"})
                    .append('circle')
					.attr("id","TLViewBlue")
                    .attr("cx", startX+70 )
                    .attr("cy", function (d) { return yScale(d["tweets"]); } )
                    .attr("r", 4)
                    .attr("transform", "translate(0,10)")
                    .attr('fill','blue')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["tweets"]+"</font></div>");
					})
					.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
					.on("mouseout", function(){
						d3.select(this).attr("stroke-width",0);
						return tooltip.style("visibility", "hidden");})
					.on("click",function(d){
					if(window.selectionOption == 0){
							onAdding(d.user_id);
					}else{
							onRemoving(d.user_id);
						}
				});
	clickFn();
	
	//try brushing
	/*
	svg
    .call( d3.brush()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,100], [90,graphHeight+20] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    );
	
	function updateChart() {
		extent = d3.event.selection;
		if(window.selectionOption == 0){
		d3.selectAll("#TLViewGreen").filter(function(d){
				return isBrushed(extent, 30, yScale(d.tweets) );}).attr('fill','red');
		d3.selectAll("#TLViewBlue").filter(function(d){
				return isBrushed(extent, 50, yScale(d.tweets) );}).attr('fill','red');
		d3.selectAll("#TLViewPurple").filter(function(d){
				return isBrushed(extent, 70, yScale(d.tweets) );}).attr('fill','red');
		}else{
			d3.selectAll("#TLViewGreen").filter(function(d){
				return isBrushed(extent, 30, yScale(d.tweets) );})
			.attr('fill','green');
		d3.selectAll("#TLViewPurple").filter(function(d){
				return isBrushed(extent, 50, yScale(d.tweets) );})
			.attr('fill','purple');
		d3.selectAll("#TLViewBlue").filter(function(d){
				return isBrushed(extent, 70, yScale(d.tweets) );})
			.attr('fill','blue');
		}
		
		//circle.filter(function(d){ return isBrushed(extent, 0, yScale(d.tweets) ) } ).attr('fill','red');
	}
	function isBrushed(brush_coords, cx, cy) {
       var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  }
  */
	
	
	//end brushing
	
	
	
    var xAxisLabel = svg.append("text").style("text-anchor", "middle").attr("x", "50%").attr("y", "99%")
        .style("font-size", "10px");
    var yAxisLabel = svg.append("text").style("text-anchor", "middle")
        //.attr("x", "30%")
        //.attr("y", "106%")
		.text("No. of Tweets")
        .attr("transform", "rotate(-90)")
        //.attr("transform-origin", "bottom left")
        .style("font-size", "10px");

    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
	
	svg.append("text")
		.attr("class","timeLineBoxheading")
		.attr("fill","black")
        .attr("x", startX+50)
		.attr("y",10)
        .attr("text-anchor", "middle")
		.attr("font-family","sans-serif")
        .style("font-size", "10px") 
        .style("font-weight", "Bold") 
		.style("text-decoration", "underline")
		.text(yearT);
		
	
	var reScale = function() {
        var box = svg.node().getBoundingClientRect();

        var graphWidth = box.width - margins.left - margins.right - margins.rightAdjust;
        var graphHeight = box.height - margins.top - margins.bottom;
		//xAxis.attr("transform", "translate(" + (startX+margins.right + margins.rightAdjust) + "," + (graphHeight + margins.top ) + ")")
          //          .call(d3.axisBottom(xScale));
		 //if(yAxis)
			/*yAxis.attr("transform", "translate(" + (startX+margins.right + margins.rightAdjust) + ", " + (10 - 2) + ")")
                    .call(d3.axisLeft(yScale).tickSize(0));*/
		

    };

    this.reScale = reScale;

    this.draw = function(data, x, y, xLabel, yLabel) {

        //xScale.domain([1,10]);
        yScale.domain([1,10]);

        xAxisLabel.text(xLabel);
        yAxisLabel.text(yLabel);

        reScale();

    };

    new ResizeObserver(this.reScale).observe(parentDivElement);
}
else if(type=="retweet"){
	var svg = d3.select(svgElement);

    var margins = {
        top: 15,
        bottom: 15,
        left: 15,
        right: 15,
        rightAdjust: 15
    };
	spamBox=[];
	genuineBox=[];
	unableBox=[];
	data1.forEach(function(d){
		if(window.label[d["user_id"]]=="spambot"){
			spamBox.push(parseInt(d.retweetCnt));
		}else if(window.label[d["user_id"]]=="genuine"){
				genuineBox.push(parseInt(d.retweetCnt));
		}else if(window.label[d["user_id"]]=="unable"){
				unableBox.push(parseInt(d.retweetCnt));
		}
	});
	this.svg = svg;
	var yearT = year;
    var xScale1 = d3.scaleLinear();
	var xScale = d3.scaleOrdinal().range([0,30,70,90]);
    var yScale = d3.scaleLinear();
    var xScale2 = d3.scaleLinear();
	var tempData = [["0001","Genuine","200"],["0002","Unlabeled","500"],["0003","Spam","600"],["0001","Genuine","700"]];
	
    var adjust = 10;
    //var xAxis = this.svg.append("g");
	if(year=="2007")
		var yAxis = this.svg.append("g");
	
        var box = svg.node().getBoundingClientRect();

        var graphWidth = box.width - margins.left - margins.right - margins.rightAdjust;
        var graphHeight = box.height - margins.top - margins.bottom;
	
	xScale1.range([90, 90])
                  .domain(d3.extent(tempData, function(d,i){ return 0;}));
    yScale.range([graphHeight+10, 0])
                    .domain([0, 22029218]);
	
	//boxPlot code
	spamBox=spamBox.sort(d3.ascending);
	genuineBox=genuineBox.sort(d3.ascending);
	unableBox=unableBox.sort(d3.ascending);
    
	var sq1 = d3.quantile(spamBox, .25);
	var smedian = d3.quantile(spamBox, .5);
	var sq3 = d3.quantile(spamBox, .75);
	var sinterQuantileRange = sq3 - sq1;
	
	var gq1 = d3.quantile(genuineBox, .25);
	var gmedian = d3.quantile(genuineBox, .5);
	var gq3 = d3.quantile(genuineBox, .75);
	var ginterQuantileRange = gq3 - gq1;
	
	var uq1 = d3.quantile(unableBox, .25);
	var umedian = d3.quantile(unableBox, .5);
	var uq3 = d3.quantile(unableBox, .75);
	var uinterQuantileRange = uq3 - uq1;
	
	
	//boxPlot Genuine
	svg.append("rect")
	  .attr("x", 20)
	  .attr("y", yScale(gq3) )
	  .attr("height", (yScale(gq1)-yScale(gq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "green")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([gmedian])
	.enter()
	.append("line")
	.attr("x1", 20)
	.attr("x2", 40)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	
	//boxPlot Spam
	svg.append("rect")
	  .attr("x", 40)
	  .attr("y", yScale(sq3) )
	  .attr("height", (yScale(sq1)-yScale(sq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "Purple")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([smedian])
	.enter()
	.append("line")
	.attr("x1", 40)
	.attr("x2", 60)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	//boxPlot Unable
	svg.append("rect")
	  .attr("x", 60)
	  .attr("y", yScale(uq3) )
	  .attr("height", (yScale(uq1)-yScale(uq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "Blue")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([umedian])
	.enter()
	.append("line")
	.attr("x1", 60)
	.attr("x2", 80)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	//boxPlot end
	
	var tooltip = d3.select("#tLV-boxPlotContainer")
		.append("div")
		.style("background-color", "white")
		.style("color","black")
		.style("opacity",0.8)
		.style("position", "absolute")
		.style("z-index", "1")
		.style("visibility", "hidden");
		
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20)
		.attr("x2", 100)
		.attr("y2", graphHeight+20)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
	
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
		
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-2*graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-2*graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
	
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-3*graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-3*graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
	var circle = svg.selectAll("circle").data(data1).enter();
	circle.filter(function(d){return window.label[d["user_id"]] == "genuine"})
                    .append('circle')
					.attr("id","TLViewGreen")
                    .attr("cx", startX+30 )
                    .attr("cy", function (d) { return yScale(d["retweetCnt"]); } )
                    .attr("r", 4)
                    .attr("transform", "translate(0,10)")
                    .attr('fill','green')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["retweetCnt"]+"</font></div>");
					})
	.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	.on("mouseout", function(){
		d3.select(this).attr("stroke-width",0);
		return tooltip.style("visibility", "hidden");})
	.on("click",function(d){
			if(window.selectionOption == 0){
				onAdding(d.user_id);
			}else{
				onRemoving(d.user_id);
						}
	});
	
	
	circle.filter(function(d){return window.label[d["user_id"]]=="spambot"}).append('circle')
					.attr("id","TLViewPurple")
					.attr("cx", startX+50 )
                    .attr("cy", function (d) { return yScale(d["retweetCnt"]); } )
                    .attr("r", 4)
					.attr("transform", "translate(0,10)")
                    .attr('fill','Purple')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["retweetCnt"]+"</font></div>");
					})
					.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
					.on("mouseout", function(){
						d3.select(this).attr("stroke-width",0);
						return tooltip.style("visibility", "hidden");})
					.on("click",function(d){
					if(window.selectionOption == 0){
							onAdding(d.user_id);
					}else{
							onRemoving(d.user_id);
						}
				});              
                    
	circle.filter(function(d){return window.label[d["user_id"]]=="unable"})
                    .append('circle')
					.attr("id","TLViewBlue")
                    .attr("cx", startX+70 )
                    .attr("cy", function (d) { return yScale(d["retweetCnt"]); } )
                    .attr("r", 4)
                    .attr("transform", "translate(0,10)")
                    .attr('fill','blue')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["retweetCnt"]+"</font></div>");
					})
					.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
					.on("mouseout", function(){
						d3.select(this).attr("stroke-width",0);
						return tooltip.style("visibility", "hidden");})
					.on("click",function(d){
					if(window.selectionOption == 0){
							onAdding(d.user_id);
					}else{
							onRemoving(d.user_id);
						}
				});
	clickFn();
	
    var xAxisLabel = svg.append("text").style("text-anchor", "middle").attr("x", "50%").attr("y", "99%")
        .style("font-size", "10px");
    var yAxisLabel = svg.append("text").style("text-anchor", "middle")
        //.attr("x", "30%")
        //.attr("y", "106%")
		.text("No. of Tweets")
        .attr("transform", "rotate(-90)")
        //.attr("transform-origin", "bottom left")
        .style("font-size", "10px");

    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
	
	svg.append("text")
		.attr("class","timeLineBoxheading")
		.attr("fill","black")
        .attr("x", startX+50)
		.attr("y",10)
        .attr("text-anchor", "middle")
		.attr("font-family","sans-serif")
        .style("font-size", "10px") 
        .style("font-weight", "Bold") 
		.style("text-decoration", "underline")
		.text(yearT);
		
	
	var reScale = function() {
        var box = svg.node().getBoundingClientRect();

        var graphWidth = box.width - margins.left - margins.right - margins.rightAdjust;
        var graphHeight = box.height - margins.top - margins.bottom;
		//xAxis.attr("transform", "translate(" + (startX+margins.right + margins.rightAdjust) + "," + (graphHeight + margins.top ) + ")")
          //          .call(d3.axisBottom(xScale));
		 //if(yAxis)
			/*yAxis.attr("transform", "translate(" + (startX+margins.right + margins.rightAdjust) + ", " + (10 - 2) + ")")
                    .call(d3.axisLeft(yScale).tickSize(0));*/
		

    };

    this.reScale = reScale;

    this.draw = function(data, x, y, xLabel, yLabel) {

        //xScale.domain([1,10]);
        yScale.domain([1,10]);

        xAxisLabel.text(xLabel);
        yAxisLabel.text(yLabel);

        reScale();

    };

    new ResizeObserver(this.reScale).observe(parentDivElement);
	
}
else if(type=="hashtag"){
	var svg = d3.select(svgElement);

    var margins = {
        top: 15,
        bottom: 15,
        left: 15,
        right: 15,
        rightAdjust: 15
    };
	spamBox=[];
	genuineBox=[];
	unableBox=[];
	data1.forEach(function(d){
		if(window.label[d["user_id"]]=="spambot"){
			spamBox.push(parseInt(d.hashtagCnt));
		}else if(window.label[d["user_id"]]=="genuine"){
				genuineBox.push(parseInt(d.hashtagCnt));
		}else if(window.label[d["user_id"]]=="unable"){
				unableBox.push(parseInt(d.hashtagCnt));
		}
	});
	this.svg = svg;
	var yearT = year;
    var xScale1 = d3.scaleLinear();
	var xScale = d3.scaleOrdinal().range([0,30,70,90]);
    var yScale = d3.scaleLinear();
    var xScale2 = d3.scaleLinear();
	var tempData = [["0001","Genuine","200"],["0002","Unlabeled","500"],["0003","Spam","600"],["0001","Genuine","700"]];
	
    var adjust = 10;
    //var xAxis = this.svg.append("g");
	if(year=="2007")
		var yAxis = this.svg.append("g");
	
        var box = svg.node().getBoundingClientRect();

        var graphWidth = box.width - margins.left - margins.right - margins.rightAdjust;
        var graphHeight = box.height - margins.top - margins.bottom;
	
	xScale1.range([90, 90])
                  .domain(d3.extent(tempData, function(d,i){ return 0;}));
    yScale.range([graphHeight+10, 0])
                    .domain([0, 4672]);
	
	//boxPlot code
	spamBox=spamBox.sort(d3.ascending);
	genuineBox=genuineBox.sort(d3.ascending);
	unableBox=unableBox.sort(d3.ascending);
    
	var sq1 = d3.quantile(spamBox, .25);
	var smedian = d3.quantile(spamBox, .5);
	var sq3 = d3.quantile(spamBox, .75);
	var sinterQuantileRange = sq3 - sq1;
	
	var gq1 = d3.quantile(genuineBox, .25);
	var gmedian = d3.quantile(genuineBox, .5);
	var gq3 = d3.quantile(genuineBox, .75);
	var ginterQuantileRange = gq3 - gq1;
	
	var uq1 = d3.quantile(unableBox, .25);
	var umedian = d3.quantile(unableBox, .5);
	var uq3 = d3.quantile(unableBox, .75);
	var uinterQuantileRange = uq3 - uq1;
	
	
	//boxPlot Genuine
	svg.append("rect")
	  .attr("x", 20)
	  .attr("y", yScale(gq3) )
	  .attr("height", (yScale(gq1)-yScale(gq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "green")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([gmedian])
	.enter()
	.append("line")
	.attr("x1", 20)
	.attr("x2", 40)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	
	//boxPlot Spam
	svg.append("rect")
	  .attr("x", 40)
	  .attr("y", yScale(sq3) )
	  .attr("height", (yScale(sq1)-yScale(sq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "Purple")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([smedian])
	.enter()
	.append("line")
	.attr("x1", 40)
	.attr("x2", 60)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	//boxPlot Unable
	svg.append("rect")
	  .attr("x", 60)
	  .attr("y", yScale(uq3) )
	  .attr("height", (yScale(uq1)-yScale(uq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "Blue")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([umedian])
	.enter()
	.append("line")
	.attr("x1", 60)
	.attr("x2", 80)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	//boxPlot end
	
	var tooltip = d3.select("#tLV-boxPlotContainer")
		.append("div")
		.style("background-color", "white")
		.style("color","black")
		.style("opacity",0.8)
		.style("position", "absolute")
		.style("z-index", "1")
		.style("visibility", "hidden");
		
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20)
		.attr("x2", 100)
		.attr("y2", graphHeight+20)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
	
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
		
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-2*graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-2*graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
	
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-3*graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-3*graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
	var circle = svg.selectAll("circle").data(data1).enter();
	circle.filter(function(d){return window.label[d["user_id"]] == "genuine"})
                    .append('circle')
					.attr("id","TLViewGreen")
                    .attr("cx", startX+30 )
                    .attr("cy", function (d) { return yScale(d["hashtagCnt"]); } )
                    .attr("r", 4)
                    .attr("transform", "translate(0,10)")
                    .attr('fill','green')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["hashtagCnt"]+"</font></div>");
					})
	.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	.on("mouseout", function(){
		d3.select(this).attr("stroke-width",0);
		return tooltip.style("visibility", "hidden");})
	.on("click",function(d){
		if(window.selectionOption == 0){
							onAdding(d.user_id);
					}else{
							onRemoving(d.user_id);
						}
	});
	
	
	circle.filter(function(d){return window.label[d["user_id"]]=="spambot"}).append('circle')
					.attr("id","TLViewPurple")
					.attr("cx", startX+50 )
                    .attr("cy", function (d) { return yScale(d["hashtagCnt"]); } )
                    .attr("r", 4)
					.attr("transform", "translate(0,10)")
                    .attr('fill','Purple')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["hashtagCnt"]+"</font></div>");
					})
					.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
					.on("mouseout", function(){
						d3.select(this).attr("stroke-width",0);
						return tooltip.style("visibility", "hidden");})
					.on("click",function(d){
					if(window.selectionOption == 0){
							onAdding(d.user_id);
					}else{
							onRemoving(d.user_id);
						}
				});              
                    
	circle.filter(function(d){return window.label[d["user_id"]]=="unable"})
                    .append('circle')
					.attr("id","TLViewBlue")
                    .attr("cx", startX+70 )
                    .attr("cy", function (d) { return yScale(d["hashtagCnt"]); } )
                    .attr("r", 4)
                    .attr("transform", "translate(0,10)")
                    .attr('fill','blue')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["hashtagCnt"]+"</font></div>");
					})
					.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
					.on("mouseout", function(){
						d3.select(this).attr("stroke-width",0);
						return tooltip.style("visibility", "hidden");})
					.on("click",function(d){
					if(window.selectionOption == 0){
							onAdding(d.user_id);
					}else{
							onRemoving(d.user_id);
						}
				});
	
	clickFn();

    var xAxisLabel = svg.append("text").style("text-anchor", "middle").attr("x", "50%").attr("y", "99%")
        .style("font-size", "10px");
    var yAxisLabel = svg.append("text").style("text-anchor", "middle")
        //.attr("x", "30%")
        //.attr("y", "106%")
		.text("No. of Tweets")
        .attr("transform", "rotate(-90)")
        //.attr("transform-origin", "bottom left")
        .style("font-size", "10px");

    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
	
	svg.append("text")
		.attr("class","timeLineBoxheading")
		.attr("fill","black")
        .attr("x", startX+50)
		.attr("y",10)
        .attr("text-anchor", "middle")
		.attr("font-family","sans-serif")
        .style("font-size", "10px") 
        .style("font-weight", "Bold") 
		.style("text-decoration", "underline")
		.text(yearT);
		
	
	var reScale = function() {
        var box = svg.node().getBoundingClientRect();

        var graphWidth = box.width - margins.left - margins.right - margins.rightAdjust;
        var graphHeight = box.height - margins.top - margins.bottom;
		//xAxis.attr("transform", "translate(" + (startX+margins.right + margins.rightAdjust) + "," + (graphHeight + margins.top ) + ")")
          //          .call(d3.axisBottom(xScale));
		 //if(yAxis)
			/*yAxis.attr("transform", "translate(" + (startX+margins.right + margins.rightAdjust) + ", " + (10 - 2) + ")")
                    .call(d3.axisLeft(yScale).tickSize(0));*/
		

    };

    this.reScale = reScale;

    this.draw = function(data, x, y, xLabel, yLabel) {

        //xScale.domain([1,10]);
        yScale.domain([1,10]);

        xAxisLabel.text(xLabel);
        yAxisLabel.text(yLabel);

        reScale();

    };

    new ResizeObserver(this.reScale).observe(parentDivElement);
}
else if(type=="favorite"){
	var svg = d3.select(svgElement);

    var margins = {
        top: 15,
        bottom: 15,
        left: 15,
        right: 15,
        rightAdjust: 15
    };
	spamBox=[];
	genuineBox=[];
	unableBox=[];
	data1.forEach(function(d){
		if(window.label[d["user_id"]]=="spambot"){
			spamBox.push(parseInt(d.favoriteCnt));
		}else if(window.label[d["user_id"]]=="genuine"){
				genuineBox.push(parseInt(d.favoriteCnt));
		}else if(window.label[d["user_id"]]=="unable"){
				unableBox.push(parseInt(d.favoriteCnt));
		}
	});
	this.svg = svg;
	var yearT = year;
    var xScale1 = d3.scaleLinear();
	var xScale = d3.scaleOrdinal().range([0,30,70,90]);
    var yScale = d3.scaleLinear();
    var xScale2 = d3.scaleLinear();
	var tempData = [["0001","Genuine","200"],["0002","Unlabeled","500"],["0003","Spam","600"],["0001","Genuine","700"]];
	
    var adjust = 10;
    //var xAxis = this.svg.append("g");
	if(year=="2007")
		var yAxis = this.svg.append("g");
	
        var box = svg.node().getBoundingClientRect();

        var graphWidth = box.width - margins.left - margins.right - margins.rightAdjust;
        var graphHeight = box.height - margins.top - margins.bottom;
	
	xScale1.range([90, 90])
                  .domain(d3.extent(tempData, function(d,i){ return 0;}));
    yScale.range([graphHeight+10, 0])
                    .domain([0, 14726]);
	
	//boxPlot code
	spamBox=spamBox.sort(d3.ascending);
	genuineBox=genuineBox.sort(d3.ascending);
	unableBox=unableBox.sort(d3.ascending);
    
	var sq1 = d3.quantile(spamBox, .25);
	var smedian = d3.quantile(spamBox, .5);
	var sq3 = d3.quantile(spamBox, .75);
	var sinterQuantileRange = sq3 - sq1;
	
	var gq1 = d3.quantile(genuineBox, .25);
	var gmedian = d3.quantile(genuineBox, .5);
	var gq3 = d3.quantile(genuineBox, .75);
	var ginterQuantileRange = gq3 - gq1;
	
	var uq1 = d3.quantile(unableBox, .25);
	var umedian = d3.quantile(unableBox, .5);
	var uq3 = d3.quantile(unableBox, .75);
	var uinterQuantileRange = uq3 - uq1;
	
	
	//boxPlot Genuine
	svg.append("rect")
	  .attr("x", 20)
	  .attr("y", yScale(gq3) )
	  .attr("height", (yScale(gq1)-yScale(gq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "green")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([gmedian])
	.enter()
	.append("line")
	.attr("x1", 20)
	.attr("x2", 40)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	
	//boxPlot Spam
	svg.append("rect")
	  .attr("x", 40)
	  .attr("y", yScale(sq3) )
	  .attr("height", (yScale(sq1)-yScale(sq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "Purple")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([smedian])
	.enter()
	.append("line")
	.attr("x1", 40)
	.attr("x2", 60)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	//boxPlot Unable
	svg.append("rect")
	  .attr("x", 60)
	  .attr("y", yScale(uq3) )
	  .attr("height", (yScale(uq1)-yScale(uq3)) )
	  .attr("width", 20 )
	  .attr("stroke", "black")
	  .style("fill", "Blue")
	  .attr("opacity",0.4);
	
	svg.selectAll("toto")
	.data([umedian])
	.enter()
	.append("line")
	.attr("x1", 60)
	.attr("x2", 80)
	.attr("y1", function(d){ return(yScale(d))} )
	.attr("y2", function(d){ return(yScale(d))} )
	.attr("stroke", "lightgray");
	
	//boxPlot end
	
	 var tooltip = d3.select("#tLV-boxPlotContainer")
		.append("div")
		.style("background-color", "white")
		.style("color","black")
		.style("opacity",0.8)
		.style("position", "absolute")
		.style("z-index", "1")
		.style("visibility", "hidden");
	
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20)
		.attr("x2", 100)
		.attr("y2", graphHeight+20)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
	
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
		
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-2*graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-2*graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
	
	svg.append("svg:line")
		.attr("x1", 0)
		.attr("y1", graphHeight+20-3*graphHeight/3)
		.attr("x2", 100)
		.attr("y2", graphHeight+20-3*graphHeight/3)
		.style("stroke", "black")
		.attr("opacity",0.1);
	
		
	
	var circle = svg.selectAll("circle").data(data1).enter();
	circle.filter(function(d){return window.label[d["user_id"]] == "genuine"})
                    .append('circle')
					.attr("id","TLViewGreen")
                    .attr("cx", startX+30 )
                    .attr("cy", function (d) { return yScale(d["favoriteCnt"]); } )
                    .attr("r", 4)
                    .attr("transform", "translate(0,10)")
                    .attr('fill','green')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["hashtagCnt"]+"</font></div>");
					})
	.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	.on("mouseout", function(){
		d3.select(this).attr("stroke-width",0);
		return tooltip.style("visibility", "hidden");})
	.on("click",function(d){
		if(window.selectionOption == 0){
							onAdding(d.user_id);
					}else{
							onRemoving(d.user_id);
						}
	});
	
	
	circle.filter(function(d){return window.label[d["user_id"]]=="spambot"}).append('circle')
					.attr("id","TLViewPurple")
					.attr("cx", startX+50 )
                    .attr("cy", function (d) { return yScale(d["favoriteCnt"]); } )
                    .attr("r", 4)
					.attr("transform", "translate(0,10)")
                    .attr('fill','Purple')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["hashtagCnt"]+"</font></div>");
					})
					.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
					.on("mouseout", function(){
						d3.select(this).attr("stroke-width",0);
						return tooltip.style("visibility", "hidden");})
					.on("click",function(d){
					if(window.selectionOption == 0){
							onAdding(d.user_id);
					}else{
							onRemoving(d.user_id);
						}
				});              
                    
	circle.filter(function(d){return window.label[d["user_id"]]=="unable"})
                    .append('circle')
					.attr("id","TLViewBlue")
                    .attr("cx", startX+70 )
                    .attr("cy", function (d) { return yScale(d["favoriteCnt"]); } )
                    .attr("r", 4)
                    .attr("transform", "translate(0,10)")
                    .attr('fill','blue')
					.attr("opacity",0.6)
					.on("mouseover", function(d){
						d3.select(this).attr("stroke","orange");
						d3.select(this).attr("stroke-width",2);
						return tooltip.style("visibility", "visible")
						.html("<div style=&quot;background-color:lightgray&quot;><font size='2px'>"+"Screen name:"+d["twitter_screen_name"]+"<br>Value:"+d["hashtagCnt"]+"</font></div>");
					})
					.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
					.on("mouseout", function(){
						d3.select(this).attr("stroke-width",0);
						return tooltip.style("visibility", "hidden");})
					.on("click",function(d){
					if(window.selectionOption == 0){
							onAdding(d.user_id);
					}else{
							onRemoving(d.user_id);
						}
				});
	
	clickFn();

    var xAxisLabel = svg.append("text").style("text-anchor", "middle").attr("x", "50%").attr("y", "99%")
        .style("font-size", "10px");
    var yAxisLabel = svg.append("text").style("text-anchor", "middle")
        //.attr("x", "30%")
        //.attr("y", "106%")
		.text("No. of Tweets")
        .attr("transform", "rotate(-90)")
        //.attr("transform-origin", "bottom left")
        .style("font-size", "10px");

    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
	
	svg.append("text")
		.attr("class","timeLineBoxheading")
		.attr("fill","black")
        .attr("x", startX+50)
		.attr("y",10)
        .attr("text-anchor", "middle")
		.attr("font-family","sans-serif")
        .style("font-size", "10px") 
        .style("font-weight", "Bold") 
		.style("text-decoration", "underline")
		.text(yearT);
		
	
	var reScale = function() {
        var box = svg.node().getBoundingClientRect();

        var graphWidth = box.width - margins.left - margins.right - margins.rightAdjust;
        var graphHeight = box.height - margins.top - margins.bottom;
		//xAxis.attr("transform", "translate(" + (startX+margins.right + margins.rightAdjust) + "," + (graphHeight + margins.top ) + ")")
          //          .call(d3.axisBottom(xScale));
		 //if(yAxis)
			/*yAxis.attr("transform", "translate(" + (startX+margins.right + margins.rightAdjust) + ", " + (10 - 2) + ")")
                    .call(d3.axisLeft(yScale).tickSize(0));*/		

    };

    this.reScale = reScale;

    this.draw = function(data, x, y, xLabel, yLabel) {

        //xScale.domain([1,10]);
        yScale.domain([1,10]);

        xAxisLabel.text(xLabel);
        yAxisLabel.text(yLabel);

        reScale();

    };

    new ResizeObserver(this.reScale).observe(parentDivElement);
}

}
