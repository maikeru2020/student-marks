function checkLogin() {
    var username = $('#username').val();
    var password = $('#password').val();
    console.log(username);
    params = {
        username: username,
        password: password
    };
    $.post('signIn', params, function(result) {
        console.log(JSON.stringify(result));
        if (result.redirect) {
            console.log(result.route);
            window.location.replace(result.route);
        } else {
            $('.message').html(result.message);
        }

    });
}