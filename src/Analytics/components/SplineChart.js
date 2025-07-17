import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const SplineChart = ({ data, loading, viewType }) => {
  const chartRef = useRef(null);



  console.log({ data, loading, viewType });

  useLayoutEffect(() => {
    // Create root element
    const root = am5.Root.new(chartRef.current);

    // Remove amCharts logo/sponsored link
    root._logo.dispose();

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0


      })
    );

    // Add cursor
    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    // Create axes
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 60,
      minorGridEnabled: false
    });

    xRenderer.labels.template.setAll({
      rotation: 0,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });

    // Hide intermediate labels for smoother appearance
    xRenderer.labels.template.adapters.add("text", function (text, target) {
      const dataItem = target.dataItem;
      if (dataItem && dataItem.get("category")) {
        const category = dataItem.get("category");
        // Only show main month labels, hide the -15 intermediate points
        if (category.includes("-15")) {
          return "";
        }
      }
      return text;
    });

    xRenderer.grid.template.setAll({
      location: 1
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "month",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    const yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: yRenderer
      })
    );

    // Create series
    const createSeries = (name, field, color) => {
      const series = chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: field,
          categoryXField: "month",
          stroke: am5.color(color),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name}: {valueY}"
          })
        })
      );

      series.strokes.template.setAll({
        strokeWidth: 3,
        strokeDasharray: []
      });

      // Set smoothing for better curves
      series.set("smoothing", 1);

      series.fills.template.setAll({
        fillOpacity: 0,
        visible: false
      });

      series.bullets.push(() => {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Circle.new(root, {
            radius: 4,
            stroke: series.get("stroke"),
            strokeWidth: 2,
            fill: am5.color("#ffffff")
          })
        });
      });

      return series;
    };

    // Create three series with different colors matching the image
    const series1 = createSeries("60%", "clicks", "#5B4E96"); // Purple
    const series2 = createSeries("54%", "views", "#8A76E3"); // Light purple
    const series3 = createSeries("45%", "impressions", "#D9D1FF"); // Lighter purple

    // Sample data with more points for better horizontal smoothing
    const data = [
      { month: "JAN", clicks: 30, views: 15, impressions: 12 },
      { month: "FEB", clicks: 45, views: 20, impressions: 18 },
      { month: "MAR", clicks: 70, views: 25, impressions: 20 },
      { month: "APR", clicks: 65, views: 22, impressions: 19 },
      { month: "MAY", clicks: 50, views: 18, impressions: 15 },
      { month: "JUN", clicks: 45, views: 16, impressions: 14 },
      { month: "JUL", clicks: 75, views: 28, impressions: 22 },
      { month: "AUG", clicks: 65, views: 25, impressions: 20 },
      { month: "SEP", clicks: 80, views: 30, impressions: 25 },
      { month: "OCT", clicks: 85, views: 32, impressions: 26 },
      { month: "NOV", clicks: 110, views: 40, impressions: 30 },
      { month: "DEC", clicks: 115, views: 42, impressions: 32 }
    ];

    // Set data
    xAxis.data.setAll(data);
    series1.data.setAll(data);
    series2.data.setAll(data);
    series3.data.setAll(data);

    // Make stuff animate on load
    series1.appear(1000);
    series2.appear(1000);
    series3.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <>
      {/* need to add colors and chart line name */}
      <div className="chart-legend-custom" style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '20px'
      }} >
        <div className="legend-item">
          <span className="legend-color" style={{
            backgroundColor: '#5B4E96',
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            display: 'inline-block'
          }}></span>
          <span className="legend-text">Clicks</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{
            backgroundColor: '#8A76E3',
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            display: 'inline-block'
          }}></span>
          <span className="legend-text">Views</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{
            backgroundColor: '#D9D1FF',
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            display: 'inline-block'
          }}></span>
          <span className="legend-text">Impressions</span>
        </div>
      </div>

      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: "400px",
          backgroundColor: "#ffffff",
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          padding: "10px"
        }}
      />

    </>

  );
};

export default SplineChart;
