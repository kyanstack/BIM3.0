import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import { appIcons } from "../../globals";

interface ViewportSettingsState {
  components: OBC.Components;
  world: OBC.SimpleWorld<
    OBC.SimpleScene,
    OBC.OrthoPerspectiveCamera,
    OBF.PostproductionRenderer
  >;
}

export const viewportSettingsTemplate: BUI.StatefullComponent<
  ViewportSettingsState
> = (state) => {
  const { components, world } = state;

  const grids = components.get(OBC.Grids);

  const worldGrid = grids.list.get(world.uuid);
  let worldEnableCheckbox: BUI.TemplateResult | undefined;
  if (worldGrid) {
    const onToggleGrid = ({ target }: { target: BUI.Checkbox }) => {
      worldGrid.visible = target.checked;
      target.checked = worldGrid.visible;
    };

    worldEnableCheckbox = BUI.html`
      <bim-checkbox class="w-60" ?checked=${worldGrid.visible} label="网格" @change=${onToggleGrid}></bim-checkbox>
    `;
  }

  const onProjectionChange = ({ target }: { target: BUI.Dropdown }) => {
    const [projection] = target.value;
    if (!projection) return;
    world.camera.projection.set(projection);
  };

  return BUI.html`
    <bim-button class="absolute top-2 right-2 bg-transparent" icon=${appIcons.SETTINGS}>
      <bim-context-menu class="w-60 gap-1">
        ${worldEnableCheckbox}
        <bim-dropdown label="相机投影" @change=${onProjectionChange}>
          <bim-option label="透视" ?checked=${world.camera.projection.current === "Perspective"}></bim-option> 
          <bim-option label="正交" ?checked=${world.camera.projection.current === "Orthographic"}></bim-option> 
        </bim-dropdown>
      </bim-context-menu> 
    </bim-button>
  `;
};
