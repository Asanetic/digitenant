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
import { openEntityCreateModal, buildPresetFromRow } from "../../moduleControl/UiControl/EntityCreateModal";
import MaintenancerequestsProfile from "../../maintenancerequests/uiControl/MaintenancerequestsProfile";
import TenantsleasesProfile from "../../tenantsleases/uiControl/TenantsleasesProfile";
import UtilitiesmetersProfile from "../../utilitiesmeters/uiControl/UtilitiesmetersProfile";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { PropertieslistSchema } from "../../propertieslist/PropertieslistSchema";
import { MaintenancerequestsSchema } from "../../maintenancerequests/MaintenancerequestsSchema";
import { TenantsleasesSchema } from "../../tenantsleases/TenantsleasesSchema";
import { UtilitiesmetersSchema } from "../../utilitiesmeters/UtilitiesmetersSchema";
// </auto-relations:imports>


const PropertiesunitsActions = {
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
  add_propertiesunits_maintenancerequests: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.unit_id) return;
    const fk = MaintenancerequestsSchema.fields?.find((f) => f.key === 'unit_id');
    openEntityCreateModal({
      ProfileComponent: MaintenancerequestsProfile,
      schema: MaintenancerequestsSchema,
      title: `New Maintenance request — ${row.unit_name || row.unit_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'unit_id', destKey: 'unit_id', destSchema: MaintenancerequestsSchema, labelValue: row.unit_name },
        ]),
      },
      lockedFields: ['unit_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_propertiesunits_tenantsleases: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.unit_id) return;
    const fk = TenantsleasesSchema.fields?.find((f) => f.key === 'unit_id');
    openEntityCreateModal({
      ProfileComponent: TenantsleasesProfile,
      schema: TenantsleasesSchema,
      title: `New Tenants lease — ${row.unit_name || row.unit_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'unit_id', destKey: 'unit_id', destSchema: TenantsleasesSchema, labelValue: row.unit_name },
        ]),
      },
      lockedFields: ['unit_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_propertiesunits_utilitiesmeters: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.unit_id) return;
    const fk = UtilitiesmetersSchema.fields?.find((f) => f.key === 'unit_id');
    openEntityCreateModal({
      ProfileComponent: UtilitiesmetersProfile,
      schema: UtilitiesmetersSchema,
      title: `New Utilities meter — ${row.unit_name || row.unit_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'unit_id', destKey: 'unit_id', destSchema: UtilitiesmetersSchema, labelValue: row.unit_name },
        ]),
      },
      lockedFields: ['unit_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_propertiesunits_propertieslist: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by properties list',
    searchSchema: PropertieslistSchema,
    displayField: 'property_name',
    valueField: 'property_id',
    localColumnKey: 'property_id',
    combine: true,
  }),

  filter_propertiesunits_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_propertiesunits_unit_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by unit status',
    columnKey: 'unit_status',
    combine: true,
  }),

  filter_propertiesunits_unit_type: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by unit type',
    columnKey: 'unit_type',
    combine: true,
  }),

  view_propertiesunits_maintenancerequests: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.unit_id) return;
    const { default: MaintenancerequestsList } = await import('../../maintenancerequests/uiControl/MaintenancerequestsList');
    const fixedQuery = { unitId: btoa(row.unit_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/maintenancerequests/list?${new URLSearchParams({ maintenance_requests_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(MaintenancerequestsList, {
        customProfilePath: '../maintenancerequests/profile',
        title: `Maintenance requests — ${row.unit_name || row.unit_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_propertiesunits_propertieslist_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.property_id) return;
    const { default: PropertieslistList } = await import('../../propertieslist/uiControl/PropertieslistList');
    const fixedQuery = { propertyId: btoa(row.property_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/propertieslist/list?${new URLSearchParams({ properties_list_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(PropertieslistList, {
        customProfilePath: '../propertieslist/profile',
        title: `Properties list — ${row.property_name || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_propertiesunits_tenantsleases: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.unit_id) return;
    const { default: TenantsleasesList } = await import('../../tenantsleases/uiControl/TenantsleasesList');
    const fixedQuery = { unitId: btoa(row.unit_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/tenantsleases/list?${new URLSearchParams({ tenants_leases_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(TenantsleasesList, {
        customProfilePath: '../tenantsleases/profile',
        title: `Tenants leases — ${row.unit_name || row.unit_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_propertiesunits_utilitiesmeters: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.unit_id) return;
    const { default: UtilitiesmetersList } = await import('../../utilitiesmeters/uiControl/UtilitiesmetersList');
    const fixedQuery = { unitId: btoa(row.unit_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/utilitiesmeters/list?${new URLSearchParams({ utilities_meters_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(UtilitiesmetersList, {
        customProfilePath: '../utilitiesmeters/profile',
        title: `Utilities meters — ${row.unit_name || row.unit_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default PropertiesunitsActions
