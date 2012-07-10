function changerTaille(modif) {
	jQuery('p,h1,h2,h3,h4,h5,td,li a', '#story_wrapper').each(
			function() {
				var oldf = parseInt(jQuery(this).css('font-size'));
				var oldl = parseInt(jQuery(this).css('line-height'));
				switch (modif) {
				case 0.1:
					jQuery(this).css( {
						'font-size' : oldf + 2 + 'px',
						'line-height' : oldl + 2 + 'px'
					});
					break;
				case -0.1:
					jQuery(this).css( {
						'font-size' : oldf - 2 + 'px',
						'line-height' : oldl - 2 + 'px'
					});
					break;
				}
				;
			});
}
