import { Suspense } from 'react';
import ArrearsTenantsList from '../uiControl/ArrearsTenantsList';
import { ArrearsTenantsSchema } from '../ArrearsTenantsSchema';
import { hiveRoutes } from '../../../../../appConfigs/hiveRoutes';

export async function generateMetadata() {
  return { title: ArrearsTenantsSchema.label, description: ArrearsTenantsSchema.description, icons: { icon: `${hiveRoutes.hiveBaseRoute}/logo.png` } };
}

export default function Page() {
  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid p-0 m-0 ">
          <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
            <ArrearsTenantsList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
