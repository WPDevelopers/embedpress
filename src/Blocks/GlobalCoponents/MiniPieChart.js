import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const { useLayoutEffect, useRef, useState, useEffect } = wp.element;

const MiniPieChart = ({ size = 70 }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [totalEmbeds, setTotalEmbeds] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch overview analytics data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch overview data
        const overviewResponse = await fetch('/wp-json/embedpress/v1/analytics/overview?date_range=30', {
          headers: {
            'X-WP-Nonce': embedpressGutenbergData.nonce || wpApiSettings.nonce
          }
        });
        const overviewResult = await overviewResponse.json();

        // Process overview data - views, clicks, impressions
        // Handle both direct response and nested overview structure
        const overview = overviewResult.overview || overviewResult;

        if (overview) {
          const data = [
            { category: 'Views', value: parseInt(overview.total_views) || 0 },
            { category: 'Clicks', value: parseInt(overview.total_clicks) || 0 },
            { category: 'Impr', value: parseInt(overview.total_impressions) || 0 }
          ];
          console.log('Chart data:', data);
          setChartData(data);
          setTotalEmbeds(parseInt(overview.total_embeds) || 0);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useLayoutEffect(() => {
    // Don't render chart if still loading or no data
    if (loading || !chartRef.current) {
      return;
    }

    // Create root element
    const root = am5.Root.new(chartRef.current);

    // Remove amCharts logo
    root._logo.dispose();

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Disable animations for instant render
    root.animationThemesEnabled = false;

    // Allow tooltips to overflow container
    root.container.set("tooltipPosition", "pointer");
    root.container.set("tooltipPositionX", "pointer");
    root.container.set("tooltipPositionY", "pointer");

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(75),
        radius: am5.percent(100),
      })
    );

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
        alignLabels: false,
        sequencedInterpolation: false,
      })
    );

    // Disable slice pull out on click
    series.slices.template.set("toggleKey", "none");

    // Hide labels and ticks
    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    // Tooltip style - small, white background, dark text
    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      labelText: "[#333]{category}: {value}[/]",
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 6,
      paddingRight: 6,
      autoTextColor: false,
      pointerOrientation: "horizontal",
      centerX: am5.p50,
      centerY: am5.p50,
      background: am5.RoundedRectangle.new(root, {
        fill: am5.color("#fff"),       // white background
        cornerRadius: 4,
        strokeOpacity: 1,
        stroke: am5.color("#e0e0e0"),  // light border
        strokeWidth: 1,
        shadowColor: am5.color("#000"),
        shadowBlur: 4,
        shadowOpacity: 0.1,
        shadowOffsetX: 0,
        shadowOffsetY: 2,
      }),
    });

    // Set tooltip label text color explicitly
    tooltip.label.setAll({
      fill: am5.color("#333"),
      fontSize: 10,
      fontWeight: "400",
      oversizedBehavior: "wrap",
      maxWidth: 150,
    });

    // Slice appearance
    series.slices.template.setAll({
      tooltip: tooltip,
      stroke: am5.color('#fff'),
      strokeWidth: 1,
      cornerRadius: 4,
      interactive: true,
      hoverable: true,
    });

    // Remove hover animation
    series.slices.template.states.create("hover", {
      scale: 1,
    });

    // Set colors for views, clicks, impressions
    const colors = ["#5B4E96", "#8C73FA", "#C4B5E8"];
    series.get('colors').set('colors', colors.map(c => am5.color(c)));

    // Use real analytics data or fallback to sample data
    let data = chartData.length > 0 ? chartData : [
      { category: 'Views', value: 1 },
      { category: 'Clicks', value: 1 },
      { category: 'Impr', value: 1 }
    ];

    // If all values are 0, show minimal sample data for visualization
    const hasData = data.some(item => item.value > 0);
    if (!hasData) {
      data = [
        { category: 'Views', value: 1 },
        { category: 'Clicks', value: 1 },
        { category: 'Impr', value: 1 }
      ];
    }

    series.data.setAll(data);

    // Add total embeds number in the center
    // Show 1 instead of 0 to avoid blank display
    const displayEmbeds = totalEmbeds || 1;
    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: displayEmbeds.toLocaleString(),
        centerX: am5.p50,
        centerY: am5.p50,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "700",
        fill: am5.color("#092161"),
        dy: -8,
      })
    );

    // Add "Total Embeds" label below the number
    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: "Total Embeds",
        centerX: am5.p50,
        centerY: am5.p50,
        textAlign: "center",
        fontSize: 7,
        fontWeight: "400",
        fill: am5.color("#666"),
        dy: 6,
      })
    );

    // Cleanup
    return () => root.dispose();
  }, [loading, chartData, totalEmbeds]);

  if (loading) {
    return (
      <div style={{ width: `${size}px`, height: `${size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '10px', color: '#999' }}>Loading...</span>
      </div>
    );
  }

  return (
    <div
      ref={chartRef}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        overflow: 'visible',
        position: 'relative',
        zIndex: 10
      }}
    />
  );
};

export default MiniPieChart;

