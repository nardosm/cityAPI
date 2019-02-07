/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojinputtext'],
  function (oj, ko, $, app) {

    const loginAPI = '/login';
    let ret = false;


    function submitLogin(userName, password) {
      $.ajax({
        type: 'POST',
        url: loginAPI,
        data: JSON.stringify({
          "userName": userName,
          "password": password
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (msg) {
          console.log(`We are at success...`);
          console.log(msg);
          if (parseInt(msg) != 0) {
            if (msg.userToken == 'aaaaa') {
              app.userLevel = 'staff';
              app.setEmail(userName);
              app.setPageID('dashboard');
              app.gotoDashboard();
              app.refreshMenu();
              ret = true;
            } else if (msg.userToken == 'bbbbb') {
              app.userLevel = 'citizen';
              app.setEmail(userName);
              app.setPageID('dashboard');
              app.gotoDashboard();
              app.refreshMenu();
              ret = true;
            } else {
              alert('Login failed - Please check with Administrator');
            }
          } else {
            console.log('success but no response');
          }
        },
        failure: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
          alert('Login Failed: ' + textStatus);
        }
      });
      return ret;
    }


    function LoginViewModel() {
      const self = this;
      self.isLoggedIn = ko.observable(false);
      //set these to defaults to enable login testing
      self.userName = ko.observable("");
      self.password = ko.observable("");

      //pass callbacks to the login to trigger page behavior on success or failure
      self.login = function () {
        self.authenticate(self.userName(), self.password());
      }

      self.authenticate = function (userName, password) {
        submitLogin(userName, password);
      }

      //pass callbacks to the login to trigger page behavior on success or failure
      self.logout = function () {
        console.log("***** logout called *****");
        self.isLoggedIn = ko.observable(false);
      }

      self.loginSuccess = function (response, data) {
        console.log("***** login success *****");
        app.setPageID('dashboard');
        app.gotoDashboard();
        app.refreshMenu();
      };

      self.loginFailure = function (statusCode, data) {
        console.log('self.loginFailure');
      };

      self.handleActivated = function (info) {
        if (self.isLoggedIn()) {
          self.logout();
        }
      };


      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here. 
       * This method might be called multiple times - after the View is created 
       * and inserted into the DOM and after the View is reconnected 
       * after being disconnected.
       */
      self.connected = function () {
        app.refreshMenu();
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
    return new LoginViewModel();
  }
);