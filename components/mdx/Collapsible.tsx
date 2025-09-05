import { Accordion, Accordions } from "fumadocs-ui/components/accordion";

export default function Collapsible({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Accordions type="single">
      <Accordion title={title}>{children}</Accordion>
    </Accordions>
  );
}
