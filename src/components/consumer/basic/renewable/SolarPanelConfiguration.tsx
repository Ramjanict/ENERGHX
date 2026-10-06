import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";

interface SolarPanelConfigurationProps {
  panelCapacity: string;
  onPanelCapacityChange: (value: string) => void;
}

const SolarPanelConfiguration: React.FC<SolarPanelConfigurationProps> = ({
  panelCapacity,
  onPanelCapacityChange,
}) => {
  return (
    <div>
      <SectionHeader title="Solar Panel Configuration" />

      <div className="space-y-2 max-w-xs">
        <label htmlFor="panel-capacity" className={inputClass.label}>
          Panel Capacity (W)
        </label>

        <input
          id="panel-capacity"
          type="text"
          placeholder="Type here"
          value={panelCapacity}
          onChange={(e) => onPanelCapacityChange(e.target.value)}
          className={inputClass.input}
        />
        <CommonHeader size="sm">
          Used to calculate the recommended panel count
        </CommonHeader>
      </div>
    </div>
  );
};

export default SolarPanelConfiguration;
