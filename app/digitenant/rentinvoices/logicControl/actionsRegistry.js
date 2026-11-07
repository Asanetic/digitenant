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
import RentitemsProfile from "../../rentitems/uiControl/RentitemsProfile";
import RentpaymentsProfile from "../../rentpayments/uiControl/RentpaymentsProfile";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { PropertieslandlordsSchema } from "../../propertieslandlords/PropertieslandlordsSchema";
import { PropertieslistSchema } from "../../propertieslist/PropertieslistSchema";
import { PropertiesunitsSchema } from "../../propertiesunits/PropertiesunitsSchema";
import { TenantsleasesSchema } from "../../tenantsleases/TenantsleasesSchema";
import { TenantslistSchema } from "../../tenantslist/TenantslistSchema";
import { RentitemsSchema } from "../../rentitems/RentitemsSchema";
import { RentpaymentsSchema } from "../../rentpayments/RentpaymentsSchema";
// </auto-relations:imports>


const RentinvoicesActions = {
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
  add_rentinvoices_rentitems: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.invoice_id) return;
    const fk = RentitemsSchema.fields?.find((f) => f.key === 'invoice_id');
    openEntityCreateModal({
      ProfileComponent: RentitemsProfile,
      schema: RentitemsSchema,
      title: `New Rent item — ${row.invoice_id || row.invoice_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'invoice_id', destKey: 'invoice_id', destSchema: RentitemsSchema, labelValue: row.invoice_id },
        ]),
      },
      lockedFields: ['invoice_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_rentinvoices_rentpayments: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.invoice_id) return;
    const fk = RentpaymentsSchema.fields?.find((f) => f.key === 'invoice_id');
    // other FKs this row shares with the form: carried over only when the row has a value, else left for the user to pick
    const carried = [
      { column: 'tenant_id', mirrors: [] },
      { column: 'property_id', mirrors: [] },
    ].filter(({ column }) => row[column] !== undefined && row[column] !== null && row[column] !== '');
    const carriedPreset = {};
    const carriedLocked = [];
    carried.forEach(({ column, mirrors }) => {
      const labelKey = RentpaymentsSchema.fields?.find((f) => f.key === column)?.labelKey;
      const copies = [labelKey, ...mirrors].filter((k) => k && row[k] !== undefined);
      carriedPreset[column] = row[column];
      copies.forEach((k) => { carriedPreset[k] = row[k]; });
      carriedLocked.push(column, ...new Set([...(labelKey ? [labelKey] : []), ...copies]));
    });
    openEntityCreateModal({
      ProfileComponent: RentpaymentsProfile,
      schema: RentpaymentsSchema,
      title: `New Rent payment — ${row.invoice_id || row.invoice_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'invoice_id', destKey: 'invoice_id', destSchema: RentpaymentsSchema, labelValue: row.invoice_id },
        ]),
        ...carriedPreset,
      },
      lockedFields: ['invoice_id', fk?.labelKey, ...carriedLocked].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_rentinvoices_billing_period: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by billing period',
    columnKey: 'billing_period',
    combine: true,
  }),

  filter_rentinvoices_due_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by due date',
    columnKey: 'due_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_rentinvoices_invoice_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by invoice date',
    columnKey: 'invoice_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_rentinvoices_invoice_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by invoice status',
    columnKey: 'invoice_status',
    combine: true,
  }),

  filter_rentinvoices_propertieslandlords: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by properties landlord',
    searchSchema: PropertieslandlordsSchema,
    displayField: 'landlord_name',
    valueField: 'landlord_id',
    localColumnKey: 'landlord_id',
    combine: true,
  }),

  filter_rentinvoices_propertieslist: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by properties list',
    searchSchema: PropertieslistSchema,
    displayField: 'property_name',
    valueField: 'property_id',
    localColumnKey: 'property_id',
    combine: true,
  }),

  filter_rentinvoices_propertiesunits: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by properties unit',
    searchSchema: PropertiesunitsSchema,
    displayField: 'unit_name',
    valueField: 'unit_id',
    localColumnKey: 'unit_id',
    combine: true,
  }),

  filter_rentinvoices_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_rentinvoices_tenantsleases: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by tenants lease',
    searchSchema: TenantsleasesSchema,
    displayField: 'lease_id',
    valueField: 'lease_id',
    localColumnKey: 'lease_id',
    combine: true,
  }),

  filter_rentinvoices_tenantslist: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by tenants list',
    searchSchema: TenantslistSchema,
    displayField: 'tenant_name',
    valueField: 'tenant_id',
    localColumnKey: 'tenant_id',
    combine: true,
  }),

  view_rentinvoices_propertieslandlords_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.landlord_id) return;
    const { default: PropertieslandlordsList } = await import('../../propertieslandlords/uiControl/PropertieslandlordsList');
    const fixedQuery = { landlordId: btoa(row.landlord_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/propertieslandlords/list?${new URLSearchParams({ properties_landlords_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(PropertieslandlordsList, {
        customProfilePath: '../propertieslandlords/profile',
        title: `Properties landlord — ${row.landlord_name || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_rentinvoices_propertieslist_profile: async ({ rows, router }) => {
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

  view_rentinvoices_propertiesunits_profile: async ({ rows, router }) => {
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

  view_rentinvoices_rentitems: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.invoice_id) return;
    const { default: RentitemsList } = await import('../../rentitems/uiControl/RentitemsList');
    const fixedQuery = { invoiceId: btoa(row.invoice_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/rentitems/list?${new URLSearchParams({ rent_items_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(RentitemsList, {
        customProfilePath: '../rentitems/profile',
        title: `Rent items — ${row.invoice_id || row.invoice_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_rentinvoices_rentpayments: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.invoice_id) return;
    const { default: RentpaymentsList } = await import('../../rentpayments/uiControl/RentpaymentsList');
    const fixedQuery = { invoiceId: btoa(row.invoice_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/rentpayments/list?${new URLSearchParams({ rent_payments_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(RentpaymentsList, {
        customProfilePath: '../rentpayments/profile',
        title: `Rent payments — ${row.invoice_id || row.invoice_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_rentinvoices_tenantsleases_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.lease_id) return;
    const { default: TenantsleasesList } = await import('../../tenantsleases/uiControl/TenantsleasesList');
    const fixedQuery = { leaseId: btoa(row.lease_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/tenantsleases/list?${new URLSearchParams({ tenants_leases_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(TenantsleasesList, {
        customProfilePath: '../tenantsleases/profile',
        title: `Tenants lease — ${row.lease_id_2 || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_rentinvoices_tenantslist_profile: async ({ rows, router }) => {
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


export default RentinvoicesActions
