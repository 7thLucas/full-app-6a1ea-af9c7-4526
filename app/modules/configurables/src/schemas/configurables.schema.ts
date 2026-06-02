/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "appTagline",
      type: "string",
      required: false,
      label: "App Tagline",
    },
    {
      fieldName: "appDescription",
      type: "string",
      required: false,
      label: "App Description",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "faviconUrl",
      type: "url",
      required: false,
      label: "Favicon URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "dashboardWelcomeTitle",
      type: "string",
      required: false,
      label: "Dashboard Welcome Title",
    },
    {
      fieldName: "dashboardWelcomeSubtitle",
      type: "string",
      required: false,
      label: "Dashboard Welcome Subtitle",
    },
    {
      fieldName: "loginHeading",
      type: "string",
      required: false,
      label: "Login Page Heading",
    },
    {
      fieldName: "loginSubheading",
      type: "string",
      required: false,
      label: "Login Page Subheading",
    },
    {
      fieldName: "registerHeading",
      type: "string",
      required: false,
      label: "Register Page Heading",
    },
    {
      fieldName: "registerSubheading",
      type: "string",
      required: false,
      label: "Register Page Subheading",
    },
    {
      fieldName: "enableGuestManagement",
      type: "boolean",
      required: false,
      label: "Enable Guest Management",
    },
    {
      fieldName: "enableVenueManagement",
      type: "boolean",
      required: false,
      label: "Enable Venue Management",
    },
    {
      fieldName: "enableVendorTracking",
      type: "boolean",
      required: false,
      label: "Enable Vendor Tracking",
    },
    {
      fieldName: "enableTimelineManagement",
      type: "boolean",
      required: false,
      label: "Enable Timeline Management",
    },
    {
      fieldName: "defaultEventsPerPage",
      type: "number",
      required: false,
      label: "Default Events Per Page",
      min: 5,
      max: 100,
    },
    {
      fieldName: "footerText",
      type: "string",
      required: false,
      label: "Footer Text",
    },
    {
      fieldName: "supportEmail",
      type: "string",
      required: false,
      label: "Support Email",
    },
  ],
};
