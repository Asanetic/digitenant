'use client';
import { PropertieslistSchema } from '../PropertieslistSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import PropertieslistActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function PropertieslistList() {
//   return <SmartGrid moduleActions={PropertieslistActions} schema={PropertieslistSchema} title="Propertieslist" />;
// }PaidInvoicesSchema.label
export default function PropertieslistList({
  fixedQuery = {},
  dataOut = {},
  title = PropertieslistSchema.label,
  description = `${PropertieslistSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = PropertieslistActions,
  schema = PropertieslistSchema,
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