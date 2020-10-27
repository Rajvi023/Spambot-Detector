function wordCloud(selector) {

    var fill = d3.scaleOrdinal(d3.schemeCategory20);
	var cwords = undefined;
	var wordList = undefined;
    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
		.attr("id", "tcv-wc-svg")
        .append("g")
        .attr("transform", "translate(110,50)");


    //Draw the word cloud
    function draw(words) {
		i = 0;
		sum = d3.max(words, function(d) { return d.count;});
        var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', function(d) { return d.size + "px"; })
			.attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            //.transition()
            //    .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            //.transition()
            //    .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }
	
	var updateWC = function(words) {
		wordList = words;
		sum = d3.max(words, function(d) { return d.count;});
			words = words.map(function(d) {
                return {text: d.word, size: (tcvwcControl.minSize + (d.count*tcvwcControl.maxSize / sum)), r: ~~(Math.random() * 2) * 90};
            })			
			
			cwords = words;
			reScale();
	}
	
	var updatesize = function() {
		sum = d3.max(wordList, function(d) { return d.count;});
			words = wordList.map(function(d) {
                return {text: d.word, size: (tcvwcControl.minSize + (d.count*tcvwcControl.maxSize / sum)), r: ~~(Math.random() * 2) * 90};
            });
			cwords = words;
			reScale();
	}
	
	var reScale = function() {
		var box = d3.select('#tcv-wc-svg').node().getBoundingClientRect();
		
		var graphWidth = box.width;
		var graphHeight = box.height;
		svg.attr("transform", "translate(" + (graphWidth/2) + "," + (graphHeight/2) + ")");
        d3.layout.cloud().size([graphWidth, graphHeight])
                .words(cwords)
                .padding(1)
                .rotate(function(d) { return d.r; })
                .font("Impact")
                .fontSize(function(d) {return d.size; })
                .on("end", draw)
                .start();
	}

	//new ResizeObserver(reScale).observe(document.getElementById('tcv-wc-svg'));


    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: updateWC,
		updateSize: updatesize
    }

}