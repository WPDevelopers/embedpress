import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const PieChart = ({ activeTab = 'device', subTab = 'device', data }) => {
  const chartRef = useRef(null);

  // Check if pro is active
  const isProActive = window.embedpressAnalyticsData?.isProActive || false;

  // Dummy data for when pro is not active
  const dummyData = {
    deviceAnalytics: {
      device: [
        { device: 'Desktop', count: 1234 },
        { device: 'Mobile', count: 987 },
        { device: 'Tablet', count: 456 }
      ],
      resolutions: [
        { resolution: '1920x1080', count: 567 },
        { resolution: '1366x768', count: 432 },
        { resolution: '375x667', count: 321 }
      ]
    },
    browserAnalytics: {
      browsers: [
        { browser: 'Chrome', count: 1456 },
        { browser: 'Firefox', count: 567 },
        { browser: 'Safari', count: 234 }
      ],
      os: [
        { os: 'Windows', count: 1234 },
        { os: 'macOS', count: 567 },
        { os: 'Linux', count: 123 }
      ],
      devices: [
        { device: 'Desktop', count: 1234 },
        { device: 'Mobile', count: 987 },
        { device: 'Tablet', count: 456 }
      ]
    }
  };

  const getChartData = () => {
    // Use dummy data when pro is not active
    const sourceData = isProActive ? data : dummyData;

    if (activeTab === 'device') {
      if (subTab === 'resolutions') {
        if (!isProActive) {
          return sourceData.deviceAnalytics.resolutions.map(r => ({
            category: r.resolution,
            value: r.count,
          }));
        }
        return (sourceData?.deviceAnalytics?.resolutions || []).map(r => ({
          category: r.screen_resolution || 'Unknown',
          value: parseInt(r.count) || parseInt(r.visitors) || 0,
        }));
      }
      if (!isProActive) {
        return sourceData.deviceAnalytics.device.map(d => ({
          category: d.device,
          value: d.count,
        }));
      }
      return (sourceData?.deviceAnalytics?.devices || []).map(d => ({
        category: d.device_type?.charAt(0).toUpperCase() + d.device_type?.slice(1),
        value: parseInt(d.count) || parseInt(d.visitors) || 0,
      }));
    }

    if (activeTab === 'browser') {
      if (subTab === 'browsers') {
        if (!isProActive) {
          return sourceData.browserAnalytics.browsers.map(b => ({
            category: b.browser,
            value: b.count,
          }));
        }
        return (sourceData?.browser?.browsers || []).map(b => ({
          category: b.browser_name || 'Unknown',
          value: parseInt(b.count) || 0,
        }));
      }
      if (subTab === 'os') {
        if (!isProActive) {
          return sourceData.browserAnalytics.os.map(os => ({
            category: os.os,
            value: os.count,
          }));
        }
        return (sourceData?.browser?.operating_systems || []).map(os => ({
          category: os.operating_system || 'Unknown',
          value: parseInt(os.count) || 0,
        }));
      }
      if (subTab === 'devices') {
        if (!isProActive) {
          return sourceData.browserAnalytics.devices.map(d => ({
            category: d.device,
            value: d.count,
          }));
        }
        return (sourceData?.browser?.devices || []).map(d => ({
          category: d.device_type?.charAt(0).toUpperCase() + d.device_type?.slice(1),
          value: parseInt(d.count) || 0,
        }));
      }
    }

    return [];
  };

  const chartData = getChartData();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  useLayoutEffect(() => {
    const root = am5.Root.new(chartRef.current);
    root._logo.dispose();

    // Disable all animations
    root.setThemes([am5themes_Animated.new(root)]);
    root.animationThemesEnabled = false;

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(75),
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
        alignLabels: false,
        sequencedInterpolation: false, // disable loading animation
      })
    );

    // Disable animation entirely
    series.set("startAngle", 0);
    series.set("endAngle", 360);

    // Disable labels & ticks
    series.labels.template.setAll({ visible: false });
    series.ticks.template.setAll({ visible: false });
    series.slices.template.set("toggleKey", "none");


    // Tooltip style
    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      labelText: "{category}: {value} ({value.percent.formatNumber('#.0')}%)",
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 8,
      paddingRight: 8,
      position: "relative",
      zIndex: 9999,
      pointerOrientation: "right",
      dx: 0,
      dy: 0,
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
    });

    // Slice appearance (no interaction or hover)
    series.slices.template.setAll({
      tooltip: tooltip,
      interactive: false,
      hoverable: false,
      stroke: am5.color('#fff'),
      strokeWidth: 2,
      cornerRadius: 10,
    });

    // Explicitly remove hover state
    // series.slices.template.states.create("hover", {});
    series.slices.template.states.create("hover", {
      scale: 1,
    });

    // Dynamic color mapping
    const colors = [
      "#5945B0",
      "#7158E0",
      "#8C73FA",
      "#A084FF",
      "#B49BFF",
      "#C8B2FF",
      "#DCC9FF",
      "#F0E0FF",
    ];
    series.get('colors').set('colors', colors.slice(0, chartData.length).map(c => am5.color(c)));

    // Dynamic data set
    series.data.setAll(chartData);

    // Inner icon + total label (unchanged)
    const iconSize = 32;
    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        html: `
          <div id="center-content" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #f0f3f7;
            border-radius: 50%;
            padding: 16px;
            width: 160px;
            height: 160px;
            position: relative;
            z-index: 1;
            opacity: 0;
            transition: opacity 0.4s ease;
          ">
            <div style="
              width: ${iconSize}px; 
              height: ${iconSize}px; 
              background-color: #f0eaff; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              margin-bottom: 8px;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="#5945B0" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
              </svg>
            </div>
            <div style="font-weight: 600; font-size: 20px; color: #1F2148;">${total.toLocaleString()}</div>
            <div style="font-size: 13px; color: #888;">Unique Visitor</div>
          </div>
        `,
        centerX: am5.p50,
        centerY: am5.p50,
        htmlEnabled: true,
      })
    );

    setTimeout(() => {
      const el = chartRef.current?.querySelector("#center-content");
      if (el) {
        el.style.opacity = "1";
      }
    }, 800);


    // ❌ No appear animation
    return () => root.dispose();
  }, [activeTab, subTab, data]);


  const getColor = (index) => {
    const fallbackColors = [
      "#5945B0",
      "#7158E0",
      "#8C73FA",
      "#A084FF",
      "#B49BFF",
      "#C8B2FF",
      "#DCC9FF",
      "#F0E0FF",
    ];
    return fallbackColors[index % fallbackColors.length];
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '320px' }}
      />
      {/* Dynamic Legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '15px',
          flexWrap: 'wrap',
        }}
      >
        {chartData.map((item, index) => {
          const percent = total ? ((item.value / total) * 100).toFixed(0) : 0;
          return (
            <div
              key={item.category}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <svg width="16" height="16">
                <circle cx="8" cy="8" r="8" fill={getColor(index)} />
              </svg>
              <span style={{ fontWeight: 500, color: '#444' }}>
                {item.category} {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChart;
