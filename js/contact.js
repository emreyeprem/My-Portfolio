jQuery(document).ready(function(){

	$('#contact-form').submit(function(){
		var action = $(this).attr('action');

		$('#contact-form-submit-btn').attr('disabled','disabled').css('opacity', .5);

		$.post(action, {
				name: $('#contact-form-name').val(),
				email: $('#contact-form-email').val(),
				title: $('#contact-form-title').val(),
				content: $('#contact-form-content').val(),
			},
			function(data){
				$('#message').html(data);
				$('#contact-form-submit-btn').removeAttr('disabled').css('opacity', 1);
				if(data.match('Thank you') !== null) $('#contact-form').slideUp('fast');
			}
		);

		return false;
	});

});