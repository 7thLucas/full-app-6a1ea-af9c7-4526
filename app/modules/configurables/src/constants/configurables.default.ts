/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  appTagline?: string;
  appDescription?: string;
  logoUrl: string;
  faviconUrl?: string;
  brandColor: TBrandColor;
  dashboardWelcomeTitle?: string;
  dashboardWelcomeSubtitle?: string;
  loginHeading?: string;
  loginSubheading?: string;
  registerHeading?: string;
  registerSubheading?: string;
  enableGuestManagement?: boolean;
  enableVenueManagement?: boolean;
  enableVendorTracking?: boolean;
  enableTimelineManagement?: boolean;
  defaultEventsPerPage?: number;
  footerText?: string;
  supportEmail?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "EventFlow",
  appTagline: "Deliver flawless events without the chaos",
  appDescription: "An all-in-one dashboard for event planners to manage venues, vendors, guest lists, and timelines.",
  logoUrl: "FILL_LOGO_URL_HERE",
  faviconUrl: "", // fill it here once uploaded
  brandColor: {
    primary: "#1B4332",
    secondary: "#52B788",
    accent: "#74C69D",
  },
  dashboardWelcomeTitle: "Welcome back",
  dashboardWelcomeSubtitle: "Here's what's happening with your events today.",
  loginHeading: "Sign in to EventFlow",
  loginSubheading: "Enter your credentials to access your planner dashboard",
  registerHeading: "Create your account",
  registerSubheading: "Start managing your events with EventFlow",
  enableGuestManagement: true,
  enableVenueManagement: true,
  enableVendorTracking: true,
  enableTimelineManagement: true,
  defaultEventsPerPage: 20, // fill it here
  footerText: "© 2026 EventFlow. All rights reserved.",
  supportEmail: "", // fill it here
};
