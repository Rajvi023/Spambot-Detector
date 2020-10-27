// this is where your implementation for your scatter plot should go 
function ClusterView(svgElement, parentDivElement) {
    var svg = d3.select(svgElement);
    
    var xKey = undefined;
    var yKey = undefined;
    var rKey = undefined;
    var dataKey = undefined;
    
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
    
    this.draw = function(data, key, x, y, xLabel, yLabel) {
        
        xKey = x;
        yKey = y;
        dataKey = key;
        
        xScale.domain(d3.extent(data, function(d) { return +d[x]; }));
        yScale.domain(d3.extent(data, function(d) { return +d[y]; }));
        rScale.range([2,10]).domain(d3.extent(data, function(d) { return +d['tweet_count']; }));

        xAxisLabel.text(xLabel);
        yAxisLabel.text(yLabel);

        svg.selectAll('.dots').remove();
            
        this.dots = svg.selectAll('.dots')
                .data(data)
                .enter().append("circle")
                .attr('class', 'dots')
                .attr('r', function(d){
                    return rScale(+d['tweet_count'])
                })
                .attr('id',function(d){
                    return "clusterView_"+d[key]
                })
                .attr("opacity", 0.5)
                .attr("transform", "translate(" + (margins.right + margins.rightAdjust) + ", " + (10 - 2) + ")")
                .attr("cx", function(d) { return xScale(d[x]); })
                .attr("cy", function(d) { return yScale(d[y]); })
                .on("click", function(d) {
                    if(selectionOption == 0) {
                        onAdding(d[key]);
                    } 
                    else if (selectionOption == 1) {
                        onRemoving(d[key]);
                    }
                });
        
        changeClusterViewColor(key);    
        reScale();
        
        return this.dots;
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


    new ResizeObserver(this.reScale).observe(parentDivElement);
    
}

function changeClusterViewHoverColor(userId) {
    d3.select("#dRViewScatterPlot").selectAll("#clusterView_"+userId).style("fill", "orange");
};

function changeClusterViewSelectColor(userId) {
    d3.select("#dRViewScatterPlot").selectAll("#clusterView_"+userId).style("fill", "red");
};

function changeClusterViewUnSelectColor(userId) {
	var label = window.label[userId];

    d3.select("#dRViewScatterPlot").selectAll("#clusterView_"+userId).style("fill", function(userId){
        switch(label) {
            case "genuine":
                return "#4DAF4A";
                break;
            case "spambot":
                return "#984EA3";
                break;
            case "unable":
                return "#377EB8";
                break;
        }
    });
};

function changeClusterViewColor(key){
    drs = d3.select("#dRViewScatterPlot").selectAll(".dots");
    drs.style("fill", function(d) {
		if(d[key] in selectedUsers){
			return "red";
		}	
		else{
			switch(window.label[d[key]]) {
				case "genuine":
					return "#4DAF4A";
					break;
				case "spambot":
					return "#984EA3";
					break;
				case "unable":
					return "#377EB8";
					break;
			}
		}
    });
};