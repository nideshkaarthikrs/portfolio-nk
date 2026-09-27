export interface FanCard {
  key: string;
  kind: "role" | "photo";
  label: string;
  index?: string;
  scrollTargetId: string;
  destination: string;
}

export const fanCards: FanCard[] = [
  {
    key: "founder",
    kind: "role",
    label: "Founder",
    index: "01",
    scrollTargetId: "ventures",
    destination: "Ventures",
  },
  {
    key: "builder",
    kind: "role",
    label: "Builder",
    index: "02",
    scrollTargetId: "work",
    destination: "Work",
  },
  {
    key: "photo",
    kind: "photo",
    label: "Nidesh Kaarthik",
    scrollTargetId: "about",
    destination: "About",
  },
  {
    key: "ai-engineer",
    kind: "role",
    label: "AI Engineer",
    index: "03",
    scrollTargetId: "more-work",
    destination: "More work",
  },
  {
    key: "magician",
    kind: "role",
    label: "Magician",
    index: "04",
    scrollTargetId: "beyond-code",
    destination: "Beyond code",
  },
];
