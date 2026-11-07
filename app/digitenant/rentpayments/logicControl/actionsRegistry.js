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
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { PropertieslistSchema } from "../../propertieslist/PropertieslistSchema";
import { RentinvoicesSchema } from "../../rentinvoices/RentinvoicesSchema";
import { TenantslistSchema } from "../../tenantslist/TenantslistSchema";
// </auto-relations:imports>


const RentpaymentsActions = {
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
  filter_rentpayments_payment_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by payment date',
    columnKey: 'payment_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_rentpayments_payment_method: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by payment method',
    columnKey: 'payment_method',
    combine: true,
  }),

  filter_rentpayments_payment_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by payment status',
    columnKey: 'payment_status',
    combine: true,
  }),

  filter_rentpayments_propertieslist: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by properties list',
    searchSchema: PropertieslistSchema,
    displayField: 'property_name',
    valueField: 'property_id',
    localColumnKey: 'property_id',
    combine: true,
  }),

  filter_rentpayments_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_rentpayments_rentinvoices: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by rent invoice',
    searchSchema: RentinvoicesSchema,
    displayField: 'invoice_id',
    valueField: 'invoice_id',
    localColumnKey: 'invoice_id',
    combine: true,
  }),

  filter_rentpayments_tenantslist: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by tenants list',
    searchSchema: TenantslistSchema,
    displayField: 'tenant_name',
    valueField: 'tenant_id',
    localColumnKey: 'tenant_id',
    combine: true,
  }),

  view_rentpayments_propertieslist_profile: async ({ rows, router }) => {
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

  view_rentpayments_rentinvoices_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.invoice_id) return;
    const { default: RentinvoicesList } = await import('../../rentinvoices/uiControl/RentinvoicesList');
    const fixedQuery = { invoiceId: btoa(row.invoice_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/rentinvoices/list?${new URLSearchParams({ rent_invoices_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(RentinvoicesList, {
        customProfilePath: '../rentinvoices/profile',
        title: `Rent invoice — ${row.invoice_id_2 || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_rentpayments_tenantslist_profile: async ({ rows, router }) => {
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


export default RentpaymentsActions
