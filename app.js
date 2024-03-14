// app.js

(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective)
        .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com');

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var narrowDown = this;
        narrowDown.searchTerm = '';
        narrowDown.found = [];

        narrowDown.search = function () {
            if (narrowDown.searchTerm.trim() === '') {
                narrowDown.found = [];
                return;
            }

            MenuSearchService.getMatchedMenuItems(narrowDown.searchTerm)
                .then(function (foundItems) {
                    narrowDown.found = foundItems;
                });
        };

        narrowDown.removeItem = function (index) {
            narrowDown.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            }).then(function (result) {
                var foundItems = result.data.menu_items.filter(function (item) {
                    return item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
                });
                return foundItems;
            });
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                foundItems: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'list',
            bindToController: true
        };
        return ddo;
    }

    function FoundItemsDirectiveController() {
        var list = this;
    }

})();
