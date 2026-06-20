import { getCurrentUser } from "@/actions/users";
import { UserProfile } from "@clerk/nextjs";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <div className="flex justify-center md:justify-start">
        <UserProfile routing="hash" />
      </div>
    </div>
  );
}
