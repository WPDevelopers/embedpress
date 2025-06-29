/**
 * Example configuration for EmbedPress PDF block
 * This provides a sample PDF for the block preview
 */

const example = {
    attributes: {
        href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'Sample PDF Document',
        mime: 'application/pdf',
        width: 600,
        height: 600,
        unitoption: '%',
        viewerStyle: 'modern',
        themeMode: 'default',
        toolbar: true,
        presentation: true,
        download: true,
        copy_text: true,
        powered_by: true
    }
};

export default example;
