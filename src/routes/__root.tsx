import { ThemeProvider } from "#/components/theme-provider.tsx";
import { authStateFn } from "#/server/functions/auth.ts";
import { ClerkProvider } from "@clerk/tanstack-react-start";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import appCss from "../styles.css?url";

type RouterContext = {
  isAuthenticated: boolean;
  userId: string | null;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    try {
      const { isAuthenticated, userId } = await authStateFn();

      return {
        isAuthenticated,
        userId,
      };
    } catch (error) {
      console.error("Error fetching auth state:", error);

      return {
        isAuthenticated: false,
        userId: null,
      };
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Eventory",
      },
      {
        name: "description",
        content:
          "A full-stack event management platform for planning, creating and managing in-person, virtual or hybrid events.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <div>404 - Not Found</div>,
});

const queryClient = new QueryClient();

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="system" storageKey="theme">
            <ClerkProvider>
              {children}
              <TanStackDevtools
                config={{
                  position: "bottom-right",
                  hideUntilHover: true,
                  defaultOpen: false,
                  openHotkey: ["Control", "Shift", "D"],
                }}
                plugins={[
                  {
                    name: "TanStack Form",
                    render: <FormDevtoolsPanel />,
                  },
                  {
                    name: "TanStack Query",
                    render: <ReactQueryDevtoolsPanel />,
                  },
                  {
                    name: "TanStack Router",
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                ]}
              />
            </ClerkProvider>
          </ThemeProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
