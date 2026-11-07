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
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { ExpensescategoriesSchema } from "../../expensescategories/ExpensescategoriesSchema";
import { PropertieslistSchema } from "../../propertieslist/PropertieslistSchema";
// </auto-relations:imports>


const ExpenseslistActions = {
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
  filter_expenseslist_expense_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by expense date',
    columnKey: 'expense_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_expenseslist_expensescategories: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by expenses category',
    searchSchema: ExpensescategoriesSchema,
    displayField: 'category_name',
    valueField: 'category_id',
    localColumnKey: 'category_id',
    combine: true,
  }),

  filter_expenseslist_propertieslist: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by properties list',
    searchSchema: PropertieslistSchema,
    displayField: 'property_name',
    valueField: 'property_id',
    localColumnKey: 'property_id',
    combine: true,
  }),

  filter_expenseslist_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  view_expenseslist_expensescategories_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.category_id) return;
    const { default: ExpensescategoriesList } = await import('../../expensescategories/uiControl/ExpensescategoriesList');
    const fixedQuery = { categoryId: btoa(row.category_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/digitenant/expensescategories/list?${new URLSearchParams({ expenses_categories_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(ExpensescategoriesList, {
        customProfilePath: '../expensescategories/profile',
        title: `Expenses category — ${row.category_name || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_expenseslist_propertieslist_profile: async ({ rows, router }) => {
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
  // </auto-relations:actions>
};


export default ExpenseslistActions
