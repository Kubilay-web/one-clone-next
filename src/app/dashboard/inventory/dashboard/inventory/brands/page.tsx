import DataTable from "../../../../../../components/inventory/DataTableComponents/DataTable";
// import { columns } from "./columns";
import ModalTableHeader from "../../../../../../components/inventory/dashboard/Tables/ModalTableHeader";
// import { getAuthenticatedUser } from "@/config/useAuth";
import { UnitForm } from "../../../../../../components/inventory/Forms/inventory/UnitForm";
// import { getOrgUnits } from "@/actions/units";
import { BrandForm } from "../../../../../../components/inventory/Forms/inventory/BrandForm";
// import { getOrgBrands } from "@/actions/brands";
import { Suspense } from "react";
// import { TableLoading } from "../../../../../../components/inventory/ui/data-table";
import { validateRequest } from "@/auth";
export default async function page() {
  // const user = await validateRequest();

  // const orgId = user.orgId;
  // const orgName = user?.orgName ?? "";
  // const brands = (await getOrgBrands(orgId)) || [];

  return (
    <div className="p-8">
      {/* <Suspense fallback={<TableLoading title="Vehicle Inventory" />}>
        <ModalTableHeader
          title="Brands"
          linkTitle="Add Brand"
          href="#"
          data={brands}
          model="brand"
          modalForm={<BrandForm orgId={orgId} />}
        /> 
        <DataTable columns={columns} data={brands} /> 
      </Suspense> */}
    </div>
  );
}
