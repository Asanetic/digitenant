'use client';
import { PropertiesunitsSchema } from '../PropertiesunitsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import PropertiesunitsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function PropertiesunitsList() {
//   return <SmartGrid moduleActions={PropertiesunitsActions} schema={PropertiesunitsSchema} title="Propertiesunits" />;
// }PaidInvoicesSchema.label
export default function PropertiesunitsList({
  fixedQuery = {},
  dataOut = {},
  title = PropertiesunitsSchema.label,
  description = `${PropertiesunitsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = PropertiesunitsActions,
  schema = PropertiesunitsSchema,
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