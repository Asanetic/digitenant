'use client';
import { MaintenancevendorsSchema } from '../MaintenancevendorsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import MaintenancevendorsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function MaintenancevendorsList() {
//   return <SmartGrid moduleActions={MaintenancevendorsActions} schema={MaintenancevendorsSchema} title="Maintenancevendors" />;
// }PaidInvoicesSchema.label
export default function MaintenancevendorsList({
  fixedQuery = {},
  dataOut = {},
  title = MaintenancevendorsSchema.label,
  description = `${MaintenancevendorsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = MaintenancevendorsActions,
  schema = MaintenancevendorsSchema,
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