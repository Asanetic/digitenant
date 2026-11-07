'use client';
import { RentinvoicesSchema } from '../RentinvoicesSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import RentinvoicesActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function RentinvoicesList() {
//   return <SmartGrid moduleActions={RentinvoicesActions} schema={RentinvoicesSchema} title="Rentinvoices" />;
// }PaidInvoicesSchema.label
export default function RentinvoicesList({
  fixedQuery = {},
  dataOut = {},
  title = RentinvoicesSchema.label,
  description = `${RentinvoicesSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = RentinvoicesActions,
  schema = RentinvoicesSchema,
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