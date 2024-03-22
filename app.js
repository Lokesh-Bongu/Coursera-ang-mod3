(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective)
    .constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json");

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var narrowCtrl = this;
        narrowCtrl.searchTerm = "";
        narrowCtrl.found = [];
        narrowCtrl.nothingFound = false;

        narrowCtrl.narrowItDown = function () {
            if (narrowCtrl.searchTerm.trim() === "") {
                narrowCtrl.found = [];
                narrowCtrl.nothingFound = true;
                return;
            }

            MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
            .then(function (foundItems) {
                narrowCtrl.found = foundItems;
                narrowCtrl.nothingFound = narrowCtrl.found.length === 0;
            });
        };

        narrowCtrl.removeItem = function (index) {
            narrowCtrl.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: ApiBasePath
            }).then(function (response) {
                var foundItems = [];

                for (var key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                        var category = response.data[key];
                        if (category.hasOwnProperty('menu_items')) {
                            var menuItems = category.menu_items;
                            for (var i = 0; i < menuItems.length; i++) {
                                if (menuItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                                    foundItems.push(menuItems[i]);
                                }
                            }
                        }
                    }
                }

                return foundItems;
            });
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'foundItemsCtrl',
            bindToController: true
        };

        return ddo;
    }

    function FoundItemsDirectiveController() {
        var foundItemsCtrl = this;
    }

})();
