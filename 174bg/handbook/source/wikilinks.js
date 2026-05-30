/**
 * wikilinks.js
 *
 * Automatically turns known Star Citizen ship, weapon, armor, and tool names
 * found in the page's text into hyperlinks pointing to starcitizen.tools.
 *
 * How it works:
 *   1. `linkMap` defines each recognized term and its destination URL.
 *   2. On DOMContentLoaded, a single regex is built from all terms, sorted
 *      longest-first so multi-word names (e.g. "Fury MX") take precedence
 *      over shorter overlapping ones (e.g. "Fury").
 *   3. The document body's text nodes are walked and any matching term is
 *      replaced in place with an anchor element. Text already inside an
 *      existing <a> is skipped to avoid nested links.
 *
 * To add a new link, insert a `"Display Name": "https://..."` entry into
 * `linkMap`.
 */
document.addEventListener("DOMContentLoaded", () => {
  const linkMap = {
    "A2 Hercules Starlifter":
      "https://starcitizen.tools/A2_Hercules_Starlifter",
    "Apollo Medivac": "https://starcitizen.tools/Apollo_Medivac",
    Asgard: "https://starcitizen.tools/Asgard",
    Carrack: "https://starcitizen.tools/Carrack",
    Crucible: "https://starcitizen.tools/Crucible",
    "Cutlass Red": "https://starcitizen.tools/Cutlass_Red",
    Eclipse: "https://starcitizen.tools/Eclipse",
    "Fury MX": "https://starcitizen.tools/Fury_MX",
    Fury: "https://starcitizen.tools/Fury",
    Hammerhead: "https://starcitizen.tools/Hammerhead",
    Herald: "https://starcitizen.tools/Herald",
    "Hull C": "https://starcitizen.tools/Hull_C",
    "Hull E": "https://starcitizen.tools/Hull_E",
    "Idris-K": "https://starcitizen.tools/Idris-K",
    "Ironclad Assault": "https://starcitizen.tools/Ironclad_Assault",
    Kraken: "https://starcitizen.tools/Kraken",
    Legionnaire: "https://starcitizen.tools/Legionnaire",
    Mole: "https://starcitizen.tools/Mole",
    Nautilus: "https://starcitizen.tools/Nautilus",
    Orion: "https://starcitizen.tools/Orion",
    Perseus: "https://starcitizen.tools/Perseus",
    Polaris: "https://starcitizen.tools/Polaris",
    Prowler: "https://starcitizen.tools/Prowler",
    Reclaimer: "https://starcitizen.tools/Reclaimer",
    Retaliator: "https://starcitizen.tools/Retaliator",
    Scorpius: "https://starcitizen.tools/Scorpius",
    "Starfarer Gemini": "https://starcitizen.tools/Starfarer_Gemini",
    "Terrapin Medic": "https://starcitizen.tools/Terrapin_Medic",
    Tiburon: "https://starcitizen.tools/Tiburon",
    Valkyrie: "https://starcitizen.tools/Valkyrie",
    "Vanguard Sentinel": "https://starcitizen.tools/Vanguard_Sentinel",
    "Arclight Pistol": "https://starcitizen.tools/Arclight_Pistol",
    "Arden-SL Arms": "https://starcitizen.tools/Arden-SL_Arms",
    "Arden-SL Core": "https://starcitizen.tools/Arden-SL_Core",
    "Arden-SL Helmet": "https://starcitizen.tools/Arden-SL_Helmet",
    "Arden-SL Legs": "https://starcitizen.tools/Arden-SL_Legs",
    "Calico Arms Tactical": "https://starcitizen.tools/Calico_Arms_Tactical",
    "Calico Core Tactical": "https://starcitizen.tools/Calico_Core_Tactical",
    "Calico Helmet Tactical":
      "https://starcitizen.tools/Calico_Helmet_Tactical",
    "Calico Legs Tactical": "https://starcitizen.tools/Calico_Legs_Tactical",
    "DustUp Arms Tactical": "https://starcitizen.tools/DustUp_Arms_Tactical",
    "DustUp Core Tactical": "https://starcitizen.tools/DustUp_Core_Tactical",
    "DustUp Helmet Tactical":
      "https://starcitizen.tools/DustUp_Helmet_Tactical",
    "DustUp Legs Tactical": "https://starcitizen.tools/DustUp_Legs_Tactical",
    "Killshot Rifle": "https://starcitizen.tools/Killshot_Rifle",
    "Morozov-SH Arms": "https://starcitizen.tools/Morozov-SH_Arms",
    "Morozov-SH Core": "https://starcitizen.tools/Morozov-SH_Core",
    "Morozov-SH Helmet": "https://starcitizen.tools/Morozov-SH_Helmet",
    "Morozov-SH Legs": "https://starcitizen.tools/Morozov-SH_Legs",
    "P6-LR Sniper Rifle": "https://starcitizen.tools/P6-LR_Sniper_Rifle",
    "Pulverizer LMG": "https://starcitizen.tools/Pulverizer_LMG",
    "S-38 Pistol": "https://starcitizen.tools/S-38_Pistol",
    "Stoneskin Undersuit": "https://starcitizen.tools/Stoneskin_Undersuit",
    "TripleDown Shotgun Pistol":
      "https://starcitizen.tools/TripleDown_Shotgun_Pistol",
    "Yubarev Pistol": "https://starcitizen.tools/Yubarev_Pistol",
    "ADP-mk4 Arms": "https://starcitizen.tools/ADP-mk4_Arms",
    "ADP-mk4 Core": "https://starcitizen.tools/ADP-mk4_Core",
    "ADP-mk4 Helmet": "https://starcitizen.tools/ADP-mk4_Helmet",
    "ADP-mk4 Legs": "https://starcitizen.tools/ADP-mk4_Legs",
    "Tailwind Flight Helmet":
      "https://starcitizen.tools/Tailwind_Flight_Helmet",
    "Tailwind Flight Suit": "https://starcitizen.tools/Tailwind_Flight_Suit",
    "Novikov Exploration Suit":
      "https://starcitizen.tools/Novikov_Exploration_Suit",
    "Novikov Helmet": "https://starcitizen.tools/Novikov_Helmet",
    "APX Fire Extinguisher": "https://starcitizen.tools/APX_Fire_Extinguisher",
    "Cambio SRT": "https://starcitizen.tools/Cambio_SRT",
    "Pyro RYT Multi-Tool": "https://starcitizen.tools/Pyro_RYT_Multi-Tool",
    "TruHold Tractor Beam Attachment":
      "https://starcitizen.tools/TruHold_Tractor_Beam_Attachment",
  };

  // Build one regex from every term, longest first so multi-word names
  // like "Fury MX" win over shorter ones like "Fury".
  const escaped = Object.keys(linkMap)
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const termPattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "g");

  // Collect text nodes up front, since we mutate the DOM as we go.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  for (const node of textNodes) {
    // Skip text that is already inside a link.
    if (node.parentNode.closest("a")) continue;

    const text = node.textContent;
    const matches = [...text.matchAll(termPattern)];
    if (matches.length === 0) continue;

    // Rebuild the node as a mix of plain text and anchor elements.
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    for (const match of matches) {
      const term = match[0];
      fragment.append(text.slice(cursor, match.index));

      const link = document.createElement("a");
      link.href = linkMap[term];
      link.textContent = term;
      fragment.append(link);

      cursor = match.index + term.length;
    }
    fragment.append(text.slice(cursor));

    node.parentNode.replaceChild(fragment, node);
  }
});
