import { Suspense } from 'react';
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';
import MaintenancevendorsProfile from '../uiControl/MaintenancevendorsProfile';


export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Maintenancevendors profile"//searchParams?.mosyTitle || "Tasks";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Maintenancevendors Profile`,
    description: 'Maintenancevendors profile / item details',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}
export default function Page() {

return (
     <>
        <div className="main-wrapper">
          <div className="page-wrapper">
            <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <MaintenancevendorsProfile />
               </Suspense>
            </div>
          </div>
        </div>
    </>
)
}

