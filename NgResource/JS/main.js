/**
 * Created by admin on 21/03/16.
 */
var app = angular.module('codecraft', [
    'ngResource', 'infinite-scroll'
]);

app.config( function ($httpProvider, $resourceProvider){
    $httpProvider.defaults.headers.common['Authorization'] = 'Token 72d16cc1ce7a74938f36944f1ed8c0513e827d15';
    $resourceProvider.defaults.stripTrailingSlashes = false;
});

app.factory('Contact',function($resource){
    return $resource("https://codecraftpro.com/api/samples/v1/contact/:id/");
});

app.controller('PersonDetailController', function ($scope, ContactService) {
    $scope.contacts = ContactService;
});

app.controller('PersonListController', function ($scope, ContactService) {

    $scope.search = "";
    $scope.order = "email";
    $scope.contacts = ContactService;
    $scope.loadMore = function(){
      $scope.contacts.loadMore();
    };
    $scope.sensitiveSearch = function (person) {
        if ($scope.search) {
            return person.name.indexOf($scope.search) == 0 ||
                person.email.indexOf($scope.search) == 0;
        }
        return true;
    };

});

app.service('ContactService', function (Contact) {

    var self = {
        'addPerson': function (person) {
            this.persons.push(person);
        },
        'Page': 0,
        'hasMore': true,
        'isLoading': false,
        'selectedPerson': null,
        'persons': [],
        'loadContacts': function () {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;
                var params = {
                    'page': self.Page
                };
                Contact.get(params, function (data) {
                    angular.forEach(data.results, function (person) {
                        self.persons.push(new Contact(person));
                    });
                    if (!data.next) {
                        self.hasMore = false;
                    }
                    self.isLoading = false;
                });
            }
        },
        'loadMore': function () {
            if (self.hasMore && !self.isLoading) {
                self.Page += 1;
                self.loadContacts();
            }
        }
    }
    return self;
});