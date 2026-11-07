'use client';
import { TenantslistSchema } from '../TenantslistSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import TenantslistActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function TenantslistList() {
//   return <SmartGrid moduleActions={TenantslistActions} schema={TenantslistSchema} title="Tenantslist" />;
// }PaidInvoicesSchema.label
export default function TenantslistList({
  fixedQuery = {},
  dataOut = {},
  title = TenantslistSchema.label,
  description = `${TenantslistSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = TenantslistActions,
  schema = TenantslistSchema,
  hiddenActions=[],

}) {
  return (
    <GridViewSwitcher
      table={SmartGridClean}
      sheet={ExcelSheetGrid}
      start="table"
      moduleActions={moduleActions}
      schema={schema}
      title={title}
      description={description}
      customProfilePath={customProfilePath}
      fixedQuery={fixedQuery}
      dataOut={dataOut}
      hiddenActions={hiddenActions}
    />
  );
}