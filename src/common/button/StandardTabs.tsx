import { cn } from "@/lib/utils";
import CommonSelect from "./CommonSelect";

export interface TabItem {
  key: string;
  label: string;
}

interface CommonTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
}

const StandardTabs: React.FC<CommonTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
}) => {
  return (
    <div className="w-full">
      <div className="lg:hidden w-full">
        <CommonSelect
          value={activeTab}
          item={tabs.map((tab) => ({
            label: tab.label,
            value: tab.key,
          }))}
          onValueChange={onChange}
          className="w-full!"
        />
      </div>

      <div
        className={cn(
          "hidden lg:flex gap-6 overflow-x-auto no-scrollbar",
          className,
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer",
              activeTab === tab.key
                ? (activeTabClassName ?? "border-primary text-primary")
                : (inactiveTabClassName ??
                    "border-transparent text-[#758179] hover:text-foreground"),
              tabClassName,
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StandardTabs;
