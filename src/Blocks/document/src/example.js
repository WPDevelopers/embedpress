/**
 * Example configuration for EmbedPress Document block
 * This provides a sample document for the block preview
 */

const example = {
    attributes: {
        href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'Sample Document',
        mime: 'application/pdf',
        width: 600,
        height: 600,
        unitoption: '%',
        docViewer: 'custom',
        themeMode: 'default',
        toolbar: true,
        presentation: true,
        download: true,
        copy_text: true,
        draw: true,
        powered_by: true,
        viewerStyle: 'modern',
        position: 'top',
        doc_rotation: true,
        add_text: true,
        add_image: true,
        doc_details: true
    }
};

export default example;
