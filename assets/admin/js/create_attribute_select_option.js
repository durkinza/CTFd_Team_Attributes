$(document).ready(function() {
  $("#attribute-select-option-form").submit(function(e) {
    e.preventDefault();
    var params = $("#attribute-select-option-form").serializeJSON(true);
    CTFd.fetch("/api/v1/attributes/"+params['attr_id']+"/options/", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        if (response.success) {
          var option_id = response.data.id;
          window.location = CTFd.config.urlRoot + "/admin/attributes/" + params['attr_id'] + '/options';
        } else {
          $("#attribute-select-option-form > #results").empty();
          Object.keys(response.errors).forEach(function(key, index) {
            $("#attribute-select-option-form > #results").append(
              CTFd.ui.ezq.ezBadge({
                type: "error",
                body: response.errors[key]
              })
            );
            var i = $("#attribute-select-option-form").find("input[name={0}]".format(key));
            var input = $(i);
            input.addClass("input-filled-invalid");
            input.removeClass("input-filled-valid");
          });
        }
      });
  });
});

