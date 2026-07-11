import { defineConfig } from "vitepress";

export default defineConfig({
  title: "174th Battle Group Handbook",
  description: "A guide for members of the 174th Battle Group community.",
  srcDir: "docs",

  themeConfig: {
    outline: {
      level: [2, 3],
      label: "On this page",
    },

    search: {
      provider: "local",
    },

    sidebar: [
      {
        text: "Introduction",
        link: "/",
        items: [
          { text: "Using This Handbook", link: "/#using-this-handbook" },
        ],
      },
      { text: "Departments", link: "/departments" },
      {
        text: "Divisions",
        link: "/divisions",
        items: [
          { text: "Naval", link: "/divisions#naval-division" },
          { text: "Marine", link: "/divisions#marine-division" },
          { text: "Auxiliary", link: "/divisions#auxiliary-division" },
        ],
      },
      {
        text: "Roles",
        link: "/roles",
        items: [
          { text: "Naval", link: "/roles#naval-roles" },
          { text: "Marine", link: "/roles#marine-roles" },
          { text: "Auxiliary", link: "/roles#auxiliary-roles" },
        ],
      },
      { text: "Ranks", link: "/ranks" },
      {
        text: "Command Structure",
        link: "/command-structure",
        items: [
          {
            text: "Chain of Command",
            link: "/command-structure#chain-of-command",
          },
          {
            text: "Operational Authority",
            link: "/command-structure#operational-authority",
          },
          {
            text: "Decision-Making",
            link: "/command-structure#decision-making",
          },
        ],
      },
      {
        text: "Joining Process",
        link: "/joining-process",
        items: [
          { text: "Prerequisites", link: "/joining-process#prerequisites" },
          { text: "Application", link: "/joining-process#application" },
          { text: "Onboarding", link: "/joining-process#onboarding" },
          {
            text: "Probation Period",
            link: "/joining-process#probation-period",
          },
          {
            text: "Advancing to Rank 1",
            link: "/joining-process#advancing-to-rank-1",
          },
        ],
      },
      {
        text: "Rules of Engagement",
        link: "/rules-of-engagement",
        items: [
          {
            text: "Authorised Use of Force",
            link: "/rules-of-engagement#authorised-use-of-force",
          },
          {
            text: "Escalation and Warning",
            link: "/rules-of-engagement#escalation-and-warning",
          },
          {
            text: "Civilians and Neutrals",
            link: "/rules-of-engagement#civilians-and-neutrals",
          },
          {
            text: "Surrendered and Fleeing Enemies",
            link: "/rules-of-engagement#surrendered-and-fleeing-enemies",
          },
          {
            text: "Prohibited Actions",
            link: "/rules-of-engagement#prohibited-actions",
          },
          {
            text: "Friendly Fire",
            link: "/rules-of-engagement#friendly-fire",
          },
          {
            text: "Target Verification",
            link: "/rules-of-engagement#target-verification",
          },
        ],
      },
      {
        text: "Code of Conduct",
        link: "/code-of-conduct",
        items: [
          {
            text: "Expected Behaviour",
            link: "/code-of-conduct#expected-behaviour",
          },
          {
            text: "Disciplinary Process",
            link: "/code-of-conduct#disciplinary-process",
          },
          {
            text: "Grounds for Immediate Removal",
            link: "/code-of-conduct#grounds-for-immediate-removal",
          },
          { text: "Appeals", link: "/code-of-conduct#appeals" },
        ],
      },
      {
        text: "Leave of Absence",
        link: "/leave-of-absence",
        items: [
          {
            text: "Requesting Leave",
            link: "/leave-of-absence#requesting-leave",
          },
          { text: "Duration", link: "/leave-of-absence#duration" },
          {
            text: "Rank During Leave",
            link: "/leave-of-absence#rank-during-leave",
          },
          {
            text: "Returning from Leave",
            link: "/leave-of-absence#returning-from-leave",
          },
          {
            text: "Unannounced Absence",
            link: "/leave-of-absence#unannounced-absence",
          },
        ],
      },
      {
        text: "Fleet Composition",
        link: "/fleet-composition",
        items: [
          {
            text: "Design Principles",
            link: "/fleet-composition#fleet-design-principles",
          },
          {
            text: "Standard Issue Ships",
            link: "/fleet-composition#standard-issue-ships",
          },
          {
            text: "Ship Loadouts",
            link: "/fleet-composition#ship-loadouts",
          },
        ],
      },
      {
        text: "Gear Loadouts",
        link: "/gear-loadouts",
        items: [
          {
            text: "Marine Loadouts",
            link: "/gear-loadouts#marine-loadouts",
          },
          { text: "Navy Loadouts", link: "/gear-loadouts#navy-loadouts" },
          {
            text: "Auxiliary Loadouts",
            link: "/gear-loadouts#auxiliary-loadouts",
          },
        ],
      },
    ],
  },
});
