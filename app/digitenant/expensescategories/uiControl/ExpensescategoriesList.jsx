'use client';
import { ExpensescategoriesSchema } from '../ExpensescategoriesSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import ExpensescategoriesActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function ExpensescategoriesList() {
//   return <SmartGrid moduleActions={ExpensescategoriesActions} schema={ExpensescategoriesSchema} title="Expensescategories" />;
// }PaidInvoicesSchema.label
export default function ExpensescategoriesList({
  fixedQuery = {},
  dataOut = {},
  title = ExpensescategoriesSchema.label,
  description = `${ExpensescategoriesSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = ExpensescategoriesActions,
  schema = ExpensescategoriesSchema,
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