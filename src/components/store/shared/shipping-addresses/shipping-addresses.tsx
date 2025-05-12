import { UserShippingAddressType } from "@/lib/types";
import { Country, ShippingAddress } from "@prisma/client";
import { Plus } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import Modal from "../modal";
import AddressDetails from "./address-details";
interface Props {
  countries: Country[];
  addresses: UserShippingAddressType[];
  selectedAddress: ShippingAddress | null;
  setSelectedAddress: Dispatch<SetStateAction<ShippingAddress | null>>;
}

const UserShippingAddresses: FC<Props> = ({
  addresses,
  countries,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="w-full bg-white px-6 py-4">
      <div className="relative flex flex-col text-sm">
        <h1 className="mb-3 text-lg font-bold">Shipping Addresses</h1>
        {addresses && addresses.length > 0 && <div>Address</div>}
        <div
          onClick={() => setShow(true)}
          className="ml-8 mt-4 cursor-pointer text-orange-background"
        >
          <Plus className="mr-1 inline-block w-3" />
          <span className="text-sm">Add new address</span>
        </div>
        <Modal title="Add new Address" show={show} setShow={setShow}>
          <AddressDetails countries={countries} />
        </Modal>
      </div>
    </div>
  );
};

export default UserShippingAddresses;
