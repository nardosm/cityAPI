/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', , 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojlegend', 'ojs/ojchart', 'ojs/ojtoolbar'],
  function (oj, ko, $, app) {

    function DashboardViewModel() {
      var self = this;


      ///////================ Start of area used for chart.===============

      // Attribute Groups Handler for Consistent Coloring
      var attrGroups = new oj.ColorAttributeGroupHandler();

      // Categories
      var categories = ["Initial", "Qualification", "Meeting", "Proposal", "Close"];
      var hiddenCategories = [categories[0]];
      self.hiddenCategoriesValue = ko.observableArray(hiddenCategories);
      var highlightedCategories = [];
      self.highlightedCategoriesValue = ko.observableArray(highlightedCategories);

      /**
       * Formats the data for multi-pie
       * @param {List} data List of lists, each containing the data for one series/category.
       * @param {List} groups The group names to be used for tooltips.
       * @return {List} List containing the pie data
       */
      var createMultiPieData = function (data, groups) {
        var seriesLists = [];
        for (var j = 0; j < data[0].length; j++) {
          var seriesData = [];
          for (var i = 0; i < data.length; i++) {
            seriesData.push({
              'name': categories[i],
              'items': [data[i][j]]
            });
          }
          seriesLists.push(seriesData);
        }
        return seriesLists;
      };

      // Chart Data        
      var seriesGroupData = [
        [74, 62, 70, 76, 66],
        [50, 38, 46, 54, 42],
        [34, 22, 30, 32, 26],
        [18, 6, 14, 22, 10],
        [3, 2, 3, 3, 2]
      ];
      var groups = [1980, 1990, 2000, 2010, 2020];
      var lists = createMultiPieData(seriesGroupData, groups);

      self.pieSeries1Value = ko.observableArray(lists[0]);
      self.pieSeries2Value = ko.observableArray(lists[1]);
      self.pieSeries3Value = ko.observableArray(lists[2]);
      self.pieSeries4Value = ko.observableArray(lists[3]);
      self.pieSeries5Value = ko.observableArray(lists[4]);

      self.pie1Title = groups[0];
      self.pie2Title = groups[1];
      self.pie3Title = groups[2];
      self.pie4Title = groups[3];
      self.pie5Title = groups[4];

      // Legend Data
      var legendSections = [{
        items: []
      }];
      var legendItems = legendSections[0].items;
      for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
        var category = categories[categoryIndex];
        legendItems.push({
          text: category,
          color: attrGroups.getValue(category)
        });
      }

      self.legendSections = ko.observableArray(legendSections);


      ///////================ End of area used for chart.=================



      self.connected = function () {
        if (app.userLevel !== "staff") {
          document.getElementById("cityDemo").style.visibility = 'hidden';
          document.getElementById("citizenView").style.visibility = 'visible';
        } else {
          document.getElementById("cityDemo").style.visibility = 'visible';
          document.getElementById("citizenView").style.visibility = 'hidden';
        }
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);