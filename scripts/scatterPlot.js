// this is where your implementation for your scatter plot should go 
function ScatterPlot(svgElement, parentDivElement) {
	var svg = d3.select(svgElement);
	
	var xKey = undefined;
	var yKey = undefined;
	var rKey = undefined;
	var dataKey = undefined;
	var tooltip = undefined;
	
    var margins = {
        top: 15,
        bottom: 15,
        left: 15,
        right: 15,
		rightAdjust: 30
    };

    this.svg = svg;
	var dots = undefined;
	this.dots = dots;
	
	var xScale = d3.scaleLinear();
	var yScale = d3.scaleLinear();
	var rScale = d3.scaleLinear();
	
    // this is where your code should go to generate the flow diagram from the random data
	var adjust = 10;
	var xAxis = this.svg.append("g");					
	var yAxis = this.svg.append("g");
	
	var xAxisLabel = svg.append("text").style("text-anchor", "middle").attr("x", "50%").attr("y", "99%")
						.style("font-size", "10px");
	var yAxisLabel = svg.append("text").style("text-anchor", "middle")
						//.attr("x", "30%")
						//.attr("y", "106%")
						.attr("transform", "rotate(-90)")
						//.attr("transform-origin", "bottom left")
						.style("font-size", "10px");
						
	this.xAxisLabel = xAxisLabel;
	this.yAxisLabel = yAxisLabel;
	
	var reScale = function() {
		var box = svg.node().getBoundingClientRect();
		
		var graphWidth = box.width - margins.left - margins.right - margins.rightAdjust;
		var graphHeight = box.height - margins.top - margins.bottom;

		xScale.range([0, graphWidth]);
		yScale.range([graphHeight, 0]);

		xAxis.attr("transform", "translate(" + (margins.right + margins.rightAdjust) + "," + (graphHeight + margins.top - 5 - 2) + ")")
			 .call(d3.axisBottom(xScale).tickSize(-graphHeight));
		yAxis.attr("transform", "translate(" + (margins.right + margins.rightAdjust) + ", " + (10 - 2) + ")")
			 .call(d3.axisLeft(yScale).tickSize(-graphWidth));
			 
		//xAxisLabel.attr("transform", "translate(" + (graphWidth / 2.5 + margins.right) + " ," + (graphHeight + margins.top) + ")");
		yAxisLabel
			.attr("transform", "translate(" + (15) + "," + (graphHeight*0.55) + ") rotate(-90)");

			
		if(dots !== undefined) {
			dots.attr("cx", function(d) { return xScale(d[xKey]); })
				.attr("cy", function(d) { return yScale(d[yKey]); });
		}


	};
	
	this.reScale = reScale;
	
	this.draw = function(data, key, x, y, xLabel, yLabel, r) {
		
		console.log('Drawing dots');
		
		xKey = x;
		yKey = y;
		rKey = r;
		dataKey = key;
		
		xScale.domain(d3.extent(data, function(d) { return +d[x]; }));
		yScale.domain(d3.extent(data, function(d) { return +d[y]; }));
		
		xAxisLabel.text(xLabel);
		yAxisLabel.text(yLabel);

		svg.selectAll('.dots').remove();

		dots = svg.selectAll('.dots')
				.data(data)
				.enter().append("circle")
				.attr('class', 'dots')
				//.style('fill', function(d) { return colors(d.year);})
				.attr("r", function(d) { return 5;})
				.attr("opacity", 0.5)
				.attr("transform", "translate(" + (margins.right + margins.rightAdjust) + ", " + (10 - 2) + ")")
				.attr("cx", function(d) { return xScale(d[x]); })
				.attr("cy", function(d) { return yScale(d[y]); });
		
		if (r!=null){			
			rScale.range([2,10]).domain(d3.extent(data, function(d) { return +d[r]; }));
			dots.attr('r', function(d){
				return rScale(+d[r])
			});
		}
		reScale();
		
		return dots;
	};
	
	this.changeScale = function(scale, domain) {
		if(scale == 'x') {
			xScale.domain(domain);
		}
		else if(scale == 'y'){
			yScale.domain(domain);
		}
		else {
			xScale.domain(domain);
			yScale.domain(domain);
		}
		reScale();
	};
	
	this.createTooltip = function(tooltip_id) {
		var newtooltip = d3.select("body")
						.append("div")
						.attr("id", tooltip_id)
						.style("position", "absolute")
						.style("z-index", "10")
						.style("visibility", "hidden")		
						.style("text-align", "justify")
						.style("padding", "5px")
						.style("font-size", "small")
						.style("white-space", "pre-line");
		return newtooltip;		
	}


	
	new ResizeObserver(this.reScale).observe(parentDivElement);
    
}
