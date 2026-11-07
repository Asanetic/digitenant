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
import UtilitiesreadingsProfile from "../../utilitiesreadings/uiControl/UtilitiesreadingsProfile";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { PropertiesunitsSchema } from "../../propertiesunits/PropertiesunitsSchema";
import { UtilitiesreadingsSchema } from "../../utilitiesreadings/UtilitiesreadingsSchema";
// </auto-relations:imports>


const UtilitiesmetersActions = {
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
  add_utilitiesmeters_utilitiesreadings: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.meter_id) return;
    const fk = UtilitiesreadingsSchema.fields?.find((f) => f.key === 'meter_id');
    openEntityCreateModal({
      ProfileComponent: UtilitiesreadingsProfile,
      schema: UtilitiesreadingsSchema,
      title: `New Utilities reading — ${row.meter_number || row.meter_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'meter_id', destKey: 'meter_id', destSchema: UtilitiesreadingsSchema, labelValue: row.meter_number },
        ]),
      },
      lockedFields: ['meter_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_utilitiesmeters_meter_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by meter status',
    columnKey: 'meter_status',
    combine: true,
  }),

  filter_utilitiesmeters_propertiesunits: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by properties unit',
    searchSchema: PropertiesunitsSchema,
    displayField: 'unit_name',
    valueField: 'unit_id',
    localColumnKey: 'unit_id',
    combine: true,
  }),

  filter_utilitiesmeters_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_utilitiesmeters_utility_type: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by utility type',
    columnKey: 'utility_type',
    combine: true,
  }),

  view_utilitiesmeters_propertiesunits_profile: async ({ rows, router }) => {
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

  view_utilitiesmeters_utilitiesreadings: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.meter_id) return;
    const { default: UtilitiesreadingsList } = await import('../../utilitiesreadings/uiControl/UtilitiesreadingsList');
    const fixedQuery = { meterId: btoa(row.meter_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/utilitiesreadings/list?${new URLSearchParams({ utilities_readings_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(UtilitiesreadingsList, {
        customProfilePath: '../utilitiesreadings/profile',
        title: `Utilities readings — ${row.meter_number || row.meter_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default UtilitiesmetersActions
