(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var narrowCtrl = this;
        narrowCtrl.searchTerm = '';
        narrowCtrl.found = [];

        narrowCtrl.narrowDown = function () {
            if (narrowCtrl.searchTerm.trim() !== '') {
                MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
                    .then(function (foundItems) {
                        narrowCtrl.found = foundItems;
                    });
            } else {
                narrowCtrl.found = [];
            }
        };

        narrowCtrl.removeItem = function (index) {
            narrowCtrl.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: 'GET',
                url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
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
            restrict: 'E',
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
