import { Form, Link, useActionData, useNavigation } from "react-router";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useConfigurables } from "~/modules/configurables";

interface ActionData {
  error?: string;
}

export function RegisterCard() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config, loading } = useConfigurables();

  const appName = loading ? "EventFlow" : (config.appName ?? "EventFlow");
  const heading = loading ? "Create your account" : (config.registerHeading ?? "Create your account");
  const subheading = loading
    ? `Start managing your events with ${appName}`
    : (config.registerSubheading ?? `Start managing your events with ${appName}`);
  const primaryColor = loading ? "#1B4332" : (config.brandColor?.primary ?? "#1B4332");
  const logoUrl = loading ? "" : config.logoUrl;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          {logoUrl && logoUrl !== "FILL_LOGO_URL_HERE" ? (
            <img src={logoUrl} alt={appName} className="h-12 w-12 rounded-xl object-cover mb-3" />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-white mb-3"
              style={{ backgroundColor: primaryColor }}
            >
              {appName.charAt(0)}
            </div>
          )}
          <h1 className="text-[22px] font-bold text-[#1C1C1E] tracking-tight">{heading}</h1>
          <p className="mt-1 text-sm text-[#6B7280]">{subheading}</p>
        </div>

        <Card className="border-[#E5E7EB] shadow-sm">
          <Form method="post">
            <CardContent className="space-y-4 pt-6">
              {actionData?.error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                  {actionData.error}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-6">
              <Button
                type="submit"
                className="w-full font-medium text-white"
                disabled={isSubmitting}
                style={{ backgroundColor: primaryColor }}
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
              <p className="text-center text-sm text-[#6B7280]">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="font-semibold underline underline-offset-4"
                  style={{ color: primaryColor }}
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Form>
        </Card>
      </div>
    </div>
  );
}
