'use client';
import { TenantsleasesSchema } from '../TenantsleasesSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import TenantsleasesActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function TenantsleasesList() {
//   return <SmartGrid moduleActions={TenantsleasesActions} schema={TenantsleasesSchema} title="Tenantsleases" />;
// }PaidInvoicesSchema.label
export default function TenantsleasesList({
  fixedQuery = {},
  dataOut = {},
  title = TenantsleasesSchema.label,
  description = `${TenantsleasesSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = TenantsleasesActions,
  schema = TenantsleasesSchema,
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