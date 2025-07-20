import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const SplineChart = ({ data, loading, viewType }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${window.embedpressAnalyticsData?.restUrl}spline-chart?date_range=30`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.embedpressAnalyticsData?.nonce || window.wpApiSettings?.nonce
          }
        });

        if (response.ok) {
          const result = await response.json();

          

          console.log('chart data', result.data);
          if (result.success && result.data) {
            setChartData(result.data);
          } else {
            console.warn('No chart data received, using fallback data');
            setChartData(getFallbackData());
          }
        } else {
          console.error('Failed to fetch chart data:', response.status);
          setChartData(getFallbackData());
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartData(getFallbackData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [viewType]);

  // Fallback data in case API fails - matches the design pattern
  const getFallbackData = () => {
    return [
      { month: "JAN", clicks: 0, views: 0, impressions: 0 },
      { month: "FEB", clicks: 0, views: 0, impressions: 0 },
      { month: "MAR", clicks: 0, views: 0, impressions: 0 },
      { month: "APR", clicks: 0, views: 0, impressions: 0 },
      { month: "MAY", clicks: 0, views: 0, impressions: 0 },
      { month: "JUN", clicks: 0, views: 0, impressions: 0 },
      { month: "JUL", clicks: 0, views: 0, impressions: 0 },
      { month: "AUG", clicks: 0, views: 0, impressions: 0 },
      { month: "SEP", clicks: 0, views: 0, impressions: 0 },
      { month: "OCT", clicks: 0, views: 0, impressions: 0 },
      { month: "NOV", clicks: 0, views: 0, impressions: 0 },
      { month: "DEC", clicks: 0, views: 0, impressions: 0 }
    ];
  };

  console.log({ chartData, isLoading, viewType });

  useLayoutEffect(() => {
    // Don't render chart if data is still loading or empty
    if (isLoading || !chartData || chartData.length === 0) {
      return;
    }

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
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20
      })
    );

    // Add cursor
    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    // Create X axis
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 50
    });

    xRenderer.labels.template.setAll({
      centerY: am5.p50,
      centerX: am5.p50,
      paddingTop: 15,
      fontSize: 12,
      fill: am5.color("#999999")
    });

    xRenderer.grid.template.setAll({
      strokeDasharray: [2, 2],
      strokeOpacity: 0.5,
      stroke: am5.color("#E5E5E5")
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "month",
        renderer: xRenderer
      })
    );

    // Create Y axis
    const yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0
    });

    yRenderer.labels.template.setAll({
      centerX: am5.p100,
      paddingRight: 15,
      fontSize: 12,
      fill: am5.color("#999999")
    });

    yRenderer.grid.template.setAll({
      strokeDasharray: [2, 2],
      strokeOpacity: 0.5,
      stroke: am5.color("#E5E5E5")
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 120,
        renderer: yRenderer
      })
    );

    // Create series
    const createSeries = (name, field, color, strokeWidth = 3) => {
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

      series.set("smoothing", 0.8);

      series.fills.template.setAll({
        fillOpacity: 0,
        visible: false
      });

      series.bullets.push(() => {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Circle.new(root, {
            radius: 0,
            stroke: series.get("stroke"),
            strokeWidth: 2,
            fill: am5.color("#ffffff")
          })
        });
      });

      return series;
    };

    // Create three series with colors matching the image
    const series1 = createSeries("Clicks", "clicks", "#5B4E96", 4); // Dark purple - thickest
    const series2 = createSeries("Views", "views", "#8A76E3", 3); // Medium purple
    const series3 = createSeries("Impressions", "impressions", "#C8B9FF", 2); // Light purple - thinnest

    // Set data from API
    xAxis.data.setAll(chartData);
    series1.data.setAll(chartData);
    series2.data.setAll(chartData);
    series3.data.setAll(chartData);

    // Make stuff animate on load
    series1.appear(1000);
    series2.appear(1000);
    series3.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartData, isLoading]);

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

      {/* Loading state */}
      {isLoading && (
        <div style={{
          width: "100%",
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: "4px"
        }}>
          <div>Loading chart data...</div>
        </div>
      )}

      {/* Chart container */}
      {!isLoading && (
        <div
          ref={chartRef}
          style={{
            width: "100%",
            height: "400px",
            backgroundColor: "#ffffff"
          }}
        />
      )}

    </>

  );
};

export default SplineChart;
