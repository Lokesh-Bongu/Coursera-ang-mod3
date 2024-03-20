(function() {

    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', foundItemsDirective);
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var narrowDown = this;
      narrowDown.searchTerm = "";
      narrowDown.found = [];
  
      narrowDown.getMenuItems = function() {
        if (narrowDown.searchTerm) {
          console.log("Search term:", narrowDown.searchTerm); // Log search term
          MenuSearchService.getMatchedMenuItems(narrowDown.searchTerm)
            .then(function(matchedItems) {
              narrowDown.found = matchedItems;
            });
        } else {
          console.log("Please enter a search term");
        }
      };
  
      narrowDown.removeItem = function(index) {
        narrowDown.found.splice(index, 1);
      };
    }
  
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      this.getMatchedMenuItems = function(searchTerm) {
        var url = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json";
  
        console.log("Making HTTP request to:", url); // Log request URL
  
        return $http.get(url)
          .then(function(response) {
            if (response.data) {
              var filteredItems = [];
              // Loop through each category's menu_items array
              for (var category in response.data) {
                for (var i = 0; i < response.data[category].menu_items.length; i++) {
                  var item = response.data[category].menu_items[i];
                  // Check if description (or name) contains the search term (case-insensitive)
                  if (item.description && item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                      item.name && item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                    filteredItems.push(item);
                  }
                }
              }
              console.log("Found items:", filteredItems.length); // Log number of found items
              return filteredItems;
            } else {
              console.log("Error fetching menu items");
              return [];
            }
          });
      };
    }
  
    function foundItemsDirective() {
      var ddo = {
        restrict: 'E',
        scope: {
          found: '='
        },
        template: '<ul><li ng-repeat="item in found"> {{item.name}} ({{item.short_name}}) - {{item.description}} <button ng-click="onRemove({index: $index})">Don\'t want this one!</button></li></ul>',
        link: function(scope, element, attrs) {
          scope.onRemove = function(data) {
            scope.$parent.narrowDown.removeItem(data.index);
          
  