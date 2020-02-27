function htmlentities(s){return s.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {return '&#'+i.charCodeAt(0)+';';});}
$(document).ready(function(){
	$('.edit-attr').click(function(){
		$('#team-attr-modal').modal();
	});

	$('.attr-option').each(function(index, el){
		$(el).click(function(){
			$('#attr-select-option-modal-'+$(el).attr('data-option-id')).modal();
		});
		$('#delete-option-'+$(el).attr('data-option-id')).click(function(e){
			e.stopPropagation();
			var option_id = $(el).attr('data-option-id');
			var option_name = $(el).attr('data-option-name');
			CTFd.ui.ezq.ezQuery({
				title: "Delete Option",
				body: "Are you sure you want to delete {0}".format(
					"<strong>" + htmlentities(option_name) + "</strong>"
				),
				success: function() {
					CTFd.fetch("/api/v1/attributes/" + ATTRIBUTE_ID + "/options/" + option_id, {
						method: "DELETE"
					})
					.then(function(response) {
						return response.json();
					})
					.then(function(response) {
						if (response.success) {
							window.location.reload();
						}
					});
				}
			});
		});
	});

	$('.attr-select-option-form').each(function(index, el){
		$('#set-team-attr-form-'+$(el).attr('data-attr-id')).submit(function(e){
			e.preventDefault();
			var option_id = $(el).attr('data-option-id');
			var params = $('#attr-select-option-form-'+option_id).serializeJSON(true);
			
			CTFd.fetch("/api/v1/attributes/"+option_id+"/options/"+params.id, {
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
					window.location = CTFd.config.urlRoot + "/attributes/"+attr_id+"/options";
				} else {
					$("#set-team-attr-form-" + attr_id + " > #results").empty();
					Object.keys(response.errors).forEach(function(key,index){
						$("#set-team-attr-form-" + attr_id + " > #results").append(
							CTFd.ui.ezq.ezBadge({
								type: "error",
								body: response.errors[key]
							})
						);
						var i = $("#attr-select-option-form-"+option_id).find("input[name={0}]".format(key));
						var input = $(i);
						input.addClass("input-filled-invalid");
						input.removeClass("input-filled-valid");
					});
				}
			});
		});

	});
})
