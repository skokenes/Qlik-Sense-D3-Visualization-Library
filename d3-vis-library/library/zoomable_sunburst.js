var viz = function($element, layout, _this) {
    var id = senseUtils.setupContainer($element,layout,"d3vl_zoom_sunburst"),
        ext_width = $element.width(),
        ext_height = $element.height();

    var data = layout.qHyperCube.qDataPages[0].qMatrix;

    var dim_count = layout.qHyperCube.qDimensionInfo.length;

    var myJSON = {name: layout.title, children: senseD3.createFamily(data,dim_count)};

    var width = ext_width - 5,
        height = ext_height - 5,
        radius = (Math.min(width, height) / 2.2);

    var x = d3.scale.linear().range([0, 2 * Math.PI]);

    var y = d3.scale.linear().range([0, radius]);

    var color = d3.scale.category20c();

    var svg = d3.select("#" + id).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

    var partition = d3.layout.partition().value(function (d) {
        return d.size;
    });

    var arc = d3.svg.arc().startAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
    }).endAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
    }).innerRadius(function (d) {
        return Math.max(0, y(d.y));
    }).outerRadius(function (d) {
        return Math.max(0, y(d.y + d.dy));
    });


    var g = svg.selectAll("g").data(partition.nodes(myJSON)).enter().append("g");

    var path = g.append("path").attr("d", arc).style("fill", function (d) {
        if (d.depth === 0) {
            var theColor = "white";
        } else {
            var theColor = color((d.children ? d : d.parent).name);
        }
        return theColor;
    }).on("click", click);
    var text;
    if (width > 300) {
        text = g.append("text").attr("transform", function (d) {
            return "rotate(" + senseD3.computeTextRotation(d, x) + ")";
        }).attr("x", function (d) {
            return y(d.y);
        }).attr("dx", "6") // margin
        .attr("dy", ".35em") // vertical-align
        .text(function (d) {
            return d.name;
        });
    }

    function click(d) {
        // fade out all text elements
        text.transition().attr("opacity", 0);
        path.transition().duration(750).attrTween("d", senseD3.arcTween(d, x, y, radius, arc)).each("end", function (e, i) {
            // check if the animated element's data e lies within the visible angle span given in d
            if (e.x >= d.x && e.x < (d.x + d.dx)) {
                // get a selection of the associated text element
                var arcText = d3.select(this.parentNode).select("text");
                // fade in the text element and recalculate positions
                arcText.transition().duration(750).attr("opacity", 1).attr("transform", function () {
                    return "rotate(" + senseD3.computeTextRotation(e, x) + ")"
                }).attr("x", function (d) {
                    return y(d.y);
                });
            }
        });
    }


    //d3.select(self.frameElement).style("height", height + "px");





}