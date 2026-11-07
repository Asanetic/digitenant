'use client';
import { ExpenseslistSchema } from '../ExpenseslistSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import ExpenseslistActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function ExpenseslistList() {
//   return <SmartGrid moduleActions={ExpenseslistActions} schema={ExpenseslistSchema} title="Expenseslist" />;
// }PaidInvoicesSchema.label
export default function ExpenseslistList({
  fixedQuery = {},
  dataOut = {},
  title = ExpenseslistSchema.label,
  description = `${ExpenseslistSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = ExpenseslistActions,
  schema = ExpenseslistSchema,
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