$(document).ready(function() {
  $("#attribute-info-form").submit(function(e) {
    e.preventDefault();
    var params = $("#attribute-info-form").serializeJSON(true);

    CTFd.fetch("/api/v1/attributes/" + ATTRIBUTE_ID, {
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
          window.location.reload();
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

  $("#set-team-form").submit(function(e) {
    e.preventDefault();
    var params = $("#set-team-form").serializeJSON(true);
	console.log(params);
	var team_id = params['team_id'];

    CTFd.fetch("/api/v1/attributes/" + ATTRIBUTE_ID + "/" + team_id, {
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
          window.location.reload();
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
