function update_default_field_type(input_type, input_value){
	var field_group = $('#default_value_group');
	var field = '';
	var field_label = '';

	switch(input_type){
		case "Checkbox":

			var checkbox_input = $('<input/>', {
				"class":"form-check-input",
				"type":"checkbox",
				"name": "default",
				"id": "default"
			});
			if(input_value){
				checkbox_input.prop('checked', true);
			}
			var checkbox_label = $('<label>Default Value </label> ', {
				"class":"form-check-label",
				"for":"default"
			});

			field = $('<div/>', {
				"class":"form-check form-check-inline"
			});

			field.append(checkbox_label).append(checkbox_input);
			break;

		case 'Text Area':
			field_label = $('<label>Default Value</label>', {
				"for":"default"
			});
			field = $('<textarea/>',{
				"class": "form-control",
				"name": "default",
				"id":"default",
				"rows": "5"
			});
			field.val(input_value);
			break;


		case "Secret":
			field_label = $('<label>Default Value</label>', {
				"for":"default"
			});
			field = $('<input/>',{
				"type": "password",
				"class": "form-control",
				"name": "default",
				"id":"default",
				"value": input_value,
				"required": true
			});
			break;

		case "Number":
			field_label = $('<label>Default Value</label>', {
				"for":"default"
			});
			field = $('<input/>',{
				"type": "number",
				"class": "form-control",
				"name": "default",
				"id":"default",
				"value": input_value,
				"required": true
			});
			break;

		case 'Select':
			field_label = $('<label>Default Value (the value of the option to be selected)</label>', {
				"for":"default"
			});
			field = $('<input/>',{
				"type": "text",
				"class": "form-control",
				"name": "default",
				"id":"default",
				"value": input_value,
				"required": true
			});
			break;

		case 'Text':
		default:
			field_label = $('<label>Default Value</label>', {
				"for":"default"
			});
			field = $('<input/>',{
				"type": "text",
				"class": "form-control",
				"name": "default",
				"id":"default",
				"value": input_value,
				"required": true
			});
	}

	field_group.empty();
	field_group.append(field_label);
	field_group.append(field);
}



	// when we change our field type, update the input type of the default value field.
	$('#field-type').on("change", function(e){
		var new_type = this.value;

		// convert old field value type to work with the new field type.
		switch(default_input_type){
			case 'checkbox':
				console.log("hit checkbox 1");
				default_input_value = $('#default').prop("checked")? '1':'0';
				break;	
			default:
				console.log("hit default 1");
				default_input_value = $('#default').val()
				break;
		}

		switch(new_type){
			case 'checkbox':
				default_input_value = default_input_value == 0?true:false;
				break;
			default:
				break;
		}
		// update globals
		default_input_type = new_type;
		
		// update the type and set new value
		update_default_field_type(new_type, default_input_value);
	});

$(document).ready(function(){
	update_default_field_type(default_input_type, default_input_value);
})

