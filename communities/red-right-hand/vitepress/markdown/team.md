---
layout: page
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme';

const members = [
  {
    avatar: 'https://robertsspaceindustries.com/media/7lw2abfargyozr/heap_infobox/Ezgif-4-6671ae942950.png',
    name: 'bayla',
    desc: "Project Manager",
    title: "Admiral",
    org: 'Red Right Hand',
    orgLink: 'https://robertsspaceindustries.com/orgs/UNNAMEDGRP',
  }
];
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Our Team
    </template>
    <template #lead>
      The development of this site is guided by an international team, some of whom are listed below. We are always looking for new members to join our ranks, so if you are interested in contributing, please reach out to us on our Discord server.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members />
</VPTeamPage>
