import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const SplineChart = ({ data, loading, viewType }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if pro is active
  const isProActive = window.embedpressAnalyticsData?.isProActive || false;

  // Dummy data for when pro is not active
  const dummyChartData = [
    { date: "2024-01-01", views: 45, clicks: 12, impressions: 78 },
    { date: "2024-01-02", views: 52, clicks: 15, impressions: 85 },
    { date: "2024-01-03", views: 48, clicks: 13, impressions: 82 },
    { date: "2024-01-04", views: 61, clicks: 18, impressions: 95 },
    { date: "2024-01-05", views: 55, clicks: 16, impressions: 88 },
    { date: "2024-01-06", views: 67, clicks: 20, impressions: 102 },
    { date: "2024-01-07", views: 59, clicks: 17, impressions: 91 },
    { date: "2024-01-08", views: 73, clicks: 22, impressions: 108 },
    { date: "2024-01-09", views: 68, clicks: 19, impressions: 98 },
    { date: "2024-01-10", views: 81, clicks: 25, impressions: 115 },
    { date: "2024-01-11", views: 76, clicks: 23, impressions: 112 },
    { date: "2024-01-12", views: 89, clicks: 28, impressions: 125 },
    { date: "2024-01-13", views: 84, clicks: 26, impressions: 118 },
    { date: "2024-01-14", views: 92, clicks: 30, impressions: 132 },
    { date: "2024-01-15", views: 87, clicks: 27, impressions: 128 }
  ];

  // Fetch real data from API only if pro is active
  useEffect(() => {
    if (!isProActive) {
      setChartData(dummyChartData);
      setIsLoading(false);
      return;
    }

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

          if (result.success && result.data) {
            setChartData(result.data);
          } else {
            setChartData([]);
          }
        } else {
          setChartData([]);
        }
      } catch (error) {
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [viewType, isProActive]);

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
        paddingBottom: 20,
        maskRectangle: true
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

    // Calculate dynamic max value based on data
    const getMaxValue = () => {
      if (!chartData || chartData.length === 0) return 120;

      let maxValue = 0;
      chartData.forEach(item => {
        const clicks = item.clicks || 0;
        const views = item.views || 0;
        const impressions = item.impressions || 0;
        maxValue = Math.max(maxValue, clicks, views, impressions);
      });

      // Add 20% padding to the max value for better visualization
      return Math.ceil(maxValue * 1.2);
    };

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: getMaxValue(),
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
            getFillFromSprite: false,
            labelText: "{name}: {valueY}",
            paddingTop: 6,
            paddingBottom: 6,
            paddingLeft: 8,
            paddingRight: 8,
            position: "relative",
            zIndex: 9999,
            pointerOrientation: "down",
            autoTextColor: false,
            label: am5.Label.new(root, {
              fill: am5.color("#fff"), // white text color
              fontSize: 10,
              fontWeight: "400",
            }),
            background: am5.RoundedRectangle.new(root, {
              fill: am5.color("#000"),       // black bg
              cornerRadius: 50,             // pill-like radius
              strokeOpacity: 0,             // no border
            }),
          })
        })
      );

      series.strokes.template.setAll({
        strokeWidth: strokeWidth,
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

    // Create series based on viewType selection
    const seriesConfig = {
      clicks: { name: "Clicks", field: "clicks", color: "#5B4E96" },
      views: { name: "Views", field: "views", color: "#8A76E3" },
      impressions: { name: "Impressions", field: "impressions", color: "#C8B9FF" }
    };

    const activeSeries = [];

    // If viewType is 'all' or not specified, show all three lines
    if (!viewType || viewType === 'all') {
      activeSeries.push(
        createSeries("Clicks", "clicks", "#5B4E96", 4),
        createSeries("Views", "views", "#8A76E3", 3),
        createSeries("Impressions", "impressions", "#C8B9FF", 2)
      );
    } else {
      // Show only the selected line
      const config = seriesConfig[viewType];
      if (config) {
        activeSeries.push(createSeries(config.name, config.field, config.color, 4));
      }
    }

    // Set data from API
    xAxis.data.setAll(chartData);
    activeSeries.forEach(series => {
      series.data.setAll(chartData);
      series.appear(1000);
    });

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartData, isLoading]);

  // Generate legend items based on viewType
  const getLegendItems = () => {
    const legendConfig = {
      clicks: { color: '#5B4E96', label: 'Clicks' },
      views: { color: '#8A76E3', label: 'Views' },
      impressions: { color: '#C8B9FF', label: 'Impressions' }
    };

    if (!viewType || viewType === 'all') {
      // Show all legend items
      return Object.entries(legendConfig).map(([key, config]) => (
        <div key={key} className="legend-item">
          <span className="legend-color" style={{
            backgroundColor: config.color,
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            display: 'inline-block'
          }}></span>
          <span className="legend-text">{config.label}</span>
        </div>
      ));
    } else {
      // Show only selected legend item
      const config = legendConfig[viewType];
      if (config) {
        return (
          <div className="legend-item">
            <span className="legend-color" style={{
              backgroundColor: config.color,
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              display: 'inline-block'
            }}></span>
            <span className="legend-text">{config.label}</span>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <>
      {/* Dynamic legend based on viewType */}
      <div className="chart-legend-custom" style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: '0',
        padding: '0',
        gap: '20px'
      }}>
        {getLegendItems()}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div style={{
          width: "100%",
          height: "360px",
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
            height: "360px",
            backgroundColor: "#ffffff",
            overflow: "hidden",
            position: "relative"
          }}
        />
      )}

    </>

  );
};

export default SplineChart;
