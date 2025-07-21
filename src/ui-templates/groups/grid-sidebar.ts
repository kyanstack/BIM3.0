import * as BUI from "@thatopen/ui";
import { appIcons } from "../../globals";

export interface GridSidebarState {
  grid: BUI.Grid<any, any>;
  compact: boolean;
  layoutIcons: Record<string, string>;
}

export const gridSidebarTemplate: BUI.StatefullComponent<GridSidebarState> = (
  state,
  update,
) => {
  const { grid, compact, layoutIcons } = state;

  const onToggleCompact = () => {
    update({ compact: !state.compact });
  };

  return BUI.html`
  <div class="flex flex-col justify-between items-center border-r border-gray-600 p-2">
    <div class="flex flex-col gap-2">
      ${Object.keys(grid.layouts).map((layout) => {
        const layoutIcon = layoutIcons[layout];
        const icon = !layoutIcon ? appIcons.LAYOUT : layoutIcon;
        // Translate layout names for sidebar button labels
        let layoutLabel = layout;
        if (layout === "查看器") layoutLabel = "查看器";
        if (layout === "应用") layoutLabel = "应用";
        return BUI.html`
          <bim-button ?active=${grid.layout === layout} @click=${() => (grid.layout = layout)} ?label-hidden=${compact} icon=${icon} label=${layoutLabel}></bim-button> 
        `;
      })}
    </div>
    <bim-button ?label-hidden=${compact} label="收起" class="w-fit flex-none bg-transparent rounded-${compact ? "full" : "none"}" icon=${compact ? appIcons.RIGHT : appIcons.LEFT} @click=${onToggleCompact}></bim-button>
  </div>
`;
};
