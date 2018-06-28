jQuery.fn.inputHints = function() {
	"use strict";

    jQuery(this).each(function(i) {
        jQuery(this).val(jQuery(this).attr('title'));
    });
    jQuery(this).focus(function() {
        if (jQuery(this).val() == jQuery(this).attr('title'))
            jQuery(this).val('');
    }).blur(function() {
        if (jQuery(this).val() == '')
            jQuery(this).val(jQuery(this).attr('title'));
    });
};


jQuery(document).ready(function() {
    "use strict";
	  if (1==1){
		  console.log("==========================================input.fields.js");
		  return ;
	  }
    jQuery('input[title], textarea[title]').inputHints();
});