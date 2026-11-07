// digitenantMenuConfig.js
//
// Sidebar menu for the "digitenant" app. Extended by clone-module.js: modules you
// confirm are added below, grouped by the first word of their table name
// (fuel_stations, fuel_pumps -> "Fuel"). Modules already here are never duplicated,
// and the file is copied to _recycled/ before any change - so reorder, rename,
// regroup, add dashboards or quick actions and set `roles` freely.
// Your own grouping: app/<app>/AppRoutes/menuGroups.txt  ("Sales = fuel_sales, sales_orders").

export const digitenantSidebarConfig = [

  // ============================================================
  // HOME  (added by clone-module.js)
  // ============================================================

  {
    type: "link",
    label: "Dashboard",
    icon: "fa fa-dashboard",
    href: (routes) => `${routes.digitenant}/dashboard/main`,
    roles: []
  },


  // ============================================================
  // PROPERTIES  (menu group - added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Properties",
    icon: "fa fa-building-o",
    roles: [],
    items: [
      // <menu-group:property>
      {
        type: "submenu",
        label: "List",
        icon: "fa fa-building-o",
        roles: [],
        items: [
          {
            label: "Add New List",
            href: (routes) => `${routes.digitenant}/propertieslist/profile`,
            roles: []
          },
          {
            label: "Manage List",
            href: (routes) => `${routes.digitenant}/propertieslist/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View List",
            href: (routes) => `${routes.digitenant}/propertieslist/list?setgv=table`,
            roles: []
          },
          {
            label: "Import List",
            href: (routes) => `${routes.digitenant}/propertieslist/import`,
            roles: []
          }
        ]
      },
      {
        type: "submenu",
        label: "Units",
        icon: "fa fa-building-o",
        roles: [],
        items: [
          {
            label: "Add New Unit",
            href: (routes) => `${routes.digitenant}/propertiesunits/profile`,
            roles: []
          },
          {
            label: "Manage Units",
            href: (routes) => `${routes.digitenant}/propertiesunits/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Units",
            href: (routes) => `${routes.digitenant}/propertiesunits/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Units",
            href: (routes) => `${routes.digitenant}/propertiesunits/import`,
            roles: []
          }
        ]
      },
      {
        type: "submenu",
        label: "Landlords",
        icon: "fa fa-building-o",
        roles: [],
        items: [
          {
            label: "Add New Landlord",
            href: (routes) => `${routes.digitenant}/propertieslandlords/profile`,
            roles: []
          },
          {
            label: "Manage Landlords",
            href: (routes) => `${routes.digitenant}/propertieslandlords/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Landlords",
            href: (routes) => `${routes.digitenant}/propertieslandlords/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Landlords",
            href: (routes) => `${routes.digitenant}/propertieslandlords/import`,
            roles: []
          }
        ]
      },
      {
        type: "submenu",
        label: "Payouts",
        icon: "fa fa-building-o",
        roles: [],
        items: [
          {
            label: "Add New Payout",
            href: (routes) => `${routes.digitenant}/propertiespayouts/profile`,
            roles: []
          },
          {
            label: "Manage Payouts",
            href: (routes) => `${routes.digitenant}/propertiespayouts/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Payouts",
            href: (routes) => `${routes.digitenant}/propertiespayouts/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Payouts",
            href: (routes) => `${routes.digitenant}/propertiespayouts/import`,
            roles: []
          }
        ]
      },
      // </menu-group:property>
    ]
  },

  // ============================================================
  // TENANTS  (menu group - added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Tenants",
    icon: "fa fa-users",
    roles: [],
    items: [
      // <menu-group:tenant>
      {
        type: "submenu",
        label: "List",
        icon: "fa fa-users",
        roles: [],
        items: [
          {
            label: "Add New List",
            href: (routes) => `${routes.digitenant}/tenantslist/profile`,
            roles: []
          },
          {
            label: "Manage List",
            href: (routes) => `${routes.digitenant}/tenantslist/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View List",
            href: (routes) => `${routes.digitenant}/tenantslist/list?setgv=table`,
            roles: []
          },
          {
            label: "Import List",
            href: (routes) => `${routes.digitenant}/tenantslist/import`,
            roles: []
          }
        ]
      },
      {
        type: "submenu",
        label: "Leases",
        icon: "fa fa-users",
        roles: [],
        items: [
          {
            label: "Add New Lease",
            href: (routes) => `${routes.digitenant}/tenantsleases/profile`,
            roles: []
          },
          {
            label: "Manage Leases",
            href: (routes) => `${routes.digitenant}/tenantsleases/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Leases",
            href: (routes) => `${routes.digitenant}/tenantsleases/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Leases",
            href: (routes) => `${routes.digitenant}/tenantsleases/import`,
            roles: []
          }
        ]
      },
      // </menu-group:tenant>
    ]
  },

  // ============================================================
  // RENT  (menu group - added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Rent",
    icon: "fa fa-copy",
    roles: [],
    items: [
      // <menu-group:rent>
      {
        type: "submenu",
        label: "Invoices",
        icon: "fa fa-file-text-o",
        roles: [],
        items: [
          {
            label: "Add New Invoice",
            href: (routes) => `${routes.digitenant}/rentinvoices/profile`,
            roles: []
          },
          {
            label: "Manage Invoices",
            href: (routes) => `${routes.digitenant}/rentinvoices/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Invoices",
            href: (routes) => `${routes.digitenant}/rentinvoices/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Invoices",
            href: (routes) => `${routes.digitenant}/rentinvoices/import`,
            roles: []
          }
        ]
      },
      {
        type: "submenu",
        label: "Payments",
        icon: "fa fa-credit-card",
        roles: [],
        items: [
          {
            label: "Add New Payment",
            href: (routes) => `${routes.digitenant}/rentpayments/profile`,
            roles: []
          },
          {
            label: "Manage Payments",
            href: (routes) => `${routes.digitenant}/rentpayments/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Payments",
            href: (routes) => `${routes.digitenant}/rentpayments/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Payments",
            href: (routes) => `${routes.digitenant}/rentpayments/import`,
            roles: []
          }
        ]
      },
      {
        type: "submenu",
        label: "Items",
        icon: "fa fa-list",
        roles: [],
        items: [
          {
            label: "Add New Item",
            href: (routes) => `${routes.digitenant}/rentitems/profile`,
            roles: []
          },
          {
            label: "Manage Items",
            href: (routes) => `${routes.digitenant}/rentitems/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Items",
            href: (routes) => `${routes.digitenant}/rentitems/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Items",
            href: (routes) => `${routes.digitenant}/rentitems/import`,
            roles: []
          }
        ]
      },
      // </menu-group:rent>
    ]
  },

  // ============================================================
  // MAINTENANCE  (menu group - added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Maintenance",
    icon: "fa fa-wrench",
    roles: [],
    items: [
      // <menu-group:maintenance>
      {
        type: "submenu",
        label: "Requests",
        icon: "fa fa-circle-o",
        roles: [],
        items: [
          {
            label: "Add New Request",
            href: (routes) => `${routes.digitenant}/maintenancerequests/profile`,
            roles: []
          },
          {
            label: "Manage Requests",
            href: (routes) => `${routes.digitenant}/maintenancerequests/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Requests",
            href: (routes) => `${routes.digitenant}/maintenancerequests/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Requests",
            href: (routes) => `${routes.digitenant}/maintenancerequests/import`,
            roles: []
          }
        ]
      },
      {
        type: "submenu",
        label: "Vendors",
        icon: "fa fa-handshake-o",
        roles: [],
        items: [
          {
            label: "Add New Vendor",
            href: (routes) => `${routes.digitenant}/maintenancevendors/profile`,
            roles: []
          },
          {
            label: "Manage Vendors",
            href: (routes) => `${routes.digitenant}/maintenancevendors/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Vendors",
            href: (routes) => `${routes.digitenant}/maintenancevendors/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Vendors",
            href: (routes) => `${routes.digitenant}/maintenancevendors/import`,
            roles: []
          }
        ]
      },
      // </menu-group:maintenance>
    ]
  },

  // ============================================================
  // UTILITIES  (menu group - added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Utilities",
    icon: "fa fa-file-text",
    roles: [],
    items: [
      // <menu-group:utility>
      {
        type: "submenu",
        label: "Meters",
        icon: "fa fa-circle-o",
        roles: [],
        items: [
          {
            label: "Add New Meter",
            href: (routes) => `${routes.digitenant}/utilitiesmeters/profile`,
            roles: []
          },
          {
            label: "Manage Meters",
            href: (routes) => `${routes.digitenant}/utilitiesmeters/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Meters",
            href: (routes) => `${routes.digitenant}/utilitiesmeters/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Meters",
            href: (routes) => `${routes.digitenant}/utilitiesmeters/import`,
            roles: []
          }
        ]
      },
      {
        type: "submenu",
        label: "Readings",
        icon: "fa fa-circle-o",
        roles: [],
        items: [
          {
            label: "Add New Reading",
            href: (routes) => `${routes.digitenant}/utilitiesreadings/profile`,
            roles: []
          },
          {
            label: "Manage Readings",
            href: (routes) => `${routes.digitenant}/utilitiesreadings/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Readings",
            href: (routes) => `${routes.digitenant}/utilitiesreadings/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Readings",
            href: (routes) => `${routes.digitenant}/utilitiesreadings/import`,
            roles: []
          }
        ]
      },
      // </menu-group:utility>
    ]
  },

  // ============================================================
  // EXPENSES  (menu group - added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "Expenses",
    icon: "fa fa-money",
    roles: [],
    items: [
      // <menu-group:expense>
      {
        type: "submenu",
        label: "List",
        icon: "fa fa-money",
        roles: [],
        items: [
          {
            label: "Add New List",
            href: (routes) => `${routes.digitenant}/expenseslist/profile`,
            roles: []
          },
          {
            label: "Manage List",
            href: (routes) => `${routes.digitenant}/expenseslist/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View List",
            href: (routes) => `${routes.digitenant}/expenseslist/list?setgv=table`,
            roles: []
          },
          {
            label: "Import List",
            href: (routes) => `${routes.digitenant}/expenseslist/import`,
            roles: []
          }
        ]
      },
      {
        type: "submenu",
        label: "Categories",
        icon: "fa fa-tags",
        roles: [],
        items: [
          {
            label: "Add New Category",
            href: (routes) => `${routes.digitenant}/expensescategories/profile`,
            roles: []
          },
          {
            label: "Manage Categories",
            href: (routes) => `${routes.digitenant}/expensescategories/list?setgv=sheet`,
            roles: []
          },
          {
            label: "View Categories",
            href: (routes) => `${routes.digitenant}/expensescategories/list?setgv=table`,
            roles: []
          },
          {
            label: "Import Categories",
            href: (routes) => `${routes.digitenant}/expensescategories/import`,
            roles: []
          }
        ]
      },
      // </menu-group:expense>
    ]
  },

  // ============================================================
  // REPORTS  (added by gen-report.js)
  // ============================================================

  {
    type: "submenu",
    label: "Reports",
    icon: "fa fa-bar-chart",
    roles: [],
    items: [

      {
        type: "submenu",
        label: "Rent",
        roles: [],
        items: [
          {
            label: "Rent Collections",
            href: (routes) => `${routes.digitenant}/reports/rent/collections/list`,
            roles: []
          },
          {
            label: "Billed vs Collected",
            href: (routes) => `${routes.digitenant}/reports/rent/billing/list`,
            roles: []
          },
          {
            label: "Payment Methods",
            href: (routes) => `${routes.digitenant}/reports/rent/methods/list`,
            roles: []
          },
          {
            label: "Rent Status by Tenant",
            href: (routes) => `${routes.digitenant}/reports/rent/status/list`,
            roles: []
          }
          // gen-report:group:rent:end
        ]
      },
      {
        type: "submenu",
        label: "Arrears",
        roles: [],
        items: [
          {
            label: "Arrears by Tenant",
            href: (routes) => `${routes.digitenant}/reports/arrears/tenants/list`,
            roles: []
          },
          {
            label: "Arrears by Property",
            href: (routes) => `${routes.digitenant}/reports/arrears/properties/list`,
            roles: []
          }
          // gen-report:group:arrears:end
        ]
      },
      {
        type: "submenu",
        label: "Income",
        roles: [],
        items: [
          {
            label: "Income by Property",
            href: (routes) => `${routes.digitenant}/reports/income/properties/list`,
            roles: []
          },
          {
            label: "Income by Landlord",
            href: (routes) => `${routes.digitenant}/reports/income/landlords/list`,
            roles: []
          }
          // gen-report:group:income:end
        ]
      },
      {
        type: "submenu",
        label: "Landlords",
        roles: [],
        items: [
          {
            label: "Landlord Statement",
            href: (routes) => `${routes.digitenant}/reports/landlords/statement/list`,
            roles: []
          },
          {
            label: "Landlord Cash Statement",
            href: (routes) => `${routes.digitenant}/reports/landlords/cash/list`,
            roles: []
          },
          {
            label: "Cash by Property",
            href: (routes) => `${routes.digitenant}/reports/landlords/properties/list`,
            roles: []
          }
          // gen-report:group:landlords:end
        ]
      },
      {
        type: "submenu",
        label: "Tenants",
        roles: [],
        items: [
          {
            label: "Lease Expiries",
            href: (routes) => `${routes.digitenant}/reports/tenants/expiries/list`,
            roles: []
          }
          // gen-report:group:tenants:end
        ]
      },
      {
        type: "submenu",
        label: "Maintenance",
        roles: [],
        items: [
          {
            label: "Maintenance by Category",
            href: (routes) => `${routes.digitenant}/reports/maintenance/categories/list`,
            roles: []
          },
          {
            label: "Maintenance by Vendor",
            href: (routes) => `${routes.digitenant}/reports/maintenance/vendors/list`,
            roles: []
          }
          // gen-report:group:maintenance:end
        ]
      }
      // gen-report:reports:end

    ]
  },
  // ============================================================
  // SYSTEM USERS  (added by clone-module.js)
  // ============================================================

  {
    type: "submenu",
    label: "System users",
    icon: "fa fa-user",
    roles: [],
    items: [

      {
        label: "Add New System user",
        href: (routes) => `${routes.digitenant}/systemusers/profile`,
        roles: []
      },
      {
        label: "Manage System users",
        href: (routes) => `${routes.digitenant}/systemusers/list?setgv=sheet`,
        roles: []
      },
      {
        label: "View System users",
        href: (routes) => `${routes.digitenant}/systemusers/list?setgv=table`,
        roles: []
      },
      {
        label: "Import System users",
        href: (routes) => `${routes.digitenant}/systemusers/import`,
        roles: []
      }

    ]
  }
];
