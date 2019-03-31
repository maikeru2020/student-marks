function createAccount() {
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var username = $('#username').val();
    var password = $('#password').val();
    var accountType = $('#accountType').val();
    var params = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        accountType: accountType
    };

    $.post('insertUser', params, function(result) {
        $('.message').html(result.message);
    });
}