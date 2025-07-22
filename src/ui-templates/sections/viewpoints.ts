import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import { appIcons } from "../../globals";

export interface ViewpointsPanelState {
  components: OBC.Components;
  world?: OBC.World;
}

export const viewpointsPanelTemplate: BUI.StatefullComponent<
  ViewpointsPanelState
> = (state, update) => {
  const { components, world } = state;

  const onCreate = async ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    const manager = components.get(OBC.Viewpoints);
    const highlighter = components.get(OBF.Highlighter);
    const fragments = components.get(OBC.FragmentsManager);

    const viewpoint = manager.create();
    viewpoint.world = world ?? null;
    await viewpoint.updateCamera();

    // Add elements from current selection
    const selection = highlighter.selection.select;
    if (!OBC.ModelIdMapUtils.isEmpty(selection)) {
      const guids = await fragments.modelIdMapToGuids(selection);
      viewpoint.selectionComponents.add(...guids);
    }

    // Update the viewpoint colors based on the highlighter
    for (const [style, definition] of highlighter.styles) {
      if (!definition) continue;
      const map = highlighter.selection[style];
      if (OBC.ModelIdMapUtils.isEmpty(map)) continue;
      const guids = await fragments.modelIdMapToGuids(map);
      viewpoint.componentColors.set(definition.color.getHexString(), guids);
    }

    target.loading = false;
    // Force update after creating a viewpoint
    update();
  };

  // Custom empty state component with Chinese text
  const emptyStateComponent = BUI.html`
    <div class="flex flex-col items-center justify-center p-8 text-gray-400">
      <div class="text-4xl mb-4">📷</div>
      <div class="text-lg font-medium mb-2">暂无视点</div>
      <div class="text-sm text-gray-500">点击"添加"按钮创建新的视点</div>
    </div>
  `;

  // Check if there are any viewpoints
  const manager = components.get(OBC.Viewpoints);
  const hasViewpoints = manager.list.size > 0;

  // Create the viewpoints list component
  const [viewpointsComponent] = CUI.tables.viewpointsList({ components });

  return BUI.html`
    <bim-panel-section fixed icon=${appIcons.CAMERA} label="视点">
      <bim-button class="flex-none" label="添加" icon=${appIcons.ADD} @click=${onCreate}></bim-button> 
      <div class="flex-1 relative">
        ${viewpointsComponent}
        ${!hasViewpoints ? BUI.html`
          <div class="absolute inset-0 bg-gray-900 bg-opacity-95 z-10">
            ${emptyStateComponent}
          </div>
        ` : ''}
      </div>
    </bim-panel-section>
  `;
};
