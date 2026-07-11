import { defineConfig } from "vitepress";

export default defineConfig({
  title: "174th Battle Group Handbook",
  description: "A guide for members of the 174th Battle Group community.",
  srcDir: "docs",
  // The sibling Manager site (174bg/manager) has no light mode at all, so
  // match it by forcing dark mode here too instead of offering a toggle.
  appearance: "force-dark",

  head: [
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@400;500;600;700&display=swap",
      },
    ],
  ],

  themeConfig: {
    outline: {
      level: [2, 3],
      label: "On this page",
    },

    search: {
      provider: "local",
    },

    nav: [
      { text: "Organization", link: "/organization/departments" },
      { text: "Membership", link: "/membership/joining-process" },
      { text: "Conduct", link: "/conduct/rules-of-engagement" },
      { text: "Fleet", link: "/fleet/fleet-composition" },
    ],

    sidebar: [
      {
        text: "Introduction",
        link: "/",
        items: [
          { text: "Using This Handbook", link: "/#using-this-handbook" },
        ],
      },
      {
        text: "Organization",
        collapsed: false,
        items: [
          { text: "Departments", link: "/organization/departments" },
          {
            text: "Divisions",
            link: "/organization/divisions",
            collapsed: true,
            items: [
              {
                text: "Naval",
                link: "/organization/divisions#naval-division",
              },
              {
                text: "Marine",
                link: "/organization/divisions#marine-division",
              },
              {
                text: "Auxiliary",
                link: "/organization/divisions#auxiliary-division",
              },
            ],
          },
          {
            text: "Roles",
            link: "/organization/roles",
            collapsed: true,
            items: [
              { text: "Naval", link: "/organization/roles#naval-roles" },
              { text: "Marine", link: "/organization/roles#marine-roles" },
              {
                text: "Auxiliary",
                link: "/organization/roles#auxiliary-roles",
              },
            ],
          },
          { text: "Ranks", link: "/organization/ranks" },
          {
            text: "Command Structure",
            link: "/organization/command-structure",
            collapsed: true,
            items: [
              {
                text: "Chain of Command",
                link: "/organization/command-structure#chain-of-command",
              },
              {
                text: "Operational Authority",
                link: "/organization/command-structure#operational-authority",
              },
              {
                text: "Decision-Making",
                link: "/organization/command-structure#decision-making",
              },
            ],
          },
        ],
      },
      {
        text: "Membership",
        collapsed: false,
        items: [
          {
            text: "Joining Process",
            link: "/membership/joining-process",
            collapsed: true,
            items: [
              {
                text: "Prerequisites",
                link: "/membership/joining-process#prerequisites",
              },
              {
                text: "Application",
                link: "/membership/joining-process#application",
              },
              {
                text: "Onboarding",
                link: "/membership/joining-process#onboarding",
              },
              {
                text: "Probation Period",
                link: "/membership/joining-process#probation-period",
              },
              {
                text: "Advancing to Rank 1",
                link: "/membership/joining-process#advancing-to-rank-1",
              },
            ],
          },
          {
            text: "Leave of Absence",
            link: "/membership/leave-of-absence",
            collapsed: true,
            items: [
              {
                text: "Requesting Leave",
                link: "/membership/leave-of-absence#requesting-leave",
              },
              {
                text: "Duration",
                link: "/membership/leave-of-absence#duration",
              },
              {
                text: "Rank During Leave",
                link: "/membership/leave-of-absence#rank-during-leave",
              },
              {
                text: "Returning from Leave",
                link: "/membership/leave-of-absence#returning-from-leave",
              },
              {
                text: "Unannounced Absence",
                link: "/membership/leave-of-absence#unannounced-absence",
              },
            ],
          },
        ],
      },
      {
        text: "Conduct",
        collapsed: false,
        items: [
          {
            text: "Rules of Engagement",
            link: "/conduct/rules-of-engagement",
            collapsed: true,
            items: [
              {
                text: "Authorised Use of Force",
                link: "/conduct/rules-of-engagement#authorised-use-of-force",
              },
              {
                text: "Escalation and Warning",
                link: "/conduct/rules-of-engagement#escalation-and-warning",
              },
              {
                text: "Civilians and Neutrals",
                link: "/conduct/rules-of-engagement#civilians-and-neutrals",
              },
              {
                text: "Surrendered and Fleeing Enemies",
                link: "/conduct/rules-of-engagement#surrendered-and-fleeing-enemies",
              },
              {
                text: "Prohibited Actions",
                link: "/conduct/rules-of-engagement#prohibited-actions",
              },
              {
                text: "Friendly Fire",
                link: "/conduct/rules-of-engagement#friendly-fire",
              },
              {
                text: "Target Verification",
                link: "/conduct/rules-of-engagement#target-verification",
              },
            ],
          },
          {
            text: "Code of Conduct",
            link: "/conduct/code-of-conduct",
            collapsed: true,
            items: [
              {
                text: "Expected Behaviour",
                link: "/conduct/code-of-conduct#expected-behaviour",
              },
              {
                text: "Disciplinary Process",
                link: "/conduct/code-of-conduct#disciplinary-process",
              },
              {
                text: "Grounds for Immediate Removal",
                link: "/conduct/code-of-conduct#grounds-for-immediate-removal",
              },
              { text: "Appeals", link: "/conduct/code-of-conduct#appeals" },
            ],
          },
        ],
      },
      {
        text: "Fleet",
        collapsed: false,
        items: [
          {
            text: "Fleet Composition",
            link: "/fleet/fleet-composition",
            collapsed: true,
            items: [
              {
                text: "Design Principles",
                link: "/fleet/fleet-composition#fleet-design-principles",
              },
              {
                text: "Standard Issue Ships",
                link: "/fleet/fleet-composition#standard-issue-ships",
              },
              {
                text: "Ship Loadouts",
                link: "/fleet/fleet-composition#ship-loadouts",
              },
            ],
          },
          {
            text: "Gear Loadouts",
            link: "/fleet/gear-loadouts",
            collapsed: true,
            items: [
              {
                text: "Marine Loadouts",
                link: "/fleet/gear-loadouts#marine-loadouts",
              },
              {
                text: "Navy Loadouts",
                link: "/fleet/gear-loadouts#navy-loadouts",
              },
              {
                text: "Auxiliary Loadouts",
                link: "/fleet/gear-loadouts#auxiliary-loadouts",
              },
            ],
          },
        ],
      },
    ],
  },
});
