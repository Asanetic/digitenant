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
import ExpenseslistProfile from "../../expenseslist/uiControl/ExpenseslistProfile";
import PropertiespayoutsProfile from "../../propertiespayouts/uiControl/PropertiespayoutsProfile";
import PropertiesunitsProfile from "../../propertiesunits/uiControl/PropertiesunitsProfile";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { PropertieslandlordsSchema } from "../../propertieslandlords/PropertieslandlordsSchema";
import { ExpenseslistSchema } from "../../expenseslist/ExpenseslistSchema";
import { PropertiespayoutsSchema } from "../../propertiespayouts/PropertiespayoutsSchema";
import { PropertiesunitsSchema } from "../../propertiesunits/PropertiesunitsSchema";
// </auto-relations:imports>


const PropertieslistActions = {
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
  add_propertieslist_expenseslist: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.property_id) return;
    const fk = ExpenseslistSchema.fields?.find((f) => f.key === 'property_id');
    openEntityCreateModal({
      ProfileComponent: ExpenseslistProfile,
      schema: ExpenseslistSchema,
      title: `New Expenses list — ${row.property_name || row.property_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'property_id', destKey: 'property_id', destSchema: ExpenseslistSchema, labelValue: row.property_name },
        ]),
      },
      lockedFields: ['property_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_propertieslist_propertiespayouts: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.property_id) return;
    const fk = PropertiespayoutsSchema.fields?.find((f) => f.key === 'property_id');
    // other FKs this row shares with the form: carried over only when the row has a value, else left for the user to pick
    const carried = [
      { column: 'landlord_id', mirrors: [] },
    ].filter(({ column }) => row[column] !== undefined && row[column] !== null && row[column] !== '');
    const carriedPreset = {};
    const carriedLocked = [];
    carried.forEach(({ column, mirrors }) => {
      const labelKey = PropertiespayoutsSchema.fields?.find((f) => f.key === column)?.labelKey;
      const copies = [labelKey, ...mirrors].filter((k) => k && row[k] !== undefined);
      carriedPreset[column] = row[column];
      copies.forEach((k) => { carriedPreset[k] = row[k]; });
      carriedLocked.push(column, ...new Set([...(labelKey ? [labelKey] : []), ...copies]));
    });
    openEntityCreateModal({
      ProfileComponent: PropertiespayoutsProfile,
      schema: PropertiespayoutsSchema,
      title: `New Properties payout — ${row.property_name || row.property_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'property_id', destKey: 'property_id', destSchema: PropertiespayoutsSchema, labelValue: row.property_name },
        ]),
        ...carriedPreset,
      },
      lockedFields: ['property_id', fk?.labelKey, ...carriedLocked].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_propertieslist_propertiesunits: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.property_id) return;
    const fk = PropertiesunitsSchema.fields?.find((f) => f.key === 'property_id');
    openEntityCreateModal({
      ProfileComponent: PropertiesunitsProfile,
      schema: PropertiesunitsSchema,
      title: `New Properties unit — ${row.property_name || row.property_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'property_id', destKey: 'property_id', destSchema: PropertiesunitsSchema, labelValue: row.property_name },
        ]),
      },
      lockedFields: ['property_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_propertieslist_propertieslandlords: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by properties landlord',
    searchSchema: PropertieslandlordsSchema,
    displayField: 'landlord_name',
    valueField: 'landlord_id',
    localColumnKey: 'landlord_id',
    combine: true,
  }),

  filter_propertieslist_property_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by property status',
    columnKey: 'property_status',
    combine: true,
  }),

  filter_propertieslist_property_type: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by property type',
    columnKey: 'property_type',
    combine: true,
  }),

  filter_propertieslist_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  view_propertieslist_expenseslist: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.property_id) return;
    const { default: ExpenseslistList } = await import('../../expenseslist/uiControl/ExpenseslistList');
    const fixedQuery = { propertyId: btoa(row.property_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/expenseslist/list?${new URLSearchParams({ expenses_list_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(ExpenseslistList, {
        customProfilePath: '../expenseslist/profile',
        title: `Expenses list — ${row.property_name || row.property_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_propertieslist_propertieslandlords_profile: async ({ rows, router }) => {
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

  view_propertieslist_propertiespayouts: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.property_id) return;
    const { default: PropertiespayoutsList } = await import('../../propertiespayouts/uiControl/PropertiespayoutsList');
    const fixedQuery = { propertyId: btoa(row.property_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/propertiespayouts/list?${new URLSearchParams({ properties_payouts_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(PropertiespayoutsList, {
        customProfilePath: '../propertiespayouts/profile',
        title: `Properties payouts — ${row.property_name || row.property_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_propertieslist_propertiesunits: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.property_id) return;
    const { default: PropertiesunitsList } = await import('../../propertiesunits/uiControl/PropertiesunitsList');
    const fixedQuery = { propertyId: btoa(row.property_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/propertiesunits/list?${new URLSearchParams({ properties_units_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(PropertiesunitsList, {
        customProfilePath: '../propertiesunits/profile',
        title: `Properties units — ${row.property_name || row.property_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default PropertieslistActions
