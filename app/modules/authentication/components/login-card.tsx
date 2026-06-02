import { Form, Link, useActionData, useNavigation } from "react-router";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useConfigurables } from "~/modules/configurables";

interface ActionData {
  error?: string;
}

export function LoginCard() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config, loading } = useConfigurables();

  const appName = loading ? "EventFlow" : (config.appName ?? "EventFlow");
  const heading = loading ? `Sign in to EventFlow` : (config.loginHeading ?? `Sign in to ${appName}`);
  const subheading = loading
    ? "Enter your credentials to access your planner dashboard"
    : (config.loginSubheading ?? "Enter your credentials to access your planner dashboard");
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-xs text-[#6B7280] underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
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
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
              <p className="text-center text-sm text-[#6B7280]">
                Don&apos;t have an account?{" "}
                <Link
                  to="/auth/register"
                  className="font-semibold underline underline-offset-4"
                  style={{ color: primaryColor }}
                >
                  Create one
                </Link>
              </p>
            </CardFooter>
          </Form>
        </Card>
      </div>
    </div>
  );
}
