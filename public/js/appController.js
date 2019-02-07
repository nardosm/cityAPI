/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojmodule-element', 'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource'],
  function (oj, ko, moduleUtils) {
    function ControllerViewModel() {
      const self = this;
      const loginURL = `test`;

      // Media queries for repsonsive layouts
      const smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      // Router setup
      self.router = oj.Router.rootInstance;
      self.router.configure({
        'login': {
          label: 'Login',
          isDefault: true
        },
        'dashboard': {
          label: 'Dashboard'
        },
        'about': {
          label: 'About'
        }
      });
      oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

      self.moduleConfig = ko.observable({
        'view': [],
        'viewModel': null
      });

      self.loadModule = function () {
        ko.computed(() => {
          let name = self.router.moduleConfig.name();
          let viewPath = 'views/' + name + '.html';
          let modelPath = 'viewModels/' + name;
          let masterPromise = Promise.all([
            moduleUtils.createView({
              'viewPath': viewPath
            }),
            moduleUtils.createViewModel({
              'viewModelPath': modelPath
            })
          ]);
          masterPromise.then(
            (values) => {
              self.moduleConfig({
                'view': values[0],
                'viewModel': values[1]
              });
            }
          );
        });
      };

      // Navigation setup
      var navData = [{
          name: 'Dashboard',
          id: 'dashboard',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
        },
        {
          name: 'About',
          id: 'about',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'
        }
      ];
      self.navDataSource = new oj.ArrayTableDataSource(navData, {
        idAttribute: 'id'
      });

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("City Helper");
      // User Info used in Global Navigation area
      self.email = ko.observable("sample@cityoftownship.gov");
      self.userLogin = ko.observable("sample@cityoftownship.gov");
      self.pageid = 'login';
      self.email = ko.observable("");

      // Things that will help us have a realistic login.
      self.showHideMenu = function () {
        console.log(`showHideMenu - app.pageid`);
        console.log(app.pageid);
        if (app.pageid == 'login') {
          document.getElementById("header").style.visibility = 'hidden';
        } else {
          document.getElementById("header").style.visibility = 'visible';
        }
      }

      self.setEmail = function (email) {
        self.email(email);
        self.userLogin(email);
      }

      self.logout = function (logout) {
        self.email("");
        self.userLogin("");
        self.pageid = 'login';
        self.router.go('login');
      }

      $('#out').click(() => {
        self.logout();
        self.refreshMenu();
      });

      self.userLevel = 'a';


      self.setPageID = function (id) {
        self.pageid = id;
      }

      self.refreshMenu = function () {
        if (self.pageid == 'login') {
          document.getElementById("header").style.visibility = 'hidden';
        } else {
          document.getElementById("header").style.visibility = 'visible';
        }
      }

      self.gotoDashboard = function () {
        self.router.go('dashboard');
      };


      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);
    }

    return new ControllerViewModel();
  }
);