(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var narrowCtrl = this;
        narrowCtrl.found = [];

        narrowCtrl.narrowItDown = function() {
            if (narrowCtrl.searchTerm) {
                MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
                    .then(function(foundItems) {
                        narrowCtrl.found = foundItems;
                    });
            } else {
                narrowCtrl.found = [];
            }
        };

        narrowCtrl.removeItem = function(index) {
            narrowCtrl.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
                method: 'GET',
                url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
            }).then(function(response) {
                var menuItems = response.data;
                var foundItems = [];

                for (var key in menuItems) {
                    if (menuItems.hasOwnProperty(key)) {
                        var item = menuItems[key];
                        if (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                            foundItems.push(item);
                        }
                    }
                }

                return foundItems;
            });
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'templates/foundItems.html',
            restrict: 'E',
            scope: {
                foundItems: '<',
                onRemove: '&'
            }
        };

        return ddo;
    }

})();
