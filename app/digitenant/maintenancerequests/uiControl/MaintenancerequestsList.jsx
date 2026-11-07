'use client';
import { MaintenancerequestsSchema } from '../MaintenancerequestsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import MaintenancerequestsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function MaintenancerequestsList() {
//   return <SmartGrid moduleActions={MaintenancerequestsActions} schema={MaintenancerequestsSchema} title="Maintenancerequests" />;
// }PaidInvoicesSchema.label
export default function MaintenancerequestsList({
  fixedQuery = {},
  dataOut = {},
  title = MaintenancerequestsSchema.label,
  description = `${MaintenancerequestsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = MaintenancerequestsActions,
  schema = MaintenancerequestsSchema,
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