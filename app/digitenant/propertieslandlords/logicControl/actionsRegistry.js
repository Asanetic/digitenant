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
import PropertieslistProfile from "../../propertieslist/uiControl/PropertieslistProfile";
import PropertiespayoutsProfile from "../../propertiespayouts/uiControl/PropertiespayoutsProfile";
import RentinvoicesProfile from "../../rentinvoices/uiControl/RentinvoicesProfile";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { PropertieslistSchema } from "../../propertieslist/PropertieslistSchema";
import { PropertiespayoutsSchema } from "../../propertiespayouts/PropertiespayoutsSchema";
import { RentinvoicesSchema } from "../../rentinvoices/RentinvoicesSchema";
// </auto-relations:imports>


const PropertieslandlordsActions = {
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
  add_propertieslandlords_propertieslist: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.landlord_id) return;
    const fk = PropertieslistSchema.fields?.find((f) => f.key === 'landlord_id');
    openEntityCreateModal({
      ProfileComponent: PropertieslistProfile,
      schema: PropertieslistSchema,
      title: `New Properties list — ${row.landlord_name || row.landlord_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'landlord_id', destKey: 'landlord_id', destSchema: PropertieslistSchema, labelValue: row.landlord_name },
        ]),
      },
      lockedFields: ['landlord_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_propertieslandlords_propertiespayouts: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.landlord_id) return;
    const fk = PropertiespayoutsSchema.fields?.find((f) => f.key === 'landlord_id');
    openEntityCreateModal({
      ProfileComponent: PropertiespayoutsProfile,
      schema: PropertiespayoutsSchema,
      title: `New Properties payout — ${row.landlord_name || row.landlord_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'landlord_id', destKey: 'landlord_id', destSchema: PropertiespayoutsSchema, labelValue: row.landlord_name },
        ]),
      },
      lockedFields: ['landlord_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_propertieslandlords_rentinvoices: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.landlord_id) return;
    const fk = RentinvoicesSchema.fields?.find((f) => f.key === 'landlord_id');
    openEntityCreateModal({
      ProfileComponent: RentinvoicesProfile,
      schema: RentinvoicesSchema,
      title: `New Rent invoice — ${row.landlord_name || row.landlord_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'landlord_id', destKey: 'landlord_id', destSchema: RentinvoicesSchema, labelValue: row.landlord_name },
        ]),
      },
      lockedFields: ['landlord_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_propertieslandlords_landlord_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by landlord status',
    columnKey: 'landlord_status',
    combine: true,
  }),

  filter_propertieslandlords_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  view_propertieslandlords_propertieslist: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.landlord_id) return;
    const { default: PropertieslistList } = await import('../../propertieslist/uiControl/PropertieslistList');
    const fixedQuery = { landlordId: btoa(row.landlord_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/propertieslist/list?${new URLSearchParams({ properties_list_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(PropertieslistList, {
        customProfilePath: '../propertieslist/profile',
        title: `Properties list — ${row.landlord_name || row.landlord_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_propertieslandlords_propertiespayouts: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.landlord_id) return;
    const { default: PropertiespayoutsList } = await import('../../propertiespayouts/uiControl/PropertiespayoutsList');
    const fixedQuery = { landlordId: btoa(row.landlord_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/propertiespayouts/list?${new URLSearchParams({ properties_payouts_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(PropertiespayoutsList, {
        customProfilePath: '../propertiespayouts/profile',
        title: `Properties payouts — ${row.landlord_name || row.landlord_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_propertieslandlords_rentinvoices: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.landlord_id) return;
    const { default: RentinvoicesList } = await import('../../rentinvoices/uiControl/RentinvoicesList');
    const fixedQuery = { landlordId: btoa(row.landlord_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/rentinvoices/list?${new URLSearchParams({ rent_invoices_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(RentinvoicesList, {
        customProfilePath: '../rentinvoices/profile',
        title: `Rent invoices — ${row.landlord_name || row.landlord_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default PropertieslandlordsActions
