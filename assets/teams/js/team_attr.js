$(document).ready(function(){
	$('.edit-attr').click(function(){
		$('#team-attr-modal').modal();
	});
	$('.team-attr').each(function(index, el){
		$(el).click(function(){
			$('#team-attr-modal-'+$(el).attr('data-attr-id')).modal();
		});
	});

	$('.set-team-attr-form').each(function(index, el){
		$('#set-team-attr-form-'+$(el).attr('data-attr-id')).submit(function(e){
			e.preventDefault();
			var attr_id = $(el).attr('data-attr-id');
			var params = $('#set-team-attr-form-'+attr_id).serializeJSON(true);
			console.log(params);
			
			CTFd.fetch("/api/v1/attributes/"+attr_id+"/"+params.team_id, {
				method: "POST",
				credentials: "same-origin",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(params)
			})
			.then(function(response){
				return response.json();
			})
			.then(function(response){
				if (response.success) {
					window.location = CTFd.config.urlRoot + "/team";
				} else {
					$("#set-team-attr-form-" + attr_id + " > #results").empty();
					Object.keys(response.errors).forEach(function(key,index){
						/*$("#set-team-attr-form-" + attr_id + " > #results").append(
							ezbadge({
								type: "error",
								body: response.errors[key]
							})
						);*/
						var i = $("#set-team-attr-form-"+attr_id).find("input[name={0}]".format(key));
						var input = $(i);
						input.addClass("input-filled-invalid");
						input.removeClass("input-filled-valid");
					});
				}
			});
		});
	});
});
