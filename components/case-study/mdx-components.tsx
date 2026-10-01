import type { ComponentPropsWithoutRef } from "react";
import { PlaceholderVisual } from "@/components/placeholder-visual";
import { ArchitectureDiagram } from "@/components/case-study/architecture-diagram";
import { NegotiationReplay } from "@/components/negotiation-replay/negotiation-replay";
import { Screenshot } from "@/components/case-study/screenshot";

export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-14 font-display text-2xl text-bone first:mt-0" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 font-display text-lg text-bone" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mt-4 max-w-[68ch] text-fog" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-4 flex max-w-[68ch] flex-col gap-2 list-disc pl-5 text-fog" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li {...props} />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="text-bone" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="text-signal hover:opacity-80" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="rounded bg-deep px-1.5 py-0.5 font-mono text-sm text-bone" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre className="mt-4 overflow-x-auto rounded-lg bg-deep p-4 font-mono text-sm text-bone" {...props} />
  ),
  PlaceholderVisual,
  ArchitectureDiagram,
  NegotiationReplay,
  Screenshot,
};
