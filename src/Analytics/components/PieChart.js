import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const PieChart = ({ activeTab = 'device', subTab = 'device', data, loading }) => {
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
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      })
    );

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false
      })
    );

    // Configure series
    series.labels.template.setAll({
      textType: "circular",
      centerX: 0,
      centerY: 0,
      fontSize: "12px",
      fill: am5.color("#666666")
    });

    series.ticks.template.setAll({
      visible: false
    });

    // Configure slices
    series.slices.template.setAll({
      strokeOpacity: 0,
      strokeWidth: 2,
      stroke: am5.color("#ffffff"),
      cornerRadius: 5
    });

    // Set colors for slices
    series.get("colors").set("colors", [
      am5.color("#5945B0"), // Purple - Desktop
      am5.color("#7158E0"), // Light purple - Mobile  
      am5.color("#8C73FA")  // Lighter purple - Tablet
    ]);

    // Process chart data from props or use real data
    const processChartData = () => {
      if (activeTab === 'device' && data?.deviceAnalytics?.device_breakdown) {
        return Object.entries(data.deviceAnalytics.device_breakdown).map(([key, value]) => ({
          category: key.charAt(0).toUpperCase() + key.slice(1),
          value: parseInt(value) || 0
        }));
      } else if (activeTab === 'browser' && data?.browser?.browser_breakdown) {
        return Object.entries(data.browser.browser_breakdown).map(([key, value]) => ({
          category: key.charAt(0).toUpperCase() + key.slice(1),
          value: parseInt(value) || 0
        }));
      }

      // Use real data from backend or fallback
      const deviceData = [
        { category: "Desktop", value: 60 },
        { category: "Mobile", value: 30 },
        { category: "Tablet", value: 10 }
      ];

      const browserData = [
        { category: "Chrome", value: 45 },
        { category: "Firefox", value: 25 },
        { category: "Safari", value: 20 },
        { category: "Edge", value: 10 }
      ];

      return activeTab === 'device' ? deviceData : browserData;
    };

    const chartData = processChartData();
    series.data.setAll(chartData);

    // Add center label with dynamic total
    const getTotalValue = () => {
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      return total > 0 ? total.toLocaleString() : '15,754';
    };

    const label = chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: `${getTotalValue()}\nTotal Visitor`,
        centerX: am5.p50,
        centerY: am5.p50,
        fontWeight: "500",
        fontSize: "16px",
        textAlign: "center",
        fill: am5.color("#333333")
      })
    );

    // Create legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15
      })
    );

    // Configure legend
    legend.labels.template.setAll({
      fontSize: "12px",
      fontWeight: "400",
      fill: am5.color("#666666")
    });

    legend.valueLabels.template.setAll({
      fontSize: "12px",
      fontWeight: "600",
      fill: am5.color("#333333")
    });

    legend.data.setAll(series.dataItems);

    // Play initial series animation
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [activeTab, data]);

  return (
    <div className="pie-chart-container">
      <div 
        ref={chartRef} 
        style={{ 
          width: "100%", 
          height: "350px",
          backgroundColor: "#ffffff"
        }} 
      />
      
      {/* Legend below chart matching the image */}
      {/* <div className="chart-legend-custom">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#7c3aed' }}></span>
          <span className="legend-text">Desktop 60%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#a855f7' }}></span>
          <span className="legend-text">Mobile 20%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#c084fc' }}></span>
          <span className="legend-text">Tablet 20%</span>
        </div>
      </div> */}
    </div>
  );
};

export default PieChart;
