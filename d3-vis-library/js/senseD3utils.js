var senseD3 = {
    arcTween: function(d, x, y, radius, arc) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function(d, i) {
            return i ? function(t) {
                return arc(d);
            } : function(t) {
                x.domain(xd(t));
                y.domain(yd(t)).range(yr(t));
                return arc(d);
            };
        };

    },
    computeTextRotation: function(d, x) {
        return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
    },
  //create family is to be used for creating a tree type data structure which can be used in most D3 tree vizualizations.  
  //See more info about the tree layout here:  https://github.com/mbostock/d3/wiki/Tree-Layout
    createFamily: function(dataSet,numDims) {
        var numDims;
        if(arguments.length==1) {
            numDims = 2;
        }
        
        //create arrays of parents and children.  this is so we can determine if there's any nodes without parents.  these would be the top parents 
        var parentsA = [];
        var kidsA = [];
        //format Sense data into a more easily consumable format and build the parent/child arrays

        var happyData = [];
        for(s in dataSet){
            var d = dataSet[s];
            for(i=0; i<numDims-1; i++){

                if (parentsA.indexOf(d[i].qText) === -1) {
                    parentsA.push(d[i].qText);
                }
                var parentVal = "";
                if ((!(d[i].qText)) || (d[i].qText == "-") || (d[i].qText == "") || (d[i].qText) == " ") {
                    parentVal = "[root]";
                } else {
                    parentVal = d[i].qText;
                }
                if (kidsA.indexOf(d[i+1].qText) === -1) {
                    kidsA.push(d[i+1].qText);
                }
                var exists = false;
                $.each(happyData, function(){
                    if((this.parent == parentVal) && (this.name == d[i+1].qText)){
                        exists = true;
                    }
                });
                if(!exists){
                    var newDataSet = {
                        name: d[i+1].qText,
                        parent: parentVal,
                        size: d[numDims].qNum,
                        leaf: (i+1) === (numDims-1) ? true : false
                    };
                    happyData.push(newDataSet);
                }
            }
        }

        //loop through the parent and child arrays and find the parents which aren't children.  set those to have a parent of "-", indicating that they're the top parent
        $.each(parentsA, function() {
            if (kidsA.indexOf(this.toString()) === -1) {
                var noParent = {
                    "name": this.toString(),
                    "parent": "[root]"
                }
                happyData.push(noParent);
            }
        });

        //crawl through the data to create the family tree in JSON
        function getChildren(name) {
            return happyData.filter(function(d) {
                    return d.parent === name;
                })
                .map(function(d) {
                    var mapping;
                    if(d.leaf) {
                        mapping = {
                            name: d.name,
                            size: d.size
                        };
                    }
                    else {
                        mapping = {
                            name: d.name,
                            size: d.size,
                            children: getChildren(d.name)
                        };
                    }
                    
                    return mapping;
                });
        }

        var JSONtree = getChildren('[root]');
        return JSONtree;

    },
    // Traverse the dataset to find the maximum value of a 
    // specified attribute from all of the nodes in the passed dataset
    findMaxValue: function(attr, dataSet) {
        var maxValue = 0;
        dataSet.forEach(function(d) {
            maxValue = (d[attr] > maxValue ? d[attr] : maxValue);
        });
        return maxValue;
    }
};
