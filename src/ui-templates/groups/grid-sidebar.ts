import * as BUI from "@thatopen/ui";
import { appIcons } from "../../globals";
import { settingsManager } from "../../components/settings-manager";

export interface GridSidebarState {
  grid: BUI.Grid<any, any>;
  compact: boolean;
  layoutIcons: Record<string, string>;
  showSettings: boolean;
  currentSettingsTab: string;
}

export const gridSidebarTemplate: BUI.StatefullComponent<GridSidebarState> = (
  state,
  update,
) => {
  const { grid, compact, layoutIcons, showSettings, currentSettingsTab } = state;

  const onToggleCompact = () => {
    update({ compact: !state.compact });
  };

  const onToggleSettings = () => {
    update({ showSettings: !state.showSettings });
  };

  const onSettingsTabChange = (tab: string) => {
    update({ currentSettingsTab: tab });
  };

  // Settings tabs for future account management
  const settingsTabs = [
    { id: "account", label: "账户", icon: "mdi:account" },
    { id: "preferences", label: "偏好", icon: "mdi:cog" },
    { id: "security", label: "安全", icon: "mdi:shield" },
    { id: "notifications", label: "通知", icon: "mdi:bell" },
    { id: "data", label: "数据", icon: "mdi:database" },
    { id: "about", label: "关于", icon: "mdi:information" },
  ];

  const renderSettingsContent = () => {
    switch (currentSettingsTab) {
      case "account":
        return BUI.html`
          <div class="flex flex-col gap-3 p-3">
            <div class="flex items-center gap-3 p-2 bg-gray-700 rounded">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">U</span>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-200">用户名</div>
                <div class="text-xs text-gray-400">user@example.com</div>
              </div>
            </div>
            <bim-button class="w-full" label="编辑资料" icon="mdi:account-edit"></bim-button>
            <bim-button class="w-full" label="更改头像" icon="mdi:camera"></bim-button>
            <bim-button class="w-full" label="管理订阅" icon="mdi:star"></bim-button>
          </div>
        `;
      case "preferences":
        return BUI.html`
          <div class="flex flex-col gap-3 p-3">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-300">深色模式</span>
                <bim-checkbox ?checked=${true}></bim-checkbox>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-300">自动保存</span>
                <bim-checkbox ?checked=${true}></bim-checkbox>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-300">硬件加速</span>
                <bim-checkbox ?checked=${false}></bim-checkbox>
              </div>
            </div>
            <bim-dropdown label="语言" class="w-full">
              <bim-option label="中文" ?checked=${true}></bim-option>
              <bim-option label="English"></bim-option>
              <bim-option label="Español"></bim-option>
            </bim-dropdown>
          </div>
        `;
      case "security":
        return BUI.html`
          <div class="flex flex-col gap-3 p-3">
            <bim-button class="w-full" label="更改密码" icon="mdi:lock-reset"></bim-button>
            <bim-button class="w-full" label="两步验证" icon="mdi:two-factor-authentication"></bim-button>
            <bim-button class="w-full" label="登录历史" icon="mdi:history"></bim-button>
            <bim-button class="w-full" label="设备管理" icon="mdi:devices"></bim-button>
            <div class="border-t border-gray-600 pt-3">
              <bim-button class="w-full text-red-400" label="注销所有设备" icon="mdi:logout"></bim-button>
            </div>
          </div>
        `;
      case "notifications":
        return BUI.html`
          <div class="flex flex-col gap-3 p-3">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-300">邮件通知</span>
                <bim-checkbox ?checked=${true}></bim-checkbox>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-300">推送通知</span>
                <bim-checkbox ?checked=${false}></bim-checkbox>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-300">更新提醒</span>
                <bim-checkbox ?checked=${true}></bim-checkbox>
              </div>
            </div>
          </div>
        `;
      case "data":
        return BUI.html`
          <div class="flex flex-col gap-3 p-3">
            <div class="text-sm text-gray-400 space-y-2">
              <div class="flex justify-between">
                <span>已用存储</span>
                <span>2.4 GB / 10 GB</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" style="width: 24%"></div>
              </div>
            </div>
            <bim-button class="w-full" label="导出数据" icon="mdi:download"></bim-button>
            <bim-button class="w-full" label="导入数据" icon="mdi:upload"></bim-button>
            <bim-button class="w-full" label="清理缓存" icon="mdi:delete-sweep"></bim-button>
            <div class="border-t border-gray-600 pt-3">
              <bim-button class="w-full text-red-400" label="删除账户" icon="mdi:account-remove"></bim-button>
            </div>
          </div>
        `;
      case "about":
        return BUI.html`
          <div class="flex flex-col gap-3 p-3">
            <div class="text-center space-y-2">
              <div class="text-lg font-semibold text-gray-200">BIM 3.0 Viewer</div>
              <div class="text-xs text-gray-400">版本 1.0.0</div>
            </div>
            <div class="space-y-2 text-sm text-gray-400">
              <bim-button class="w-full justify-start" label="帮助文档" icon="mdi:help-circle"></bim-button>
              <bim-button class="w-full justify-start" label="反馈建议" icon="mdi:message-text"></bim-button>
              <bim-button class="w-full justify-start" label="隐私政策" icon="mdi:shield-check"></bim-button>
              <bim-button class="w-full justify-start" label="服务条款" icon="mdi:file-document"></bim-button>
            </div>
            <div class="border-t border-gray-600 pt-3">
              <bim-button class="w-full" label="检查更新" icon="mdi:update"></bim-button>
            </div>
          </div>
        `;
      default:
        return BUI.html`<div class="p-3 text-gray-400">选择设置选项</div>`;
    }
  };

  // Modal overlay for settings
  const settingsModal = showSettings
    ? BUI.html`
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click=${onToggleSettings}></div>
        <div class="relative bg-gray-900 rounded-lg shadow-2xl border border-gray-700 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
          <div class="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-gray-200">设置</h3>
            <button class="text-gray-400 hover:text-white p-1 w-6 h-6 min-w-0 min-h-0 flex items-center justify-center rounded hover:bg-gray-700 transition-colors" @click=${onToggleSettings}>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="flex flex-row h-full">
            <div class="flex flex-col gap-1 p-4 border-r border-gray-700 min-w-[7rem] bg-gray-800">
              ${settingsTabs.map(tab => BUI.html`
                <bim-button 
                  class="text-xs w-full justify-start" 
                  ?active=${currentSettingsTab === tab.id}
                  @click=${() => onSettingsTabChange(tab.id)}
                  icon=${tab.icon}
                  label=${tab.label}
                ></bim-button>
              `)}
            </div>
            <div class="flex-1 overflow-y-auto">
              ${renderSettingsContent()}
            </div>
          </div>
        </div>
      </div>
    `
    : null;

  return BUI.html`
  <div class="flex flex-col justify-between items-center border-r border-gray-600 p-2 h-full relative">
    <div class="flex flex-col gap-2 flex-1">
      <!-- Layout Buttons -->
      <div class="flex flex-col gap-2">
        ${Object.keys(grid.layouts).map((layout) => {
          const layoutIcon = layoutIcons[layout];
          const icon = !layoutIcon ? appIcons.LAYOUT : layoutIcon;
          let layoutLabel = layout;
          if (layout === "查看器") layoutLabel = "查看器";
          if (layout === "应用") layoutLabel = "应用";
          return BUI.html`
            <bim-button ?active=${grid.layout === layout} @click=${() => (grid.layout = layout)} ?label-hidden=${compact} icon=${icon} label=${layoutLabel}></bim-button> 
          `;
        })}
      </div>

      <!-- Settings Section -->
      <div class="border-t border-gray-600 pt-2 mt-2">
        <bim-button ?active=${showSettings} @click=${onToggleSettings} ?label-hidden=${compact} icon="mdi:cog" label="设置"></bim-button>
      </div>
    </div>

    <!-- Settings Modal Overlay -->
    ${settingsModal}

    <!-- Toggle Compact Button -->
    <bim-button ?label-hidden=${compact} label="收起" class="w-fit flex-none bg-transparent rounded-${compact ? "full" : "none"}" icon=${compact ? appIcons.RIGHT : appIcons.LEFT} @click=${onToggleCompact}></bim-button>
  </div>
`;
};
