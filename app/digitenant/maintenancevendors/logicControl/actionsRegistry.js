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
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { MaintenancerequestsSchema } from "../../maintenancerequests/MaintenancerequestsSchema";
// </auto-relations:imports>


const MaintenancevendorsActions = {
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
  add_maintenancevendors_maintenancerequests: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.vendor_id) return;
    const fk = MaintenancerequestsSchema.fields?.find((f) => f.key === 'vendor_id');
    openEntityCreateModal({
      ProfileComponent: MaintenancerequestsProfile,
      schema: MaintenancerequestsSchema,
      title: `New Maintenance request — ${row.vendor_name || row.vendor_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'vendor_id', destKey: 'vendor_id', destSchema: MaintenancerequestsSchema, labelValue: row.vendor_name },
        ]),
      },
      lockedFields: ['vendor_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_maintenancevendors_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_maintenancevendors_specialty_type: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by specialty type',
    columnKey: 'specialty_type',
    combine: true,
  }),

  filter_maintenancevendors_vendor_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by vendor status',
    columnKey: 'vendor_status',
    combine: true,
  }),

  view_maintenancevendors_maintenancerequests: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.vendor_id) return;
    const { default: MaintenancerequestsList } = await import('../../maintenancerequests/uiControl/MaintenancerequestsList');
    const fixedQuery = { vendorId: btoa(row.vendor_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/maintenancerequests/list?${new URLSearchParams({ maintenance_requests_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(MaintenancerequestsList, {
        customProfilePath: '../maintenancerequests/profile',
        title: `Maintenance requests — ${row.vendor_name || row.vendor_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default MaintenancevendorsActions
