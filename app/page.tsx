import { Hero } from "@/components/hero";
import { ShippedFor } from "@/components/shipped-for";
import { FlagshipWork } from "@/components/flagship-work";
import { MoreWork } from "@/components/more-work";
import { ClientWork } from "@/components/client-work";
import { Ventures } from "@/components/ventures";
import { About } from "@/components/about";
import { BeyondCode } from "@/components/beyond-code";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <ShippedFor />
      <FlagshipWork />
      <MoreWork />
      <ClientWork />
      <Ventures />
      <About />
      <BeyondCode />
      <Contact />
    </>
  );
}
