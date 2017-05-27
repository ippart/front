import "foundation-sites/dist/js/plugins/foundation.core.min"
import "foundation-sites/dist/js/plugins/foundation.util.nest.min"
import "foundation-sites/dist/js/plugins/foundation.util.motion.min"
import "foundation-sites/dist/js/plugins/foundation.util.mediaQuery.min"
import "foundation-sites/dist/js/plugins/foundation.util.keyboard.min"
import "foundation-sites/dist/js/plugins/foundation.accordionMenu.min"
import "foundation-sites/dist/js/plugins/foundation.orbit.min"
import "foundation-sites/dist/js/plugins/foundation.util.timerAndImageLoader.min"
import "foundation-sites/dist/js/plugins/foundation.util.touch.min"
import "motion-ui/dist/motion-ui.min"
import "foundation-sites/dist/js/plugins/foundation.tabs.min"

$(document).foundation();

$('.sim-thumb').on('click', function() {
    $('#main-product-image').attr('src', $(this).data('image'));
})
