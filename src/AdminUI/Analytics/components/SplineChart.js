import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const SplineChart = () => {
  const chartRef = useRef(null);

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
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft: 0,
        paddingRight: 1
      })
    );

    // Add cursor
    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    // Create axes
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true
    });

    xRenderer.labels.template.setAll({
      rotation: 0,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
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
          smoothing: 1, // Maximum smoothing (0-1, where 1 is smoothest)
          tension: 0.8, // Higher tension for smoother curves
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name}: {valueY}"
          })
        })
      );

      series.strokes.template.setAll({
        strokeWidth: 3,
        strokeDasharray: []
      });

      series.fills.template.setAll({
        fillOpacity: 0.2,
        visible: true
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
    const series1 = createSeries("60%", "value1", "#7c3aed"); // Purple
    const series2 = createSeries("54%", "value2", "#a855f7"); // Light purple
    const series3 = createSeries("45%", "value3", "#c084fc"); // Lighter purple

    // Sample data matching the chart in the image
    const data = [
      { month: "JAN", value1: 30, value2: 15, value3: 12 },
      { month: "FEB", value1: 45, value2: 20, value3: 18 },
      { month: "MAR", value1: 70, value2: 25, value3: 20 },
      { month: "APR", value1: 65, value2: 22, value3: 19 },
      { month: "MAY", value1: 50, value2: 18, value3: 15 },
      { month: "JUN", value1: 45, value2: 16, value3: 14 },
      { month: "JUL", value1: 75, value2: 28, value3: 22 },
      { month: "AUG", value1: 65, value2: 25, value3: 20 },
      { month: "SEP", value1: 80, value2: 30, value3: 25 },
      { month: "OCT", value1: 85, value2: 32, value3: 26 },
      { month: "NOV", value1: 110, value2: 40, value3: 30 },
      { month: "DEC", value1: 115, value2: 42, value3: 32 }
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
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "400px",
        backgroundColor: "#ffffff"
      }}
    />
  );
};

export default SplineChart;
