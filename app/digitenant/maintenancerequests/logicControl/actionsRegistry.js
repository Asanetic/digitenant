/**
 * Register real behavior here, once per action key. Both grid rowLinks
 * AND profile-level buttons (schema.profileActions) route through this
 * SAME registry — one place to add new behavior, works everywhere.
 *
 * Every registered function receives ONE ctx object instead of a fixed
 * list of positional args — see actionRegistryDocs.md (same folder) for
 * the full ctx field list and worked examples for every action shape
 * used elsewhere in this app (cross-module popups, preset create forms,
 * quick-edit modals, grid-toolbar smart filters, sending messages, etc).
 * Copy the block that matches what you're building from there.
 *
 * NOTE: "delete" and "clone" are intercepted directly by
 * useEntityFormController before they ever reach this registry — don't
 * register functions under those two keys, they will never fire.
 */

// <auto-relations:imports>
import React from 'react';
import { MosyCard } from "../../../components/MosyCard";
import ViewAllLink from "../../../components/ViewAllLink";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { MaintenancevendorsSchema } from "../../maintenancevendors/MaintenancevendorsSchema";
import { PropertiesunitsSchema } from "../../propertiesunits/PropertiesunitsSchema";
import { TenantslistSchema } from "../../tenantslist/TenantslistSchema";
// </auto-relations:imports>


const MaintenancerequestsActions = {
  // Bound by gridOptions.checkFunction in schema.js. Fires with every row
  // the user ticked in the grid's checkbox column. Swap the display-name
  // fallback chain for whatever field this module's rows actually have.
  gridCheckBoxAction: async ({ rows }) => {
    const displayName = (row) => row?.title || row?.name || row?.record_id || 'record';
    alert(`${rows.length} record(s) selected: ${rows.map(displayName).join(', ')}`);
  },

  // Add more as needed — see actionRegistryDocs.md for patterns to copy.
  // Every one of them gets whatever's on ctx: { rows, schema, router,
  // refresh, create, update, remove, filter, setFilterValue,
  // setAdvancedQuery, setDateRange, applyFilter, clearFilterValue }.

  // <auto-relations:actions>
  filter_maintenancerequests_category: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by category',
    columnKey: 'category',
    combine: true,
  }),

  filter_maintenancerequests_maintenancevendors: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by maintenance vendor',
    searchSchema: MaintenancevendorsSchema,
    displayField: 'vendor_name',
    valueField: 'vendor_id',
    localColumnKey: 'vendor_id',
    combine: true,
  }),

  filter_maintenancerequests_priority: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by priority',
    columnKey: 'priority',
    combine: true,
  }),

  filter_maintenancerequests_propertiesunits: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by properties unit',
    searchSchema: PropertiesunitsSchema,
    displayField: 'unit_name',
    valueField: 'unit_id',
    localColumnKey: 'unit_id',
    combine: true,
  }),

  filter_maintenancerequests_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_maintenancerequests_request_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by request date',
    columnKey: 'request_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_maintenancerequests_request_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by request status',
    columnKey: 'request_status',
    combine: true,
  }),

  filter_maintenancerequests_tenantslist: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by tenants list',
    searchSchema: TenantslistSchema,
    displayField: 'tenant_name',
    valueField: 'tenant_id',
    localColumnKey: 'tenant_id',
    combine: true,
  }),

  view_maintenancerequests_maintenancevendors_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.vendor_id) return;
    const { default: MaintenancevendorsList } = await import('../../maintenancevendors/uiControl/MaintenancevendorsList');
    const fixedQuery = { vendorId: btoa(row.vendor_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/maintenancevendors/list?${new URLSearchParams({ maintenance_vendors_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(MaintenancevendorsList, {
        customProfilePath: '../maintenancevendors/profile',
        title: `Maintenance vendor — ${row.vendor_name || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_maintenancerequests_propertiesunits_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.unit_id) return;
    const { default: PropertiesunitsList } = await import('../../propertiesunits/uiControl/PropertiesunitsList');
    const fixedQuery = { unitId: btoa(row.unit_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/propertiesunits/list?${new URLSearchParams({ properties_units_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(PropertiesunitsList, {
        customProfilePath: '../propertiesunits/profile',
        title: `Properties unit — ${row.unit_name || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_maintenancerequests_tenantslist_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.tenant_id) return;
    const { default: TenantslistList } = await import('../../tenantslist/uiControl/TenantslistList');
    const fixedQuery = { tenantId: btoa(row.tenant_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/tenantslist/list?${new URLSearchParams({ tenants_list_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(TenantslistList, {
        customProfilePath: '../tenantslist/profile',
        title: `Tenants list — ${row.tenant_name || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default MaintenancerequestsActions
