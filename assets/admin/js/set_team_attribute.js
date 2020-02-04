$(document).ready(function() {
  $("#set-team-form").submit(function(e) {
    e.preventDefault();
    var params = $("#set-team-form").serializeJSON(true);

    CTFd.fetch("/api/v1/attributes/" + ATTRIBUTE_ID + "/" + TEAM_ID, {
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
          $("#set-team-form > #results").empty();
          Object.keys(response.errors).forEach(function(key, index) {
            $("#set-team-form > #results").append(
              ezbadge({
                type: "error",
                body: response.errors[key]
              })
            );
            var i = $("#set-team-form").find("input[name={0}]".format(key));
            var input = $(i);
            input.addClass("input-filled-invalid");
            input.removeClass("input-filled-valid");
          });
        }
      });
  });
});

