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
import RentinvoicesProfile from "../../rentinvoices/uiControl/RentinvoicesProfile";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { PropertiesunitsSchema } from "../../propertiesunits/PropertiesunitsSchema";
import { TenantslistSchema } from "../../tenantslist/TenantslistSchema";
import { RentinvoicesSchema } from "../../rentinvoices/RentinvoicesSchema";
// </auto-relations:imports>


const TenantsleasesActions = {
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
  add_tenantsleases_rentinvoices: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.lease_id) return;
    const fk = RentinvoicesSchema.fields?.find((f) => f.key === 'lease_id');
    // other FKs this row shares with the form: carried over only when the row has a value, else left for the user to pick
    const carried = [
      { column: 'tenant_id', mirrors: [] },
    ].filter(({ column }) => row[column] !== undefined && row[column] !== null && row[column] !== '');
    const carriedPreset = {};
    const carriedLocked = [];
    carried.forEach(({ column, mirrors }) => {
      const labelKey = RentinvoicesSchema.fields?.find((f) => f.key === column)?.labelKey;
      const copies = [labelKey, ...mirrors].filter((k) => k && row[k] !== undefined);
      carriedPreset[column] = row[column];
      copies.forEach((k) => { carriedPreset[k] = row[k]; });
      carriedLocked.push(column, ...new Set([...(labelKey ? [labelKey] : []), ...copies]));
    });
    openEntityCreateModal({
      ProfileComponent: RentinvoicesProfile,
      schema: RentinvoicesSchema,
      title: `New Rent invoice — ${row.lease_id || row.lease_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'lease_id', destKey: 'lease_id', destSchema: RentinvoicesSchema, labelValue: row.lease_id },
        ]),
        ...carriedPreset,
      },
      lockedFields: ['lease_id', fk?.labelKey, ...carriedLocked].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_tenantsleases_end_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by end date',
    columnKey: 'end_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_tenantsleases_lease_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by lease status',
    columnKey: 'lease_status',
    combine: true,
  }),

  filter_tenantsleases_propertiesunits: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by properties unit',
    searchSchema: PropertiesunitsSchema,
    displayField: 'unit_name',
    valueField: 'unit_id',
    localColumnKey: 'unit_id',
    combine: true,
  }),

  filter_tenantsleases_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_tenantsleases_start_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by start date',
    columnKey: 'start_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_tenantsleases_tenantslist: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by tenants list',
    searchSchema: TenantslistSchema,
    displayField: 'tenant_name',
    valueField: 'tenant_id',
    localColumnKey: 'tenant_id',
    combine: true,
  }),

  view_tenantsleases_propertiesunits_profile: async ({ rows, router }) => {
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

  view_tenantsleases_rentinvoices: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.lease_id) return;
    const { default: RentinvoicesList } = await import('../../rentinvoices/uiControl/RentinvoicesList');
    const fixedQuery = { leaseId: btoa(row.lease_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/rentinvoices/list?${new URLSearchParams({ rent_invoices_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(RentinvoicesList, {
        customProfilePath: '../rentinvoices/profile',
        title: `Rent invoices — ${row.lease_id || row.lease_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_tenantsleases_tenantslist_profile: async ({ rows, router }) => {
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


export default TenantsleasesActions
