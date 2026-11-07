'use client';
import { RentitemsSchema } from '../RentitemsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import RentitemsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function RentitemsList() {
//   return <SmartGrid moduleActions={RentitemsActions} schema={RentitemsSchema} title="Rentitems" />;
// }PaidInvoicesSchema.label
export default function RentitemsList({
  fixedQuery = {},
  dataOut = {},
  title = RentitemsSchema.label,
  description = `${RentitemsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = RentitemsActions,
  schema = RentitemsSchema,
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