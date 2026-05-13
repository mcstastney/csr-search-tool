export const dataSourceOptions = [
  "aviva.com",
  "Goodwin pack",
  "sustainability sharepoint",
] as const;

export const data = [
  {
    id: "1",
    name: "Anglia Square redevelopment",
    location: "Norwich",
    themes: ["urban regeneration", "biodiversity"],
    description:
      "Greener Places initiative to connect urban environments to nature.",
    date: new Date(2026, 0, 1),
    sourceLabel: "aviva.com",
    source:
      "https://www.aviva.com/newsroom/news-releases/2023/09/aviva-pledges-300000-to-help-protect-norfolk-wildlife-trusts-anglia-square-site/",
  },
  {
    id: "2",
    name: "Reforesting the Scottish Highlands",
    location: "Perth",
    themes: ["reforestation", "biodiversity", "habitat"],
    description:
      "Local project to restore habitat and biodiversity in the Scottish Highlands.",
    date: new Date(2023, 1, 1),
    sourceLabel: "aviva.com",
    source:
      "https://www.aviva.com/newsroom/news-releases/2023/02/aviva-helps-restore-rare-native-british-rainforests/",
  },
  {
    id: "3",
    name: "Skiddaw Forest",
    location: "Cumbria",
    themes: ["carbon sequestration", "biodiversity", "public access"],
    description:
      "Restoring 3,000 acres of upland fell, including 620 acres of lost temperate rainforest, heather moorland, and peatbogs.",
    date: new Date(2025, 4, 1),
    sourceLabel: "aviva.com",
    source:
      "https://www.cumbriawildlifetrust.org.uk/news/purchase-skiddaw-forest-now-complete",
  },
  {
    id: "4",
    name: "Sweet Briar Marshes",
    location: "Norwich",
    themes: [
      "urban biodiversity",
      "habitat restoration",
      "community wellbeing",
    ],
    description:
      "Aviva pledged £300,000 in match funding to help Norfolk Wildlife Trust purchase and protect this 90-acre site. It is being transformed into a flagship urban nature reserve.",
    date: new Date(2025, 6, 1),
    sourceLabel: "sustainability sharepoint",
    source: "https://www.norfolkwildlifetrust.org.uk/sweetbriarproject",
  },
  {
    id: "5",
    name: "River Ouse Floating Ecosystem",
    location: "York",
    themes: ["urban biodiversity", "water quality improvement"],
    description:
      "An innovative habitat near North Street Gardens hosting 20–30 plant species to support local wildlife and fish.",
    date: new Date(2026, 3, 1),
    sourceLabel: "aviva.com",
    source:
      "https://www.yorkpress.co.uk/news/23707628.river-ouse-floating-ecosystem-helps-wildlife-thrive/",
  },
  {
    id: "6",
    name: "Urban Nature Map",
    location: "Bristol",
    themes: ["climate resilience", "community engagement"],
    description:
      "A community-led project by Urban Good to map green spaces and inspire climate-conscious living.",
    date: new Date(2024, 7, 1),
    sourceLabel: "sustainability sharepoint",
    source: "https://www.urbangood.org/urban-nature-map",
  },
  {
    id: "7",
    name: "Nattergal nature restoration",
    location: "East of England",
    themes: ["climate resilience", "flooding"],
    description:
      "Providing seed funding for nature restoration projects run by Nattergal",
    date: new Date(2025, 7, 1),
    sourceLabel: "Goodwin pack",
    source:
      "https://www.avivaworld.com/:p:/r/sites/uk-cs-oc-ukcr/CR%20files/GOODWIN%20-%20Reasons%[…]tx?d=wd55f57be48f54b4ea164a75f3b313dc7&csf=1&web=1&e=T19ZsU",
  },
  {
    id: "8",
    name: "PSI signatory",
    location: "UK",
    themes: ["climate resilience", "nature advocacy"],
    description:
      "Principles for Sustainable Insurance signatory and participant in the Working Group on Nature",
    date: new Date(2026, 2, 1),
    sourceLabel: "Goodwin pack",
    source:
      "https://www.avivaworld.com/:p:/r/sites/uk-cs-oc-ukcr/CR%20files/GOODWIN%20-%20Reasons%[…]1&web=1&e=DuE0AF&nav=eyJzSWQiOjQ3MSwiY0lkIjoyNTkwMzMxMTc2fQ",
  },
];
