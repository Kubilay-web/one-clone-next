import UserButton from "@/components/UserButton";
import { seedCountries } from "@/migration-scripts/seed-countries";

export default async function Home() {
  // await updateVariantImage();
  // await seedCountries();
  return (
    <div>
      <UserButton />
    </div>
  );
}
