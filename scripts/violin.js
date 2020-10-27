window.features = ["Count(tweets)", "Sum(retweet_count)", "Sum(favorite_count)"];

var margin = {top: 15, right: 25, bottom: 30, left: 60},
    width = document.getElementById("violin-plot-1").offsetWidth - margin.left - margin.right,
    height = document.getElementById("violin-plot-1").offsetHeight - margin.top - margin.bottom;

var svg1 = d3.select("#violin-plot-1")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + (margin.left) + "," + margin.top + ")");
var svg2 = d3.select("#violin-plot-2")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + (margin.left) + "," + margin.top + ")");
var svg3 = d3.select("#violin-plot-3")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + (margin.left) + "," + margin.top + ")");
var svg_arr = [svg1, svg2, svg3]

function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

function make_violin(index = 0, data, feature = "Count(tweets)", violin_color = "green", right = -1, y){

  svg = svg_arr[index];
  
  data.forEach(function(d) {
    d[feature] = +d[feature];
  });
  feature_min = d3.min(data, function(d) { return d[feature]; });
  feature_max = d3.max(data, function(d) { return d[feature]; });

  var xname = "xaxis" + index.toString();
  d3.select("#" + xname).remove();
  var x = d3.scaleBand().range([ 0, width ]).domain(["a", feature, "b"]).padding(0);
  svg.append("g").attr("transform", "translate(0," + height + ")").attr("id", xname)
    .call(d3.axisBottom(x).tickValues([]));
  //svg.axis().tickValues([]).remove();

  var kde = kernelDensityEstimator(kernelEpanechnikov(feature_max/40), y.ticks(50));
  
  //console.log(y)
  
  var sumstat_sl = d3.nest()
    .key(function(d) { return d;})
    .rollup(function(d) {
      input = d.map(function(g) { return parseFloat(g[feature]);})
      density = kde(input)
      return(density)
    })
    .entries(data);

  var maxNum = 0;
  for ( i in sumstat_sl ){
    allBins = sumstat_sl[i].value
    kdeValues = allBins.map(function(a){return a[1];})
    biggest = d3.max(kdeValues)
    if (biggest > maxNum) { maxNum = biggest }
  };

  var xNum = d3.scaleLinear()
    .range([0, width/3])
    .domain([-maxNum,maxNum]);

  violinplotid = "violinplot" + index.toString();
  svg
    .selectAll("myViolin")
    .data(sumstat_sl)
    .enter()
    .append("g")
      .attr("transform", function(d){ return("translate(" + width/3 +" ,0)") } )
      .attr("id", violinplotid)
      .append("path")
        .datum(function(d){ return(d.value)})
        .style("stroke", violin_color)
        .style("fill","none")
        .style("opacity", 0.4)
        .style("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d){ return(xNum(right * d[1])) } )
            .y(function(d){ return(y(d[0])) } )
            .curve(d3.curveCatmullRom)
        );

  /*
  d3.select("#" + violinplotid + "-point").remove();
  svg
    .append("g")
    .attr("id", violinplotid + "-point")
      .selectAll("circle")
      .data(sumstat_sl)
      .enter()
      .datum(function(d){ return(d.value)})
      .append("circle")
        .attr('cx', xNum(0))
        .attr('cy', function(d){ return(y(d[0])) })
        .attr("r", 5)
        .style("fill", "black");
  */

  violinname = "violintag" + index.toString();
  d3.select("#" + violinname).remove();
  svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + (height + margin.top + 5) + ")")
    .attr("id", violinname)
    .style("text-anchor", "middle")
    .text(feature);
}

function transform(data, sel_features){
  var radios = document.getElementsByClassName("fe_radio");
    for(i=0;i < radios.length; i++) {
        if (radios[i].checked) {
            if(radios[i].value==="normalized"){
              for(j=0;j < sel_features.length; j++){
                data.forEach(function(d) {
                  d[sel_features[j]] = +d[sel_features[j]];
                });
                min_feature_val = d3.min(data, function(d) { return d[sel_features[j]]; });
                max_feature_val = d3.max(data, function(d) { return d[sel_features[j]]; });
                data.forEach(function(d) {
                  d[sel_features[j]] = (d[sel_features[j]] - min_feature_val)/(max_feature_val - min_feature_val);
                });
              }
            }
            break
        }
    }
  return data
}

function create_y_axis(index, data, feature){
  svg = svg_arr[index];

  feature_max = d3.max(data, function(d) { return d[feature]; });

  var yname = "yaxis" + index.toString();
  d3.select("#" + yname).remove();
  var y = d3.scaleLinear().domain([0, feature_max*1.25]).range([height, 0]);
  svg.append("g").attr("id", yname).call( d3.axisLeft(y) );

  return y
}

function violins(selected_features = window.features){

  if (selected_features.length < 1) {selected_features = ["Count(tweets)"]}

  var feature_dict = {violin_1: ["0", selected_features[0]],
    violin_2: ["1", selected_features[1]],
    violin_3: ["2", selected_features[2]]}

  //window.label[user_id]
  path = "../data/genuine_accounts_sample.csv/user_tweet_features.csv"
  d3.csv(path, function(data) {
    data = transform(data, selected_features);
    gen_data = []
    un_data = []
    spam_data = []
    sel_data = []
    sel_keys = Object.keys(selectedUsers)
    for( var i = 0; i < data.length; i++){ 
      class_label = window.label[data[i]["user_id"]]
      if (sel_keys.includes(data[i]["user_id"])) {sel_data.push(data[i])}
      if (class_label !== "genuine") {gen_data.push(data[i])}
      if (class_label === "spambot") {spam_data.push(data[i])}
      else if (class_label === "unable") {un_data.push(data[i])}
    };

    for (var i=0; i<3; i++){
      var violinplotid = "#violinplot" + i.toString();
      d3.selectAll(violinplotid).remove();
    }
    
    for (var key in feature_dict){
      var yax = create_y_axis(feature_dict[key][0], data, feature_dict[key][1]);
      make_violin(feature_dict[key][0], gen_data, feature_dict[key][1], "green", right = -1, yax);
      make_violin(feature_dict[key][0], un_data, feature_dict[key][1], "blue", right = 1, yax);
      make_violin(feature_dict[key][0], spam_data, feature_dict[key][1], "purple", right = -1, yax);
      if(sel_data.length > 0){
        make_violin(feature_dict[key][0], sel_data, feature_dict[key][1], "red", right = 1, yax);
      }
    };
  })
}
