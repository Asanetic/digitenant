'use client';
import { UtilitiesreadingsSchema } from '../UtilitiesreadingsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import UtilitiesreadingsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function UtilitiesreadingsList() {
//   return <SmartGrid moduleActions={UtilitiesreadingsActions} schema={UtilitiesreadingsSchema} title="Utilitiesreadings" />;
// }PaidInvoicesSchema.label
export default function UtilitiesreadingsList({
  fixedQuery = {},
  dataOut = {},
  title = UtilitiesreadingsSchema.label,
  description = `${UtilitiesreadingsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = UtilitiesreadingsActions,
  schema = UtilitiesreadingsSchema,
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