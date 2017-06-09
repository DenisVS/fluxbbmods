function aqmp_post(the_form)
{
	$('#aqmp-icon').show();
	$('#quickpost form input').attr('disabled', 'disabled');
	var values = {};
	for (var i = 0; i < the_form.elements.length; i++)
	{
		var el = the_form.elements[i];
		if (el.name != 'undefined' && el.value != 'undefined' && el.name != 'preview')
			values[el.name] = el.value;
	}
  values['merge'] = ($("input[name='merge']").prop('checked') == true)  ? 1 : 0;
	$.post('post.php?tid=' + aqmp_tid + '&ppid=' + aqmp_prenult_post_id + '&pcount=' + aqmp_post_count + '&ajax=1' ,  values, function(data) 
		{
			if (data.indexOf('<div id="p') != -1)
			{
				data = data.substring(data.indexOf('<div id="p')); // trim top crumbs
				data = data.substring(0, data.indexOf('<div id="aqmp">')); // posts end
				$( "#p" + aqmp_last_post_id ).remove();
				$('#aqmp').html(data);
				the_form['req_message'].value = '';
				if (the_form['req_username']) the_form['req_username'].value = '';
				if (the_form['req_email']) the_form['req_email'].value = '';
				if (the_form['email']) the_form['email'].value = '';
			}
			else
				alert(data);
			$('#aqmp-icon').hide();
			$('#quickpost form input').removeAttr('disabled');
		}
	);
	return false;
}
