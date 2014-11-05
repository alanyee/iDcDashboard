require(['//cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.11/crossfilter.min.js']);
    require(["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.1/d3.min.js",
             "//cdnjs.cloudflare.com/ajax/libs/dc/2.0.0-alpha.2/dc.min.js",
            "widgets/js/widget",
            "widgets/js/manager"],
            function(d3, dc, widget, WidgetManager){
                var dashboard_id = 0;

$$INSERT$$

                var DashboardView = IPython.DOMWidgetView.extend({
                    render: function(){
                        //Here we construct the data stores
                        this.cf   = crossfilter([]);
                        this.dims    = {};
                        this.charts  = [];
                        this.render_group = 'dashboard_' + (dashboard_id++);
                        this.set_dimensions();
                        this.set_data();
                        this.set_layout();

                        this.model.on('change:data', this.set_data, this);
                        this.model.on('change:layout', this.set_layout, this);
                        this.model.on('change:dim_code', this.set_dimensions(), this);
                },

                set_data:function(){
                    //this is not valid to loop through keys of an object
                    //this.dims.forEach(function(dim){dim.filter(null);});
                    this.cf.remove();
                    //Now we refresh the filters applied to all dc charts
                    this.charts.forEach(function(chart){
                        var oldFilters = chart.filters();
                        chart.filter(null);
                        oldFilters.forEach(function(filter){
                            chart.filter(filter);
                        });
                    });

                    var df = $.parseJSON(this.model.get('data'));
                    this.cf.add(df);
                    this.charts.forEach(function(plot){plot.update_data()});
                    dc.redrawAll();
                },

                set_dimensions:function(){
                    var dim_code = $.parseJSON(this.model.get('dim_code'));
                    var this_obj = this;
                    for(var name in dim_code){
                        var dim = {};
                        var dim_function = eval("(" + dim_code[name].dimension + ")");
                        dim.dimension = this_obj.cf.dimension(dim_function);
                        dim.dimension.dashboard_name = name;
                        dim.groups    = { '':dim.dimension.group() };
                        dim.groups[''].dashboard_name = '';
                        for(var g_name in dim_code[name].groups){
                            var group_function = eval("("+dim_code[name].groups[g_name]+")");
                            dim.groups[g_name] = group_function(dim.dimension);
                            dim.groups[g_name].dashboard_name = g_name;
                        }
                        this_obj.dims[name] = dim;
                    }
                },

                set_layout:function(){
                    var $root = this.$el;

                    var layout = $.parseJSON(this.model.get('layout'));
                    var this_obj = this;
                    var $layer = null;
                    var layer_h = 200;

                    for(var i in layout){
                        var plot_conf = layout[i];
                        if(plot_conf.type=="layer"){
                            $layer = $('<div />').attr('class','layer').appendTo($root);
                            layer_h = plot_conf.height | layer_h;
                        }else{
                            var $plot_parent = $('<div />')
                                .width((plot_conf.width | layer_h)+10)
                                .attr('class','plot_parent')
                                .appendTo($layer);
                            var $plot_title = $('<div />')
                                .attr('class','title')
                                .html(plot_conf.title || "")
                                .appendTo($plot_parent);
                            var $plot_area = $('<div />')
                                .attr('id', this_obj.render_group + "_plot_" + i)
                                .attr('render_group', this_obj.render_group)
                                .appendTo($plot_parent);

                            //This isn't working, gives error object is not a function
                            var plot = new plots[plot_conf.type];

                            var ds = plot_conf.data_source.split("/");
                            if(ds[0] === "cf") {
                                var dim = this_obj.dims[ds[1]].dimension;
                                var grp = this_obj.dims[ds[1]].groups[ds[2]];
                                plot.set_data_source({dimemsion: dim, group: grp});
                            }else{
                                console.log("Bad data source field : '" + plot_conf.data_source + "'");
                            }
                            plot.render(this_obj, $plot_area);
                            plot.height(layer_h);
                            plot.width(plot_conf.width | layer_h );

                            if(plot_conf.config){
                                for(var j in plot_conf.config){
                                    var conf_directive = plot_conf[j];
                                    if( plot.config[conf_directive.cmd] ){
                                        plot.config[conf_directive.cmd](conf_directive.conf);
                                    }else{
                                        console.log("Illegal conf_directive'" + conf_directive);
                                    }
                                }
                            }

                            this_obj.charts.push(plot);
                        }
                    }
                    dc.renderAll(this.render_group);
                },

                update_filter:function(){
                    var filters = {};
                    for( var i in this.charts){
                        var chart = this.charts[i];
                        var dim_name = chart.dimension.dashboard_name;
                        filters[dim_name] = filters[dim_name] || [];
                        if( chart.plot.filters().length > 0 ) {
                            filters[dim_name] = filters[dim_name].concat(chart.plot.filters());
                        }
                    }

                    console.log(filters);
                    this.model.set("filters",JSON.stringify(filters));
                    this.touch();
                }

            });

            // Register the DashboardView with the widget manager.
            WidgetManager.register_widget_view('DashboardView', DashboardView);
});
