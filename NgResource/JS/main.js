/**
 * Created by admin on 21/03/16.
 */
var app = angular.module('codecraft', [
    'ngResource',
    'infinite-scroll',
    'angularSpinner',
    'jcs-autoValidate',
    'angular-ladda'
]);

app.config(function ($httpProvider, $resourceProvider, laddaProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = 'Token 72d16cc1ce7a74938f36944f1ed8c0513e827d15';
    $resourceProvider.defaults.stripTrailingSlashes = false;
    laddaProvider.setOption({
        style: 'expand-right'
    });
});

app.factory('Contact', function ($resource) {
    return $resource("https://codecraftpro.com/api/samples/v1/contact/:id/", {id: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
});

app.controller('PersonDetailController', function ($scope, ContactService) {
    $scope.contacts = ContactService;
    $scope.save = function () {
        $scope.contacts.updateContact($scope.contacts.selectedPerson);
    }
});

app.controller('PersonListController', function ($scope, ContactService) {

    $scope.search = "";
    $scope.order = "email";
    $scope.contacts = ContactService;
    $scope.loadMore = function () {
        $scope.contacts.loadMore();
    };
    $scope.$watch('search', function (newValue, oldValue) {
        if (angular.isDefined(newValue)) {
            $scope.contacts.doSearch(newValue);
        }
    });

});

app.service('ContactService', function (Contact) {

    var self = {
        'addPerson': function (person) {
            this.persons.push(person);
        },
        'Page': 0,
        'hasMore': true,
        'isLoading': false,
        'isSaving': false,
        'selectedPerson': null,
        'persons': [],
        'search': null,
        'doSearch': function (newValue) {
            self.hasMore = true;
            self.persons = [];
            self.Page = 1;
            self.search = newValue;
            self.loadContacts();
        },
        'loadContacts': function () {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;
                var params = {
                    'page': self.Page,
                    'search': self.search
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
        },
        'updateContact': function (person) {
            self.isSaving = true;
            person.$update().then(function () {
                self.isSaving = false;
            });
        }
    }
    return self;
});