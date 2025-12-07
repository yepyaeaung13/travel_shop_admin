import Logo from "@/assets/Logo";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export default function TitleHeader() {
  return (
    <Collapsible asChild className="group/collapsible">
      <SidebarMenuItem className="pl-2.5">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            // tooltip={item.title}
            className="cursor-pointer"
          >
            <Logo />
            <h2 className="text-2xl text-nowrap">Travel Shop</h2>
          </SidebarMenuButton>
        </CollapsibleTrigger>
      </SidebarMenuItem>
    </Collapsible>
  );
}
