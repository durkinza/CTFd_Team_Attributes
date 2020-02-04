$(document).ready(function() {
  $("#attribute-info-form").submit(function(e) {
    e.preventDefault();
    var params = $("#attribute-info-form").serializeJSON(true);

    CTFd.fetch("/api/v1/attributes", {
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
          var team_id = response.data.id;
          window.location = CTFd.config.urlRoot + "/admin/attributes/" + team_id;
        } else {
          $("#attribute-info-form > #results").empty();
          Object.keys(response.errors).forEach(function(key, index) {
            $("#attribute-info-form > #results").append(
              ezbadge({
                type: "error",
                body: response.errors[key]
              })
            );
            var i = $("#attribute-info-form").find("input[name={0}]".format(key));
            var input = $(i);
            input.addClass("input-filled-invalid");
            input.removeClass("input-filled-valid");
          });
        }
      });
  });
});

