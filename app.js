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

        narrowCtrl.narrowItDown = function () {
            if (narrowCtrl.searchTerm.trim() === "") {
                narrowCtrl.found = [];
                return;
            }

            MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
            .then(function (foundItems) {
                console.log("foundItems",foundItems)
                narrowCtrl.found = foundItems;
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
            console.log("search",searchTerm)
            return $http({
                method: "GET",
                url: ApiBasePath
            }).then(function (response) {
                var foundItems = [];
                console.log("resp",response,searchTerm)
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                        foundItems.push(response.data[i]);
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
