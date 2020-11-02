(function() {
    let shadowRoot;

    var Ar = [];
    var ArChartGauge = [];

    let template = document.createElement("template");
    template.innerHTML = `
		<style type="text/css">	
		body {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
		}
		</style>   
	`;

    //https://www.amcharts.com/lib/4/core.js
    const amchartscorejs = "https://fedems.github.io/SACAmbar3D/box/core.js";
    //https://www.amcharts.com/lib/4/charts.js
    const amchartschartsjs = "https://fedems.github.io/SACAmbar3D/box/charts.js";
    //https://www.amcharts.com/lib/4/themes/animated.js
    const amchartsanimatedjs = "https://fedems.github.io/SACAmbar3D/box/animated.js";

	function loadScript(src) {
	  return new Promise(function(resolve, reject) {
		let script = document.createElement('script');
		script.src = src;

		script.onload = () => {console.log("Load: " + src); resolve(script);}
		script.onerror = () => reject(new Error(`Script load error for ${src}`));

		shadowRoot.appendChild(script)
	  });
	}

    // Create the chart
    function Amchart(id, divid, value, title, firsttime) {

//        var data = {};
//        if (value !== "") {
//            data = JSON.parse(value);
//            console.log(data);
//        }

        if(firsttime === 0) {
            
			// Themes begin
			am4core.useTheme(am4themes_animated);
			// Themes end
            
            var chart = am4core.create(divid, am4charts.XYChart);
            chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
            
            chart.data = [
              {
                country: "USA",
                visits: 23725
              },
              {
                country: "China",
                visits: 1882
              },
              {
                country: "Japan",
                visits: 1809
              },
              {
                country: "Germany",
                visits: 1322
              },
              {
                country: "UK",
                visits: 1122
              },
              {
                country: "France",
                visits: 1114
              },
              {
                country: "India",
                visits: 984
              },
              {
                country: "Spain",
                visits: 711
              },
              {
                country: "Netherlands",
                visits: 665
              },
              {
                country: "Russia",
                visits: 580
              },
              {
                country: "South Korea",
                visits: 443
              },
              {
                country: "Canada",
                visits: 441
              }
            ];
            
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.dataFields.category = "country";
            categoryAxis.renderer.minGridDistance = 40;
            categoryAxis.fontSize = 11;

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.max = 24000;
            valueAxis.strictMinMax = true;
            valueAxis.renderer.minGridDistance = 30;
            
            // axis break
            var axisBreak = valueAxis.axisBreaks.create();
            axisBreak.startValue = 2100;
            axisBreak.endValue = 22900;
            //axisBreak.breakSize = 0.005;

            // fixed axis break
            var d = (axisBreak.endValue - axisBreak.startValue) / (valueAxis.max - valueAxis.min);
            axisBreak.breakSize = 0.05 * (1 - d) / d; // 0.05 means that the break will take 5% of the total value axis height

            // make break expand on hover
            var hoverState = axisBreak.states.create("hover");
            hoverState.properties.breakSize = 1;
            hoverState.properties.opacity = 0.1;
            hoverState.transitionDuration = 1500;

            axisBreak.defaultState.transitionDuration = 1000;
            /*
            // this is exactly the same, but with events
            axisBreak.events.on("over", function() {
              axisBreak.animate(
                [{ property: "breakSize", to: 1 }, { property: "opacity", to: 0.1 }],
                1500,
                am4core.ease.sinOut
              );
            });
            axisBreak.events.on("out", function() {
              axisBreak.animate(
                [{ property: "breakSize", to: 0.005 }, { property: "opacity", to: 1 }],
                1000,
                am4core.ease.quadOut
              );
            });*/

            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = "country";
            series.dataFields.valueY = "visits";
            series.columns.template.tooltipText = "{valueY.value}";
            series.columns.template.tooltipY = 0;
            series.columns.template.strokeOpacity = 0;

            // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
            series.columns.template.adapter.add("fill", function(fill, target) {
              return chart.colors.getIndex(target.dataItem.index);
            });
            
		  } 
          else {            	
            	var foundIndex = Ar.findIndex(x => x.id == id);
    			console.log("foundIndex drawChart: " + foundIndex);
    			ArChartGauge[foundIndex].chart.data = data;
            }

    };

    function Draw(Ar, firsttime) {
        for (var i = 0; i < Ar.length; i++) {
			Amchart(Ar[i].id, Ar[i].div, Ar[i].value, "", firsttime)
        }
    };

    class Box extends HTMLElement {
        constructor() {
            console.log("constructor");
            super();
            shadowRoot = this.attachShadow({
                mode: "open"
            });

            shadowRoot.appendChild(template.content.cloneNode(true));

            this._firstConnection = 0;

            this.addEventListener("click", event => {
                console.log('click');
                var event = new Event("onClick");
                this.dispatchEvent(event);

            });
            this._props = {};
        }

        //Fired when the widget is added to the html DOM of the page
		connectedCallback() {
            console.log("connectedCallback");
        }

		//Fired when the widget is removed from the html DOM of the page (e.g. by hide)
		disconnectedCallback() {
			console.log("disconnectedCallback");
        }

		//When the custom widget is updated, the Custom Widget SDK framework executes this function first
        onCustomWidgetBeforeUpdate(changedProperties) {
            console.log("onCustomWidgetBeforeUpdate");
            this._props = {
                ...this._props,
                ...changedProperties
            };
        }

		//When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
        onCustomWidgetAfterUpdate(changedProperties) {

            console.log("onCustomWidgetAfterUpdate");
            console.log(changedProperties);

            if ("value" in changedProperties) {
                console.log("value:" + changedProperties["value"]);
                this.$value = changedProperties["value"];
            }

            if ("formula" in changedProperties) {
                console.log("formula:" + changedProperties["formula"]);
                this.$formula = changedProperties["formula"];

            }

            console.log("firsttime: " + this._firstConnection);
            var that = this;

            if (this._firstConnection === 0) {
                const div = document.createElement('div');
                let divid = changedProperties.widgetName;
                this._tagContainer = divid;
                div.innerHTML = '<div id="container_' + divid + '"></div>';
                shadowRoot.appendChild(div);

                const css = document.createElement('div');
                css.innerHTML = '<style>#container_' + divid + ' {width: 100%; height: 500px;}</style>'
                shadowRoot.appendChild(css);

                var mapcanvas_divstr = shadowRoot.getElementById('container_' + divid);
                console.log(mapcanvas_divstr);
                Ar.push({
                    'id': divid,
                    'div': mapcanvas_divstr,
                    'value': this.$value,
                    'formula': this.$formula,
                });

				async function LoadLibs() {
					try {
//						await loadScript(googlesheetsjs);
						await loadScript(amchartscorejs);				
						await loadScript(amchartschartsjs);				
						await loadScript(amchartsanimatedjs);
					} catch (e) {
						alert(e);
					} finally {
						Draw(Ar, that._firstConnection);
						that._firstConnection = 1;
					}
				}
				LoadLibs();
				

            } else {
                var id = this.$value.split("|")[0];
                console.log("id: " + id);

                var value = this.$value.split("|")[1];
                console.log("value: " + value);

                var formula = this.$formula;
                console.log("formula: " + formula);

                if (value !== "") {
                    var foundIndex = Ar.findIndex(x => x.id == id);
                    console.log("foundIndex: " + foundIndex);

                    if (foundIndex !== -1) {
                        console.log(Ar[foundIndex].div);
//                        GoogleSheets(Ar[foundIndex].div, value, formula, id, this._firstConnection);
						Amchart(id, Ar[foundIndex].div, "", "", this._firstConnection)
                    }
                }
            }
        }

		//When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy() {
			console.log("onCustomWidgetDestroy");
        }
    }
    customElements.define("com-fd-amchartsbar3d", Box);
})();