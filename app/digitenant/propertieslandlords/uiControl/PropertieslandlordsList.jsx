'use client';
import { PropertieslandlordsSchema } from '../PropertieslandlordsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import PropertieslandlordsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function PropertieslandlordsList() {
//   return <SmartGrid moduleActions={PropertieslandlordsActions} schema={PropertieslandlordsSchema} title="Propertieslandlords" />;
// }PaidInvoicesSchema.label
export default function PropertieslandlordsList({
  fixedQuery = {},
  dataOut = {},
  title = PropertieslandlordsSchema.label,
  description = `${PropertieslandlordsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = PropertieslandlordsActions,
  schema = PropertieslandlordsSchema,
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