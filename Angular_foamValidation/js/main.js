var applicationModule = angular.module('myAngularApp', ['jcs-autoValidate','angular-ladda']);

applicationModule.run(['defaultErrorMessageResolver',function(defaultErrorMessageResolver){
    defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages){
        errorMessages['Username'] = "The UserName should follow twitter conventions";
        errorMessages['tooYoung'] = 'You must be at least {0} years old to use this site';
        errorMessages['tooOld'] = 'You must be max {0} years old to use this site';
    });
}]);

applicationModule.controller('formValidationCtrl', function ($http) {
    var self = this;
    self.formModel = {};
    self.submitting = false;
    self.onSubmit = function () {
        self.submitting = true;
        console.log(self.formModel);
        $http.post('https://minmax-server.herokuapp.com/register/',self.formModel).
        success(function(data){
            console.log(":)");
            self.submitting = false;
        }).
        error(function(data){
            console.log(":(");
            self.submitting = false;
        });

    };
});