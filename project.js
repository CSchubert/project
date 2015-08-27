var margin = {top: 20, right: 20, bottom: 30, left: 50},
width = window.innerWidth - margin.left - margin.right,
height = (window.innerHeight - margin.top - margin.bottom) / 2.0;

var parseDate = d3.time.format("%d-%b-%Y").parse;

var x = d3.time.scale()
.range([0, width]);

var y = d3.scale.linear()
.range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

var line = d3.svg.line()
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.rate); });

var svg = d3.select("#trend").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("report_clean.tsv", function(error, data) {
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.rate = +d.rate;
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.rate; }));

  svg.append("g")
  .attr("class", "x axis")
  .attr("stroke", "#FFFFFF")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  svg.append("g")
  .attr("stroke", "#FFFFFF")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("stroke", "#FFFFFF")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Price ($)");

  svg.append("path")
  .datum(data)
  .attr("class", "line")
  .attr("d", line);


  d3.tsv("key_dates.tsv", function(error, data) {
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.rate = + d.rate;
    });

    //Mouseover tip
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([80, 0])
    .html(function(d) {
      return "<strong>" + (d3.time.format("%b %d, %Y"))(d.date) + "</strong><br>$/RMB: " +
      d.rate + "<br>"
    });

    svg.call(tip);

    svg.selectAll("#dot")
    .data(data)
    .enter().append("circle")
    .attr('class', 'datapoint')
    .attr('cx', function(d) { return x(d.date); })
    .attr('cy', function(d) { return y(d.rate); })
    .attr('r', 6)
    .attr('fill', '#2b3e50')
    .attr('stroke', '#FFFFFF')
    .attr('stroke-width', '3')
    .on('mouseover', function(d) {
      tip.show(d);
      $('#content').text(d.event);
    })
    .on('mouseout', tip.hide)
  });
});
