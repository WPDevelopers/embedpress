(function ($) {
    if ($('.embedpress-document-embed').length > 0) {
        $('.embedpress-document-embed').each((index, element) => {
            $toolbar = $(element).data('toolbar');
            $toolbarPosition = $(element).data('toolbar-position');
            $presentationMode = $(element).data('presentation-mode');
            $download = $(element).data('download');
            $copy = $(element).data('copy');
            $rotate = $(element).data('rotate');
            $details = $(element).data('details');
            
        });
    }
}(jQuery));