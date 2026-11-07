'use client';
import { RentpaymentsSchema } from '../RentpaymentsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import RentpaymentsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function RentpaymentsList() {
//   return <SmartGrid moduleActions={RentpaymentsActions} schema={RentpaymentsSchema} title="Rentpayments" />;
// }PaidInvoicesSchema.label
export default function RentpaymentsList({
  fixedQuery = {},
  dataOut = {},
  title = RentpaymentsSchema.label,
  description = `${RentpaymentsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = RentpaymentsActions,
  schema = RentpaymentsSchema,
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