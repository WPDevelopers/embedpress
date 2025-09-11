<?php

namespace EmbedPress\Includes\Classes\Analytics;

/**
 * Export Manager for Analytics Data
 * Handles exporting analytics data in various formats (CSV, Excel, PDF)
 */
class Export_Manager
{
    /**
     * Export analytics data in specified format
     *
     * @param string $format Export format (csv, excel, pdf)
     * @param array $analytics_data General analytics data
     * @param array $content_analytics Detailed content analytics
     * @param array $args Export arguments
     * @return array Export result with success status and file info
     */
    public function export_data($format, $analytics_data, $content_analytics, $args = [])
    {
        try {
            switch ($format) {
                case 'csv':
                    return $this->export_csv($analytics_data, $content_analytics, $args);
                case 'excel':
                    return $this->export_excel($analytics_data, $content_analytics, $args);
                case 'pdf':
                    return $this->export_pdf($analytics_data, $content_analytics, $args);
                default:
                    return [
                        'success' => false,
                        'message' => __('Unsupported export format.', 'embedpress')
                    ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Export data as CSV
     *
     * @param array $analytics_data
     * @param array $content_analytics
     * @param array $args
     * @return array
     */
    private function export_csv($analytics_data, $content_analytics, $args)
    {
        $filename = $this->generate_filename('csv', $args);
        $file_path = $this->get_export_directory() . $filename;

        // Create CSV content
        $csv_content = $this->generate_csv_content($analytics_data, $content_analytics, $args);

        // Write to file
        if (file_put_contents($file_path, $csv_content) === false) {
            return [
                'success' => false,
                'message' => __('Failed to create CSV file.', 'embedpress')
            ];
        }

        return [
            'success' => true,
            'filename' => $filename,
            'download_url' => $this->get_download_url($filename),
            'file_path' => $file_path
        ];
    }

    /**
     * Export data as Excel
     *
     * @param array $analytics_data
     * @param array $content_analytics
     * @param array $args
     * @return array
     */
    private function export_excel($analytics_data, $content_analytics, $args)
    {
        $filename = $this->generate_filename('xlsx', $args);
        $file_path = $this->get_export_directory() . $filename;

        // For now, create Excel as CSV with .xlsx extension
        // In a full implementation, you'd use a library like PhpSpreadsheet
        $csv_content = $this->generate_csv_content($analytics_data, $content_analytics, $args);

        if (file_put_contents($file_path, $csv_content) === false) {
            return [
                'success' => false,
                'message' => __('Failed to create Excel file.', 'embedpress')
            ];
        }

        return [
            'success' => true,
            'filename' => $filename,
            'download_url' => $this->get_download_url($filename),
            'file_path' => $file_path
        ];
    }

    /**
     * Export data as PDF (Frontend generation)
     * Returns HTML content for frontend PDF generation
     *
     * @param array $analytics_data
     * @param array $content_analytics
     * @param array $args
     * @return array
     */
    private function export_pdf($analytics_data, $content_analytics, $args)
    {
        try {
            // Generate HTML content for frontend PDF generation
            $html_content = $this->generate_html_report($analytics_data, $content_analytics, $args);

            return [
                'success' => true,
                'frontend_export' => true,
                'export_type' => 'pdf',
                'html_content' => $html_content,
                'filename' => $this->generate_filename('pdf', $args)
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => __('Failed to generate PDF HTML. Please try again.', 'embedpress')
            ];
        }
    }

    /**
     * Prepare structured data for frontend PDF generation
     *
     * @param array $analytics_data
     * @param array $content_analytics
     * @param array $args
     * @return array
     */
    private function prepare_pdf_data($analytics_data, $content_analytics, $args)
    {
        $date_range = $args['date_range'] ?? 30;
        $start_date = $args['start_date'] ?? null;
        $end_date = $args['end_date'] ?? null;

        // Prepare structured data for frontend PDF generation
        return [
            'report_info' => [
                'title' => 'EmbedPress Analytics Report',
                'generated_date' => current_time('Y-m-d H:i:s'),
                'date_range' => $date_range,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'period_text' => $this->get_period_text($date_range, $start_date, $end_date)
            ],
            'overview' => [
                'total_views' => $analytics_data['total_views'] ?? 0,
                'total_impressions' => $analytics_data['total_impressions'] ?? 0,
                'total_clicks' => $analytics_data['total_clicks'] ?? 0,
                'unique_viewers' => $analytics_data['unique_viewers'] ?? 0,
                'avg_engagement_time' => $analytics_data['avg_engagement_time'] ?? 0,
                'bounce_rate' => $analytics_data['bounce_rate'] ?? 0
            ],
            'content_analytics' => $this->format_content_analytics($content_analytics),
            'charts_data' => [
                'views_over_time' => $analytics_data['views_chart'] ?? [],
                'top_content' => array_slice($content_analytics, 0, 10),
                'browser_stats' => $analytics_data['browser_stats'] ?? [],
                'device_stats' => $analytics_data['device_stats'] ?? [],
                'geo_stats' => $analytics_data['geo_stats'] ?? []
            ]
        ];
    }

    /**
     * Format content analytics for PDF export
     *
     * @param array $content_analytics
     * @return array
     */
    private function format_content_analytics($content_analytics)
    {
        $formatted = [];

        foreach ($content_analytics as $content) {
            $formatted[] = [
                'title' => $content['title'] ?? 'Untitled',
                'type' => $content['embed_type'] ?? 'Unknown',
                'views' => $content['views'] ?? 0,
                'impressions' => $content['impressions'] ?? 0,
                'clicks' => $content['clicks'] ?? 0,
                'engagement_rate' => $content['engagement_rate'] ?? 0,
                'url' => $content['url'] ?? ''
            ];
        }

        return $formatted;
    }

    /**
     * Get human readable period text
     *
     * @param int $date_range
     * @param string $start_date
     * @param string $end_date
     * @return string
     */
    private function get_period_text($date_range, $start_date, $end_date)
    {
        if ($start_date && $end_date) {
            return sprintf('%s to %s',
                date('M j, Y', strtotime($start_date)),
                date('M j, Y', strtotime($end_date))
            );
        }

        return sprintf('Last %d days', $date_range);
    }

    /**
     * Generate CSV content
     *
     * @param array $analytics_data
     * @param array $content_analytics
     * @param array $args
     * @return string
     */
    private function generate_csv_content($analytics_data, $content_analytics, $args)
    {
        $csv_lines = [];

        // Add header
        $csv_lines[] = '"EmbedPress Analytics Export"';
        $csv_lines[] = '"Generated on: ' . date('Y-m-d H:i:s') . '"';
        $csv_lines[] = '"Date Range: ' . ($args['date_range'] ?? 30) . ' days"';
        $csv_lines[] = '';

        // Overview section
        $csv_lines[] = '"OVERVIEW METRICS"';
        $csv_lines[] = '"Metric","Value"';
        $csv_lines[] = sprintf('"Total Views","%s"', $analytics_data['views_analytics']['total_views'] ?? 0);
        $csv_lines[] = sprintf('"Total Clicks","%s"', $analytics_data['total_clicks'] ?? 0);
        $csv_lines[] = sprintf('"Total Impressions","%s"', $analytics_data['total_impressions'] ?? 0);
        $csv_lines[] = sprintf('"Unique Viewers","%s"', $analytics_data['total_unique_viewers'] ?? 0);
        $csv_lines[] = '';

        // Content by type section
        if (!empty($analytics_data['content_by_type'])) {
            $csv_lines[] = '"CONTENT BY TYPE"';
            $csv_lines[] = '"Content Type","Count"';
            foreach ($analytics_data['content_by_type'] as $type => $count) {
                $csv_lines[] = sprintf('"%s","%s"', ucfirst($type), $count);
            }
            $csv_lines[] = '';
        }

        // Daily views section
        if (!empty($analytics_data['views_analytics']['daily_views'])) {
            $csv_lines[] = '"DAILY VIEWS"';
            $csv_lines[] = '"Date","Views","Clicks","Impressions"';
            foreach ($analytics_data['views_analytics']['daily_views'] as $daily) {
                $csv_lines[] = sprintf(
                    '"%s","%s","%s","%s"',
                    $daily['date'] ?? '',
                    $daily['views'] ?? 0,
                    $daily['clicks'] ?? 0,
                    $daily['impressions'] ?? 0
                );
            }
            $csv_lines[] = '';
        }

        // Device analytics section
        if (!empty($analytics_data['device_analytics'])) {
            $csv_lines[] = '"DEVICE ANALYTICS"';
            $csv_lines[] = '"Device Type","Count"';
            foreach ($analytics_data['device_analytics']['devices'] ?? [] as $device) {
                $csv_lines[] = sprintf('"%s","%s"', $device['device_type'] ?? '', $device['count'] ?? 0);
            }
            $csv_lines[] = '';

            if (!empty($analytics_data['device_analytics']['browsers'])) {
                $csv_lines[] = '"BROWSER ANALYTICS"';
                $csv_lines[] = '"Browser","Count"';
                foreach ($analytics_data['device_analytics']['browsers'] as $browser) {
                    $csv_lines[] = sprintf('"%s","%s"', $browser['browser'] ?? '', $browser['count'] ?? 0);
                }
                $csv_lines[] = '';
            }
        }

        // Geo analytics section (Pro feature)
        if (!empty($analytics_data['geo_analytics'])) {
            $csv_lines[] = '"GEO ANALYTICS"';
            $csv_lines[] = '"Country","City","Count"';
            foreach ($analytics_data['geo_analytics'] as $geo) {
                $csv_lines[] = sprintf(
                    '"%s","%s","%s"',
                    $geo['country'] ?? '',
                    $geo['city'] ?? '',
                    $geo['count'] ?? 0
                );
            }
            $csv_lines[] = '';
        }

        // Referral analytics section (Pro feature)
        if (!empty($analytics_data['referral_analytics'])) {
            $csv_lines[] = '"REFERRAL ANALYTICS"';
            $csv_lines[] = '"Referrer","Count"';
            foreach ($analytics_data['referral_analytics'] as $referral) {
                $csv_lines[] = sprintf('"%s","%s"', $referral['referrer'] ?? '', $referral['count'] ?? 0);
            }
            $csv_lines[] = '';
        }

        // Content analytics section
        if (!empty($content_analytics)) {
            $csv_lines[] = '"DETAILED CONTENT ANALYTICS"';
            $csv_lines[] = '"Page Title","Content ID","Source","Views","Clicks","Impressions","Page URL","Created Date"';

            foreach ($content_analytics as $content) {
                $csv_lines[] = sprintf(
                    '"%s","%s","%s","%s","%s","%s","%s","%s"',
                    str_replace('"', '""', $content['title'] ?? ''),
                    $content['content_id'] ?? '',
                    $content['embed_type'] ?? '',
                    $content['total_views'] ?? 0,
                    $content['total_clicks'] ?? 0,
                    $content['total_impressions'] ?? 0,
                    str_replace('"', '""', $content['page_url'] ?? ''),
                    $content['created_at'] ?? ''
                );
            }
        }

        return implode("\r\n", $csv_lines);
    }

    /**
     * Generate HTML report content
     *
     * @param array $analytics_data
     * @param array $content_analytics
     * @param array $args
     * @return string
     */
    private function generate_html_report($analytics_data, $content_analytics, $args)
    {
        $html = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EmbedPress Analytics Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #5b4e96; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #5b4e96; margin: 0; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #5b4e96; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .metric-card { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #5b4e96; }
        .metric-label { font-size: 14px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #5b4e96; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>EmbedPress Analytics Report</h1>
        <p>Generated on: ' . date('F j, Y \a\t g:i A') . '</p>
        <p>Date Range: ' . ($args['date_range'] ?? 30) . ' days</p>
    </div>';

        // Overview metrics
        $html .= '<div class="section">
        <h2>Overview Metrics</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">' . number_format($analytics_data['views_analytics']['total_views'] ?? 0) . '</div>
                <div class="metric-label">Total Views</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">' . number_format($analytics_data['total_clicks'] ?? 0) . '</div>
                <div class="metric-label">Total Clicks</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">' . number_format($analytics_data['total_impressions'] ?? 0) . '</div>
                <div class="metric-label">Total Impressions</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">' . number_format($analytics_data['total_unique_viewers'] ?? 0) . '</div>
                <div class="metric-label">Unique Viewers</div>
            </div>
        </div>
    </div>';

        // Content by type
        if (!empty($analytics_data['content_by_type'])) {
            $html .= '<div class="section">
            <h2>Content by Type</h2>
            <table>
                <thead>
                    <tr><th>Content Type</th><th>Count</th></tr>
                </thead>
                <tbody>';
            foreach ($analytics_data['content_by_type'] as $type => $count) {
                $html .= '<tr><td>' . ucfirst($type) . '</td><td>' . number_format($count) . '</td></tr>';
            }
            $html .= '</tbody></table></div>';
        }

        // Content analytics
        if (!empty($content_analytics)) {
            $html .= '<div class="section">
            <h2>Top Content Analytics</h2>
            <table>
                <thead>
                    <tr><th>Title</th><th>Source</th><th>Views</th><th>Clicks</th><th>Impressions</th></tr>
                </thead>
                <tbody>';
            $count = 0;
            foreach ($content_analytics as $item) {
                if ($count >= 20) break;
                $html .= '<tr>
                    <td>' . htmlspecialchars($item['title'] ?? $item['content_id'] ?? 'N/A') . '</td>
                    <td>' . htmlspecialchars($item['embed_type'] ?? 'N/A') . '</td>
                    <td>' . number_format($item['total_views'] ?? 0) . '</td>
                    <td>' . number_format($item['total_clicks'] ?? 0) . '</td>
                    <td>' . number_format($item['total_impressions'] ?? 0) . '</td>
                </tr>';
                $count++;
            }
            $html .= '</tbody></table></div>';
        }

        $html .= '<div class="footer">
        <p>Report generated by EmbedPress</p>
        <p>For more detailed analytics, visit your WordPress admin dashboard.</p>
    </div>
</body>
</html>';

        return $html;
    }

    /**
     * Generate text report content (legacy)
     *
     * @param array $analytics_data
     * @param array $content_analytics
     * @param array $args
     * @return string
     */
    private function generate_text_report($analytics_data, $content_analytics, $args)
    {
        $content = "EmbedPress Analytics Report\n";
        $content .= "===========================\n\n";
        $content .= "Generated on: " . date('Y-m-d H:i:s') . "\n";
        $content .= "Date Range: " . ($args['date_range'] ?? 30) . " days\n\n";

        // Overview section
        $content .= "OVERVIEW METRICS\n";
        $content .= "================\n";
        $content .= "Total Views: " . number_format($analytics_data['views_analytics']['total_views'] ?? 0) . "\n";
        $content .= "Total Clicks: " . number_format($analytics_data['total_clicks'] ?? 0) . "\n";
        $content .= "Total Impressions: " . number_format($analytics_data['total_impressions'] ?? 0) . "\n";
        $content .= "Unique Viewers: " . number_format($analytics_data['total_unique_viewers'] ?? 0) . "\n\n";

        // Content by type
        if (!empty($analytics_data['content_by_type'])) {
            $content .= "CONTENT BY TYPE\n";
            $content .= "===============\n";
            foreach ($analytics_data['content_by_type'] as $type => $count) {
                $content .= ucfirst($type) . ": " . number_format($count) . "\n";
            }
            $content .= "\n";
        }

        // Device analytics
        if (!empty($analytics_data['device_analytics']['devices'])) {
            $content .= "DEVICE ANALYTICS\n";
            $content .= "================\n";
            foreach ($analytics_data['device_analytics']['devices'] as $device) {
                $content .= ($device['device_type'] ?? 'Unknown') . ": " . number_format($device['count'] ?? 0) . "\n";
            }
            $content .= "\n";
        }

        // Content analytics (limited for readability)
        if (!empty($content_analytics)) {
            $content .= "TOP CONTENT ANALYTICS\n";
            $content .= "=====================\n";
            $count = 0;
            foreach ($content_analytics as $item) {
                if ($count >= 20) break; // Limit for readability
                $content .= "Title: " . ($item['title'] ?? $item['content_id'] ?? 'N/A') . "\n";
                $content .= "Source: " . ($item['embed_type'] ?? 'N/A') . "\n";
                $content .= "Views: " . number_format($item['total_views'] ?? 0) . "\n";
                $content .= "Clicks: " . number_format($item['total_clicks'] ?? 0) . "\n";
                $content .= "Impressions: " . number_format($item['total_impressions'] ?? 0) . "\n";
                $content .= "----------------------------------------\n";
                $count++;
            }
        }

        $content .= "\nReport generated by EmbedPress Analytics\n";
        $content .= "For more detailed analytics, visit your WordPress admin dashboard.\n";

        return $content;
    }

    /**
     * Generate simple PDF content (legacy)
     *
     * @param array $analytics_data
     * @param array $content_analytics
     * @param array $args
     * @return string
     */
    private function generate_simple_pdf($analytics_data, $content_analytics, $args)
    {
        // Create a basic PDF structure
        $pdf_content = "%PDF-1.4\n";
        $pdf_content .= "1 0 obj\n";
        $pdf_content .= "<<\n";
        $pdf_content .= "/Type /Catalog\n";
        $pdf_content .= "/Pages 2 0 R\n";
        $pdf_content .= ">>\n";
        $pdf_content .= "endobj\n\n";

        $pdf_content .= "2 0 obj\n";
        $pdf_content .= "<<\n";
        $pdf_content .= "/Type /Pages\n";
        $pdf_content .= "/Kids [3 0 R]\n";
        $pdf_content .= "/Count 1\n";
        $pdf_content .= ">>\n";
        $pdf_content .= "endobj\n\n";

        // Create content text
        $text_content = "EmbedPress Analytics Report\\n";
        $text_content .= "Generated on: " . date('Y-m-d H:i:s') . "\\n";
        $text_content .= "Date Range: " . ($args['date_range'] ?? 30) . " days\\n\\n";

        // Overview section
        $text_content .= "OVERVIEW METRICS\\n";
        $text_content .= "================\\n";
        $text_content .= "Total Views: " . ($analytics_data['views_analytics']['total_views'] ?? 0) . "\\n";
        $text_content .= "Total Clicks: " . ($analytics_data['total_clicks'] ?? 0) . "\\n";
        $text_content .= "Total Impressions: " . ($analytics_data['total_impressions'] ?? 0) . "\\n";
        $text_content .= "Unique Viewers: " . ($analytics_data['total_unique_viewers'] ?? 0) . "\\n\\n";

        // Content by type
        if (!empty($analytics_data['content_by_type'])) {
            $text_content .= "CONTENT BY TYPE\\n";
            $text_content .= "===============\\n";
            foreach ($analytics_data['content_by_type'] as $type => $count) {
                $text_content .= ucfirst($type) . ": " . $count . "\\n";
            }
            $text_content .= "\\n";
        }

        // Content analytics
        if (!empty($content_analytics)) {
            $text_content .= "DETAILED CONTENT ANALYTICS\\n";
            $text_content .= "==========================\\n";
            $count = 0;
            foreach ($content_analytics as $item) {
                if ($count >= 10) break; // Limit for PDF
                $text_content .= "Title: " . ($item['title'] ?? $item['content_id'] ?? 'N/A') . "\\n";
                $text_content .= "Source: " . ($item['embed_type'] ?? 'N/A') . "\\n";
                $text_content .= "Views: " . ($item['total_views'] ?? 0) . "\\n";
                $text_content .= "---\\n";
                $count++;
            }
        }

        $content_length = strlen($text_content);

        $pdf_content .= "3 0 obj\n";
        $pdf_content .= "<<\n";
        $pdf_content .= "/Type /Page\n";
        $pdf_content .= "/Parent 2 0 R\n";
        $pdf_content .= "/MediaBox [0 0 612 792]\n";
        $pdf_content .= "/Contents 4 0 R\n";
        $pdf_content .= "/Resources <<\n";
        $pdf_content .= "/Font <<\n";
        $pdf_content .= "/F1 <<\n";
        $pdf_content .= "/Type /Font\n";
        $pdf_content .= "/Subtype /Type1\n";
        $pdf_content .= "/BaseFont /Helvetica\n";
        $pdf_content .= ">>\n";
        $pdf_content .= ">>\n";
        $pdf_content .= ">>\n";
        $pdf_content .= ">>\n";
        $pdf_content .= "endobj\n\n";

        $pdf_content .= "4 0 obj\n";
        $pdf_content .= "<<\n";
        $pdf_content .= "/Length " . ($content_length + 50) . "\n";
        $pdf_content .= ">>\n";
        $pdf_content .= "stream\n";
        $pdf_content .= "BT\n";
        $pdf_content .= "/F1 12 Tf\n";
        $pdf_content .= "50 750 Td\n";
        $pdf_content .= "(" . $text_content . ") Tj\n";
        $pdf_content .= "ET\n";
        $pdf_content .= "endstream\n";
        $pdf_content .= "endobj\n\n";

        $pdf_content .= "xref\n";
        $pdf_content .= "0 5\n";
        $pdf_content .= "0000000000 65535 f \n";
        $pdf_content .= "0000000009 00000 n \n";
        $pdf_content .= "0000000074 00000 n \n";
        $pdf_content .= "0000000131 00000 n \n";
        $pdf_content .= "0000000380 00000 n \n";
        $pdf_content .= "trailer\n";
        $pdf_content .= "<<\n";
        $pdf_content .= "/Size 5\n";
        $pdf_content .= "/Root 1 0 R\n";
        $pdf_content .= ">>\n";
        $pdf_content .= "startxref\n";
        $pdf_content .= "500\n";
        $pdf_content .= "%%EOF\n";

        return $pdf_content;
    }

    /**
     * Generate PDF HTML content (legacy method)
     *
     * @param array $analytics_data
     * @param array $content_analytics
     * @param array $args
     * @return string
     */
    private function generate_pdf_html($analytics_data, $content_analytics, $args)
    {
        $html = '<!DOCTYPE html><html><head>';
        $html .= '<title>EmbedPress Analytics Report</title>';
        $html .= '<style>body{font-family:Arial,sans-serif;margin:20px;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#f2f2f2;}</style>';
        $html .= '</head><body>';
        
        $html .= '<h1>EmbedPress Analytics Report</h1>';
        $html .= '<p>Generated on: ' . date('Y-m-d H:i:s') . '</p>';
        $html .= '<p>Date Range: ' . ($args['date_range'] ?? 30) . ' days</p>';

        // Overview section
        $html .= '<h2>Overview</h2>';
        $html .= '<table>';
        $html .= '<tr><th>Metric</th><th>Value</th></tr>';
        $html .= '<tr><td>Total Views</td><td>' . ($analytics_data['views_analytics']['total_views'] ?? 0) . '</td></tr>';
        $html .= '<tr><td>Total Clicks</td><td>' . ($analytics_data['total_clicks'] ?? 0) . '</td></tr>';
        $html .= '<tr><td>Total Impressions</td><td>' . ($analytics_data['total_impressions'] ?? 0) . '</td></tr>';
        $html .= '<tr><td>Unique Viewers</td><td>' . ($analytics_data['total_unique_viewers'] ?? 0) . '</td></tr>';
        $html .= '</table>';

        // Content analytics section
        if (!empty($content_analytics)) {
            $html .= '<h2>Content Analytics</h2>';
            $html .= '<table>';
            $html .= '<tr><th>Page Title</th><th>Source</th><th>Views</th><th>Clicks</th><th>Impressions</th></tr>';
            
            foreach ($content_analytics as $content) {
                $html .= '<tr>';
                $html .= '<td>' . htmlspecialchars($content['title'] ?? $content['content_id'] ?? '') . '</td>';
                $html .= '<td>' . htmlspecialchars($content['embed_type'] ?? '') . '</td>';
                $html .= '<td>' . ($content['total_views'] ?? 0) . '</td>';
                $html .= '<td>' . ($content['total_clicks'] ?? 0) . '</td>';
                $html .= '<td>' . ($content['total_impressions'] ?? 0) . '</td>';
                $html .= '</tr>';
            }
            $html .= '</table>';
        }

        $html .= '</body></html>';
        return $html;
    }

    /**
     * Generate filename for export
     *
     * @param string $extension
     * @param array $args
     * @return string
     */
    private function generate_filename($extension, $args)
    {
        $date = date('Y-m-d');
        $time = date('H-i-s');
        return "embedpress-analytics-{$date}-{$time}.{$extension}";
    }

    /**
     * Get export directory path
     *
     * @return string
     */
    private function get_export_directory()
    {
        $upload_dir = wp_upload_dir();
        $export_dir = $upload_dir['basedir'] . '/embedpress-exports/';
        
        if (!file_exists($export_dir)) {
            wp_mkdir_p($export_dir);
        }
        
        return $export_dir;
    }

    /**
     * Get download URL for exported file
     *
     * @param string $filename
     * @return string
     */
    private function get_download_url($filename)
    {
        $upload_dir = wp_upload_dir();
        return $upload_dir['baseurl'] . '/embedpress-exports/' . $filename;
    }
}
