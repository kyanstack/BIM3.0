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
  <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; border-right: 1px solid var(--bim-ui_bg-contrast-40); padding: 0.5rem;">
    <div class="sidebar">
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
    <bim-button ?label-hidden=${compact} label="收起" style="width: fit-content; flex: 0; background-color: transparent; border-radius: ${compact ? "100%" : "0"}" icon=${compact ? appIcons.RIGHT : appIcons.LEFT} @click=${onToggleCompact}></bim-button>
  </div>
`;
};
