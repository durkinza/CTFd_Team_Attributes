function click_scope(m){
	return function(event){m.modal();}
}
function dropdown_scope(select, attr, attr_value){
	return CTFd.fetch("/api/v1/attributes/"+attr.id+"/options", {
		method: "GET",
		credentials: "same-origin",
		headers: {
			Accept: "applications/json",
			"Content-Type": "application/json"
		}
	}).then(function(response){return response.json();}).then(function(options){
		$.each(options.data, function(index, option){
			select.append($('<option value="'+option.value+'" '+(option.value==attr_value?'selected':'')+'>'+option.name+'</option>'));
		});
	});
}

function handle_attr_submit(form){
	form.submit(function(e){
		console.log('setting submit function');
		e.preventDefault();
		var attr_id = form.attr('data-attr-id');
		var params = form.serializeJSON(true);
		console.log(params);
		
		CTFd.fetch("/api/v1/attributes/"+attr_id+"/"+params.team_id, {
			method: "PATCH",
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
				form.find('#results').empty();
				Object.keys(response.errors).forEach(function(key,index){
				form.find('#results').append(
					CTFd.ui.ezq.ezBadge({
							type: "error",
							body: response.errors[key]
						})
					);
					var i = form.find("input[name={0}]".format(key));
					var input = $(i);
					input.addClass("input-filled-invalid");
					input.removeClass("input-filled-valid");
				});
			}
		});
	});
}


$(document).ready(function(){
	if(/team$/.test(window.location)){

		// get list of attributes
		var attr_promise = CTFd.fetch("/api/v1/attributes", {
			method: "GET",
			credentials: "same-origin",
			headers: {
				Accept: "applications/json",
				"Content-Type": "application/json"
			}
		}).then(function(response){return response.json();});
		// get our team's values
		var values_promise = CTFd.fetch("/api/v1/attributes/team/me", {
			method: "GET",
			credentials: "same-origin",
			headers: {
				Accept: "applications/json",
				"Content-Type": "application/json"
			}
		}).then(function(response){return response.json();});

		// once the above ajax request have returned, we can build our forms
		$.when(attr_promise, values_promise).then(function(attributes, values){ 

			if(attributes.success && attributes.data.length > 0){
				// insert edit button, if we have at least one attribute available
				var icon = $('<i/>', {class:'btn-fa fas fa-pencil-alt fa-2x px-2', 'data-toggle':'tooltip', 'data-placement':'top', title:'Edit Attributes'});
				var button = $('<a/>', {class:"edit-attr"}).append(icon);
				$('.edit-team').parent().append(button);
				button.click(function(e){
					$('#team-attr-modal').modal();
				});
				
				// A link to the document body for adding modals
				var doc = $('main[role="main"]');	
	
				// generate attributes modal
				var attr_modal = $('<div/>',{id:'team-attr-modal', class:'modal fade'});
				var attr_modal_dialog = $('<div/>', {class: 'modal-dialog'});
				var attr_modal_content = $('<div/>', {class: 'modal-content'});
				var attr_modal_header = $('<div class="modal-header"><h2 class="modal-action text-center w-100">Edit Team Attributes</h2><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
				var attr_modal_body = $('<div/>', {class:'modal-body clearfix'});
				attr_modal.append(attr_modal_dialog.append(attr_modal_content.append(attr_modal_header).append(attr_modal_body)));
				var attr_modal_table = $('<table/>', {class:'table table-striped table-hover'}).append($("<thead><tr><td><b>Attribute</b></td></tr></thead>"));
				var attr_modal_table_body = $('<tbody/>');
				attr_modal_body.append(attr_modal_table.append(attr_modal_table_body));
				doc.append(attr_modal);
				for(var i = 0; attributes.data.length > i; i++){
					var attr = attributes.data[i];
					// add attribute to attributes modal table
					var attribute_modal_button = $("<tr class='team-attr' data-attr-id='"+attr.id+"'><td><a>"+attr.name+"</a></td></tr>");
					attr_modal_table_body.append(attribute_modal_button);
					// generate individual attribute modal
					var attribute_modal = $("<div/>", {id:"team-attr-modal-"+attr.id, class:"team-attr-modal modal fade"});
					attribute_modal_button.click(click_scope(attribute_modal));
					var attr_modal_dialog = $('<div/>', {class: 'modal-dialog'});
					var attr_modal_content = $('<div/>', {class: 'modal-content'});
					var attr_modal_header = $('<div class="modal-header"><h2 class="modal-action text-center w-100">'+attr.name+'</h2><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
					var attr_modal_body = $('<div/>', {class:'modal-body clearfix'});
					attribute_modal.append(attr_modal_dialog.append(attr_modal_content.append(attr_modal_header).append(attr_modal_body)));
					// create the attribute form
					var attr_form = $("<form/>", {id:'set-team-attr-form-'+attr.id, method:'POST', class:'set-team-attr-form', 'data-attr-id':attr.id});
					attr_form_group = $('<div/>', {class:'form-group', id:'team-attr-form-group-'+attr.id});

					var attr_value = values.data.find(element => element.attr_id == attr.id);
					// if the value isn't set, we'll use the default
					var attr_value = attr_value != undefined? attr_value.value : attr['default'];
					
					// freeze the attribute if it's frozen, or if the user isn't the captin.
					var attr_frozen = attr.frozen || !team_captain;
					
					// based on the attribute type, we'll customize the input field.
					console.log(attr);
					switch(attr.type){
						case 'Checkbox':
							var attr_field = '<div class="form-check form-check-inline"><input class="form-check-input attr-value" type="checkbox" name="value" id="value-'+attr.id+'" '+(attr_frozen?'disabled ':'')+(attr_value=="false" || attr_value=='0'?'':'checked')+'><label class="form-check-label" for="value">'+(attr.name)+'</label>';
							break;
						case 'Password':
							var attr_field = '<label for="value">'+attr.name+'</label><input type="password" class="form-control attr-value" name="value" id="value-'+attr.id+'" '+(attr_frozen?'disabled ':'')+' value="'+(attr_value)+'">';
							break;
						case 'Select':	
							var select_field = $('<select '+(attr_frozen?'disabled':'')+'/>',{class:'form-control attr-value', name:'value', id:'value-'+attr.id});
							var select_label = $('<label for="value">'+attr.name+'</label>');
							var attr_field = $('<div/>').append(select_label).append(select_field);
							// for dropdowns, we'll need to get the available options.
							dropdown_scope(select_field,attr, attr_value);
							break;
						case 'Number':
							var attr_field = '<label for="value">'+attr.name+'</label><input type="number" class="form-control attr-value" name="value" id="value-'+attr.id+'" '+(attr_frozen?'disabled ':'')+' value="'+(attr_value)+'">';
							break;
						case 'Text Area':
							var attr_field = '<label for="value">'+attr.name+'</label><textarea class="form-control attr-value" name="value" id="value-'+attr.id+'" '+(attr_frozen?'disabled ':'')+'>'+(attr_value)+'</textarea>';
							break;
						default:
							var attr_field = '<label for="value">'+attr.name+'</label><input type="text" class="form-control attr-value" name="value" id="value-'+attr.id+'" '+(attr_frozen?'disabled ':'')+' value="'+(attr_value)+'">';
					}
					// add the input field to the form.
					attr_form_group.append(attr_field);
					attr_modal_body.append(
						attr_form.append('<input type="hidden" name="id">')
						.append('<input type="hidden" name="attr_id" value="'+attr.id+'">')
						.append('<input type="hidden" name="team_id" value="'+stats_data['id']+'">')
						.append(attr_form_group)
						.append('<div id="results"></div><button id="set-team-attribute-'+attr.id+'" type="submit" class="btn btn-primary btn-outlined float-right modal-action '+(attr_frozen?'disabled':'')+'" '+(attr_frozen?'disabled':'')+'>Submit</button>')
					);

					// Finally, we'll setup the submission of each attribute form.
					handle_attr_submit(attr_form);
				}
			}
		});
	}
});
