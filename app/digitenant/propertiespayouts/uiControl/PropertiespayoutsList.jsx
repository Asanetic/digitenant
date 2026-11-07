'use client';
import { PropertiespayoutsSchema } from '../PropertiespayoutsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import PropertiespayoutsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function PropertiespayoutsList() {
//   return <SmartGrid moduleActions={PropertiespayoutsActions} schema={PropertiespayoutsSchema} title="Propertiespayouts" />;
// }PaidInvoicesSchema.label
export default function PropertiespayoutsList({
  fixedQuery = {},
  dataOut = {},
  title = PropertiespayoutsSchema.label,
  description = `${PropertiespayoutsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = PropertiespayoutsActions,
  schema = PropertiespayoutsSchema,
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