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
import RentinvoicesProfile from "../../rentinvoices/uiControl/RentinvoicesProfile";
import RentpaymentsProfile from "../../rentpayments/uiControl/RentpaymentsProfile";
import TenantsleasesProfile from "../../tenantsleases/uiControl/TenantsleasesProfile";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { MaintenancerequestsSchema } from "../../maintenancerequests/MaintenancerequestsSchema";
import { RentinvoicesSchema } from "../../rentinvoices/RentinvoicesSchema";
import { RentpaymentsSchema } from "../../rentpayments/RentpaymentsSchema";
import { TenantsleasesSchema } from "../../tenantsleases/TenantsleasesSchema";
// </auto-relations:imports>


const TenantslistActions = {
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
  add_tenantslist_maintenancerequests: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.tenant_id) return;
    const fk = MaintenancerequestsSchema.fields?.find((f) => f.key === 'tenant_id');
    openEntityCreateModal({
      ProfileComponent: MaintenancerequestsProfile,
      schema: MaintenancerequestsSchema,
      title: `New Maintenance request — ${row.tenant_name || row.tenant_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'tenant_id', destKey: 'tenant_id', destSchema: MaintenancerequestsSchema, labelValue: row.tenant_name },
        ]),
      },
      lockedFields: ['tenant_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_tenantslist_rentinvoices: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.tenant_id) return;
    const fk = RentinvoicesSchema.fields?.find((f) => f.key === 'tenant_id');
    openEntityCreateModal({
      ProfileComponent: RentinvoicesProfile,
      schema: RentinvoicesSchema,
      title: `New Rent invoice — ${row.tenant_name || row.tenant_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'tenant_id', destKey: 'tenant_id', destSchema: RentinvoicesSchema, labelValue: row.tenant_name },
        ]),
      },
      lockedFields: ['tenant_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_tenantslist_rentpayments: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.tenant_id) return;
    const fk = RentpaymentsSchema.fields?.find((f) => f.key === 'tenant_id');
    openEntityCreateModal({
      ProfileComponent: RentpaymentsProfile,
      schema: RentpaymentsSchema,
      title: `New Rent payment — ${row.tenant_name || row.tenant_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'tenant_id', destKey: 'tenant_id', destSchema: RentpaymentsSchema, labelValue: row.tenant_name },
        ]),
      },
      lockedFields: ['tenant_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_tenantslist_tenantsleases: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.tenant_id) return;
    const fk = TenantsleasesSchema.fields?.find((f) => f.key === 'tenant_id');
    openEntityCreateModal({
      ProfileComponent: TenantsleasesProfile,
      schema: TenantsleasesSchema,
      title: `New Tenants lease — ${row.tenant_name || row.tenant_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'tenant_id', destKey: 'tenant_id', destSchema: TenantsleasesSchema, labelValue: row.tenant_name },
        ]),
      },
      lockedFields: ['tenant_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_tenantslist_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_tenantslist_tenant_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by tenant status',
    columnKey: 'tenant_status',
    combine: true,
  }),

  view_tenantslist_maintenancerequests: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.tenant_id) return;
    const { default: MaintenancerequestsList } = await import('../../maintenancerequests/uiControl/MaintenancerequestsList');
    const fixedQuery = { tenantId: btoa(row.tenant_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/maintenancerequests/list?${new URLSearchParams({ maintenance_requests_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(MaintenancerequestsList, {
        customProfilePath: '../maintenancerequests/profile',
        title: `Maintenance requests — ${row.tenant_name || row.tenant_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_tenantslist_rentinvoices: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.tenant_id) return;
    const { default: RentinvoicesList } = await import('../../rentinvoices/uiControl/RentinvoicesList');
    const fixedQuery = { tenantId: btoa(row.tenant_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/rentinvoices/list?${new URLSearchParams({ rent_invoices_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(RentinvoicesList, {
        customProfilePath: '../rentinvoices/profile',
        title: `Rent invoices — ${row.tenant_name || row.tenant_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_tenantslist_rentpayments: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.tenant_id) return;
    const { default: RentpaymentsList } = await import('../../rentpayments/uiControl/RentpaymentsList');
    const fixedQuery = { tenantId: btoa(row.tenant_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/rentpayments/list?${new URLSearchParams({ rent_payments_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(RentpaymentsList, {
        customProfilePath: '../rentpayments/profile',
        title: `Rent payments — ${row.tenant_name || row.tenant_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_tenantslist_tenantsleases: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.tenant_id) return;
    const { default: TenantsleasesList } = await import('../../tenantsleases/uiControl/TenantsleasesList');
    const fixedQuery = { tenantId: btoa(row.tenant_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/tenantsleases/list?${new URLSearchParams({ tenants_leases_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(TenantsleasesList, {
        customProfilePath: '../tenantsleases/profile',
        title: `Tenants leases — ${row.tenant_name || row.tenant_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default TenantslistActions
