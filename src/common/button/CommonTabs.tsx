import clsx from "clsx";
import CommonSelect from "./CommonSelect";

export interface TabItem {
  label: string;
  value: string;
}

interface CommonTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
}

const CommonTabs = ({
  tabs,
  activeTab,
  onChange,
  className,
  tabClassName,
  activeTabClassName,
}: CommonTabsProps) => {
  const selectItems = tabs.map((tab) => ({
    label: tab.label,
    value: tab.value,
  }));

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <CommonSelect
          value={activeTab}
          item={selectItems}
          onValueChange={onChange}
          className="w-full"
        />
      </div>

      {/* Desktop - Original Design */}
      <div className={clsx("hidden md:flex gap-2 overflow-x-auto", className)}>
        {tabs.map((tab) => {
          const active = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={clsx(
                "px-4 py-2 rounded-lg text-base font-medium whitespace-nowrap transition-all duration-200 cursor-pointer",
                active
                  ? "bg-[#2DAD00] text-white"
                  : "bg-[#EAF7E6] text-[#112518] hover:bg-[#dfe8db]",
                tabClassName,
                active && activeTabClassName,
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default CommonTabs;
