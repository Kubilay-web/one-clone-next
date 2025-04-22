// import { getUserById } from "@/actions/users";
// import ChangePasswordForm from "@/components/Forms/ChangePasswordForm";
import { validateRequest } from "@/auth";

export default async function ChangePass() {
  const user = await validateRequest();
  // const userDetails = await getUserById(user.user ?? "");
  return (
    <div className="p-8">
      {/* <ChangePasswordForm initialData={userDetails} editingId={user.user} /> */}
      <div></div>
    </div>
  );
}
