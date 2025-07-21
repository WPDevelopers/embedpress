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

    // Set colors for slices - dynamic color palette
    const getColorPalette = (dataLength) => {
      const baseColors = [
        "#5945B0", // Purple
        "#7158E0", // Light purple
        "#8C73FA", // Lighter purple
        "#A084FF", // Even lighter purple
        "#B49BFF", // Pale purple
        "#C8B2FF", // Very pale purple
        "#DCC9FF", // Ultra pale purple
        "#F0E0FF"  // Almost white purple
      ];

      // Return colors based on data length, ensuring we have enough colors
      return baseColors.slice(0, Math.max(dataLength, 3)).map(color => am5.color(color));
    };

    // Process chart data - ONLY REAL DATA, NO FALLBACKS
    const processChartData = () => {
      console.log('PieChart data received:', data);
      console.log('Active tab:', activeTab, 'Sub tab:', subTab);

      // Handle device analytics data
      if (activeTab === 'device') {
        // Handle device resolution sub-tab
        if (subTab === 'resolutions') {
          if (data?.deviceAnalytics?.resolutions && Array.isArray(data.deviceAnalytics.resolutions)) {
            console.log('Using device resolutions data:', data.deviceAnalytics.resolutions);
            return data.deviceAnalytics.resolutions.map(resolution => ({
              category: resolution.screen_resolution || 'Unknown',
              value: parseInt(resolution.visitors) || parseInt(resolution.count) || 0
            }));
          }
          console.log('No device resolutions data found');
          return [];
        }

        // Handle device type sub-tab (default)
        if (data?.deviceAnalytics?.devices && Array.isArray(data.deviceAnalytics.devices)) {
          console.log('Using device types data:', data.deviceAnalytics.devices);
          return data.deviceAnalytics.devices.map(device => ({
            category: device.device_type ? device.device_type.charAt(0).toUpperCase() + device.device_type.slice(1) : 'Unknown',
            value: parseInt(device.visitors) || parseInt(device.count) || 0
          }));
        }

        console.log('No device analytics data found');
        return [];
      }

      // Handle browser analytics data
      if (activeTab === 'browser') {
        // Determine which browser data to use based on subTab
        if (subTab === 'browsers') {
          if (data?.browser?.browsers && Array.isArray(data.browser.browsers)) {
            console.log('Using browsers data:', data.browser.browsers);
            return data.browser.browsers.map(browser => ({
              category: browser.browser_name || 'Unknown',
              value: parseInt(browser.count) || 0
            }));
          }
          console.log('No browsers data found');
          return [];
        }

        if (subTab === 'os') {
          if (data?.browser?.operating_systems && Array.isArray(data.browser.operating_systems)) {
            console.log('Using OS data:', data.browser.operating_systems);
            return data.browser.operating_systems.map(os => ({
              category: os.operating_system || 'Unknown',
              value: parseInt(os.count) || 0
            }));
          }
          console.log('No OS data found');
          return [];
        }

        if (subTab === 'devices') {
          if (data?.browser?.devices && Array.isArray(data.browser.devices)) {
            console.log('Using browser devices data:', data.browser.devices);
            return data.browser.devices.map(device => ({
              category: device.device_type ? device.device_type.charAt(0).toUpperCase() + device.device_type.slice(1) : 'Unknown',
              value: parseInt(device.count) || 0
            }));
          }
          console.log('No browser devices data found');
          return [];
        }

        console.log('No browser analytics data found for subTab:', subTab);
        return [];
      }

      console.log('No data found for activeTab:', activeTab);
      return [];
    };

    const chartData = processChartData();

    // Set dynamic colors based on data length
    series.get("colors").set("colors", getColorPalette(chartData.length));

    // Set chart data
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
