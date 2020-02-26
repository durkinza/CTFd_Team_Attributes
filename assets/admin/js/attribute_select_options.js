$(document).ready(function() {
  $("#set-select-option-form").submit(function(e) {
    e.preventDefault();
    var params = $("#set-select-option-form").serializeJSON(true);

    CTFd.fetch("/api/v1/attributes/" + ATTRIBUTE_ID + "/options", {
      method: "PATCH",
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
          var attr_id = response.data.attr_id;
          window.location = CTFd.config.urlRoot + "/admin/attributes/" + attr_id;
        } else {
          $("#set-select-options-form > #results").empty();
          Object.keys(response.errors).forEach(function(key, index) {
            $("#set-select-options-form > #results").append(
              CTFd.ui.ezq.ezBadge({
                type: "error",
                body: response.errors[key]
              })
            );
            var i = $("#set-select-options-form").find("input[name={0}]".format(key));
            var input = $(i);
            input.addClass("input-filled-invalid");
            input.removeClass("input-filled-valid");
          });
        }
      });
  });
});

