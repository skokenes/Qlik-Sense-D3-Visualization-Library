var senseUtils = {
    destroyObj : function(app, qId) {
        app.model.session.socket.send(JSON.stringify({
            "jsonrpc" : "2.0",
            "id" : 2,
            "method" : "DestroySessionObject",
            "handle" : 1,
            "params" : qId instanceof Array ? qId : [qId]
        }));
    },
    filterPanel : function() {
        var fields = [], field_list = [], app, badges = true, autoCollapse = true, container, init = false, chevron = '<svg height="6px" version="1.1" viewBox="0 0 12 7.4000001" width="9px"><g id="Page-1" transform="matrix(0,1,-1,0,12,-0.1)" style="fill:none;stroke:none"><g id="Core" transform="translate(-260,-90)" style="fill:#000000"><g id="chevron-right" transform="translate(260.5,90)"><path d="M 1,0 -0.4,1.4 4.2,6 -0.4,10.6 1,12 7,6 1,0 z" id="Shape" inkscape:connector-curvature="0"></path></g></g></g></svg>', check = '<svg height="9px" version="1.1" viewBox="0 0 18 15" width="12px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 12 9"><title></title><desc></desc><defs></defs><g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"><g fill="#000000" id="Core" transform="translate(-423.000000, -47.000000)"><g id="check" transform="translate(423.000000, 47.500000)"><path d="M6,10.2 L1.8,6 L0.4,7.4 L6,13 L18,1 L16.6,-0.4 L6,10.2 Z" id="Shape"></path></g></g></g></svg>';
        function filterPanel() {
        }


        filterPanel.fields = function() {
            return fields;
        }
        filterPanel.addFields = function(_) {
            _.forEach(function(d) {
                if (d.hasOwnProperty("title") && field_list.indexOf(d.name) === -1) {
                    fields.push(new field(d.name, d.title))
                    field_list.push(d.name);
                } else if (field_list.indexOf(d) === -1) {
                    fields.push(new field(d));
                    field_list.push(d);
                }
            });
            build();
            return filterPanel;
        }
        filterPanel.app = function(_) {
            if (!arguments.length)
                return app;
            app = _;
            return filterPanel;
        }
        filterPanel.badges = function(_) {
            if (!arguments.length)
                return badges;
            badges = _;
            $(".filter-badge").each(function(i, d) {
                checkBadge(d);
            });
            return filterPanel;
        }
        filterPanel.autoCollapse = function(_) {
            if (!arguments.length)
                return autoCollapse;
            autoCollapse = _;
            return filterPanel;
        }
        filterPanel.container = function(_) {
            if (!arguments.length)
                return container;
            container = _;
            return filterPanel;
        }
        filterPanel.removeField = function(_) {
            if (!arguments.length)
                return filterPanel;
            var field = fields.filter(function (d) {
            return d.field === _
            })[0];
            console.log(field);
            senseUtils.destroyObj(app, field.qId);
            fields = fields.filter(function(d) {
                return d.field != _
            });
            field_list = field_list.filter(function(d) {
                return d != _
            });
            $(".filter").filter(function(d) {
                return $(this).data().field === _
            }).empty();
        }
        function field(name, title) {
            this.field = name;
            this.title = typeof title === "undefined" ? name : title;
            this.init = false;
            this.values = null;
            this.cardinality = null;
            this.selected = null;
            this.possible = null;
            this.qId = null;
        }

        function build() {
            var filter_build = fields.filter(function(d) {
                return d.init === false;
            });
            filter_build.forEach(function(d) {
                d.init = true;
                // build the filter
                var filter = document.createElement("div");
                $(filter).addClass("filter").data("field", d.field).appendTo($(container));
                // create the list box header
                var header = document.createElement("div");
                // set it's properties
                $(header).addClass("filter-header").addClass("inactive").html(d.title).appendTo($(filter));
                // create the chevron
                var chev = document.createElement("div");
                $(chev).addClass("chevron").html(chevron).appendTo($(header));
                // create the badge
                var badge = document.createElement("span");
                $(badge).addClass("badge").addClass("filter-badge").appendTo($(header));
                // create filter content
                var content = document.createElement("div");
                $(content).addClass("filter-content").addClass("inactive").appendTo($(filter));
                // click event to toggle show
                $(header).on("click", function() {
                    if ($(content).hasClass("active")) {
                        $(content).removeClass("active");
                        $(content).addClass("inactive");
                    } else {
                        if (autoCollapse === true)
                            $(container).find(".active").removeClass("active").addClass("inactive");
                        $(content).removeClass("inactive").addClass("active");
                    }
                });
                // create hypercube
                var field = d.field;
                app.createList({
                    "qDef" : {
                        "qFieldDefs" : [field]
                    },
                    "qInitialDataFetch" : [{
                        qTop : 0,
                        qLeft : 0,
                        qHeight : 10000,
                        qWidth : 1
                    }]
                }, function(reply) {
                    var values = reply.qListObject.qDataPages[0].qMatrix.map(function(e) {
                        return e[0];
                    });
                    d.values = values;
                    d.cardinality = reply.qListObject.qDimensionInfo.qCardinal;
                    d.selected = reply.qListObject.qDimensionInfo.qStateCounts.qSelected;
                    d.possible = reply.qListObject.qDimensionInfo.qStateCounts.qOption;
                    d.qId = reply.qInfo.qId;
                    update(d);
                });
            });
        }

        function update(cf) {
            // the classes
            var classes = {
                "S" : "selected",
                "O" : "possible",
                "X" : "excluded"
            };
            var filter = $(container).find(".filter").filter(function(d) {
                return $(this).data().field === cf.field
            });
            // current field
            var field = cf.field;
            // get badge
            var badge = $(".filter-badge", $(filter));
            var badge_data = cf.selected;
            $(badge).html(badge_data).data({
                "count" : badge_data
            });
            checkBadge(badge);
            // get content
            var content = $(".filter-content", $(filter));
            // get new content data
            var content_data = cf.values;
            // empty content
            $(content).empty();
            // rebuild content
            content_data.forEach(function(e, k) {
                var list_item = document.createElement("div");
                // create the check
                var check_d = document.createElement("div");
                $(check_d).addClass("check").html(check).appendTo($(list_item));
                $(list_item).addClass("filter-item").addClass(classes[e.qState]).append(e.qText).appendTo($(content)).click(function() {
                    app.field(field).selectValues([{
                        qText : e.qText
                    }], true, false);
                });
            });
        }

        function checkBadge(b) {
            if ($(b).data().count === 0 || badges === false) {
                $(b).hide()
            } else {
                $(b).show();
            }
        }

        return filterPanel;
    },
    flattenPages : function(data) {// function to flatten out the paginated qHyperCube data into one large qMatrix
        var flat = [];
        $.each(data, function() {
            flat.extend(this.qMatrix);
        });
        return flat;
    },
    multiCube : function() {
        var app, cubes = [], callback = function() {
        }, queue;
        function multiCube() {
        }

        var queue = function() {
            var cube_status = 0;
            cubes.forEach(function(d) {
                cube_status = cube_status + d.status;
            });
            if (cube_status === cubes.length) {
                callback();
                cubes.forEach(function(d) {
                    d.status = 0;
                });
            }
        }
        multiCube.app = function(_) {
            if (!arguments.length)
                return app;
            app = _;
            return multiCube;
        };
        multiCube.addCube = function(_) {
            if (!arguments.length)
                return null;
            var id = guid();
            cubes.push({
                id : id,
                def : _,
                status : 0,
                data : null,
                qId : null
            });
            var currCube = getCubeObj(id);
            app.createCube(_, function(reply) {
                currCube.status = 1;
                currCube.data = reply;
                currCube.qId = reply.qInfo.qId;
                queue();
            });
            return multiCube;
        }
        multiCube.removeCube = function(_) {
            if (!arguments.length)
                return null;
            senseUtils.destroyObj(app, getCubeObj(_).qId);
            cubes = cubes.filter(function(d) {
                return d.id != _
            });
        }
        multiCube.callback = function(_) {
            if (!arguments.length)
                return callback;
            callback = _;
            return multiCube;
        }
        multiCube.cubes = function() {
            return cubes;
        }
        multiCube.selfDestruct = function() {
            cubes.forEach(function(d) {
                senseUtils.destroyObj(app, d.qId);
            });
            app = null, cubes = [], callback = function() {
            }, queue = null;
        }
        var getCubeObj = function(guid) {
            var cubeObj;
            for (var i = 0; i < cubes.length; i++) {
                if (cubes[i].id === guid) {
                    cubeObj = cubes[i]
                    break;
                }
            }
            return cubeObj;
        }
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }

            return (function() {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            })();
        };
        return multiCube;
    },//function for paging data in an extension object
    pageExtensionData : function(me, $el, layout, callback) {//(this, extension DOM element, layout object from Sense, your callback)
        var lastrow = 0
        //get number of columns
        var colNums = layout.qHyperCube.qSize.qcx;
        //calculate how many rows to page. currently, you can't ask for more than 10,000 cells at a time, so the number of rows
        //needs to be 10,000 divided by number of columns
        var calcHeight = Math.floor(10000 / colNums);
        //loop through the rows we have and render
        me.backendApi.eachDataRow(function(rownum, row) {
            //simply by looping through each page, the qHyperCube is updated and will not have more than one page
            lastrow = rownum;
        });
        if (me.backendApi.getRowCount() > lastrow + 1) {//if we're not at the last row...
            //we havent got all the rows yet, so get some more.  we first create a new page request
            var requestPage = [{
                qTop : lastrow + 1,
                qLeft : 0,
                qWidth : colNums,
                //should be # of columns
                qHeight : Math.min(calcHeight, me.backendApi.getRowCount() - lastrow)
            }];
            me.backendApi.getData(requestPage).then(function(dataPages) {
                //when we get the result run the function again
                senseUtils.pageExtensionData(me, $el, layout, callback);
            });
        } else {//if we are at the last row...
            var bigMatrix = [];
            //use flattenPages function to create large master qMatrix
            bigMatrix = senseUtils.flattenPages(layout.qHyperCube.qDataPages);
            //fire off the callback function
            callback($el, layout, bigMatrix, me);
            //(DOM element, layout object, new flattened matrix, this)
        }
    },
    getMeasureLabel: function(n,layout) {
        return layout.qHyperCube.qMeasureInfo[n-1].qFallbackTitle;
    },

    getDimLabel: function(n,layout) {
        return layout.qHyperCube.qDimensionInfo[n-1].qFallbackTitle;
    },
    setupContainer: function($element,layout,class_name) {
        // Properties: height, width, id
        var ext_height = $element.height(),
            ext_width = $element.width(), 
            id = "ext_" + layout.qInfo.qId;

        // Initialize or clear out the container and its classes
        if (!document.getElementById(id)) {
            $element.append($("<div />").attr("id",id));
        }

        else {
        
            $("#" + id)
                .empty()
                .removeClass();

        }

        // Set the containers properties like width, height, and class
        
        $("#" + id)
            .width(ext_width)
            .height(ext_height)
            .addClass(class_name);

        return id;
    },
    extendLayout: function(layout,self) {
        var dim_count = layout.qHyperCube.qDimensionInfo.length;

        layout.qHyperCube.qDataPages[0].qMatrix.forEach(function(d) {
            d.dim = function(i) {
                return d[i-1];
            };
            d.measure = function(i) {
                return d[i+dim_count-1];
            };

            for (var i = 0; i<dim_count; i++) {
                d[i].qSelf = self;
                d[i].qIndex = i;
                d[i].qSelect = function() {
                    this.qSelf.backendApi.selectValues(this.qIndex,[this.qElemNumber],true);    
                };
                        
            };
        });
    }
};

Object.defineProperty(Array.prototype, 'extend', {
    enumerable: false,  
    value:function(arr) {
        arr.forEach(function(v) {
            this.push(v);
        },this);
    }
});
