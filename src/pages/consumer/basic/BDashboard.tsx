import CommonButton from "@/common/button/CommonButton";
import DashOverview from "@/components/consumer/basic/dashboard/DashOverview";
import Journey from "@/components/consumer/basic/dashboard/Journey";
import RenewableMicroservices from "@/components/consumer/basic/dashboard/RenewableMicroservices";
import StatCard from "@/components/consumer/basic/dashboard/StatCard";
import Welcome from "@/components/consumer/basic/dashboard/Welcome";
import AuditHistoryTable from "@/components/consumer/basic/dashboard/AuditHistoryTable";
import EnergyAnalysisReport from "@/components/consumer/basic/analysis/EnergyAnalysisReport";
import { useGetEnergyAuditHistoryQuery } from "@/store/consumer/basic/analysis/analysisApi";
import { EnergyAuditResponse } from "@/store/consumer/basic/analysis/types/analysis";
import { useGetAllBuildingsQuery } from "@/store/consumer/basic/building/buildingApi";
import React, { useMemo, useRef, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Calendar, Building2, ChevronDown, Sparkles } from "lucide-react";

const BDashboard: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const {
    data: auditHistory,
    isLoading: isAuditLoading,
    isFetching: isAuditFetching,
  } = useGetEnergyAuditHistoryQuery({
    page,
    pageSize,
  });

  const { data: buildingsData, isLoading: isBuildingsLoading } =
    useGetAllBuildingsQuery();

  const buildings = buildingsData?.data ?? [];
  const buildingsCount = buildings.length;

  const buildingNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    buildings.forEach((b) => {
      map[b.user_building_details_id] = b.building_name;
    });
    return map;
  }, [buildings]);

  const items = auditHistory?.items ?? [];
  const pagination = auditHistory?.pagination;
  const totalAudits = pagination?.total ?? items.length;

  const completedAuditsCount = items.filter(
    (item) => item.status === "COMPLETED",
  ).length;
  const inProgressAuditsCount = items.filter(
    (item) => item.status === "IN_PROGRESS" || item.status === "PENDING",
  ).length;

  // Selected audit (defaults to first item if not set or found)
  const selectedAudit = useMemo(() => {
    if (selectedAuditId) {
      const found = items.find((item) => item.id === selectedAuditId);
      if (found) return found;
    }
    return items[0] ?? null;
  }, [items, selectedAuditId]);

  // Convert selected audit to EnergyAuditResponse format for EnergyAnalysisReport
  const formattedReport: EnergyAuditResponse | null = useMemo(() => {
    if (!selectedAudit?.result) return null;
    return {
      status: 200,
      message: "Success",
      data: {
        auditType: selectedAudit.auditType,
        result: selectedAudit.result,
      },
    };
  }, [selectedAudit]);

  const handleSelectAudit = (id: string) => {
    setSelectedAuditId(id);
    reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasAudits = items.length > 0 || (totalAudits > 0 && !isAuditLoading);

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-10">
      <Welcome
        title="Welcome to EnerghxPLUS Platform"
        description={
          hasAudits
            ? "Monitor your building's energy efficiency metrics, view audit reports, and evaluate renewable energy potentials."
            : "Begin your energy optimization journey with our comprehensive audit microservice."
        }
        actions={
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <CommonButton
              shape="rounded"
              size="lg"
              rightIcon={<FaArrowRightLong className="w-4 h-4" />}
              className="w-full! sm:w-auto"
              to="../analysis"
            >
              {hasAudits ? "Start New Audit" : "Start Audit"}
            </CommonButton>

            {hasAudits && (
              <CommonButton
                variant="outline"
                shape="rounded"
                className="w-full! sm:w-auto"
                onClick={handleScrollToHistory}
              >
                View Audit History
              </CommonButton>
            )}
          </div>
        }
      />

      {/* Dynamic Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Buildings Created"
          value={isBuildingsLoading ? "..." : buildingsCount}
          color="text-[#2DAD00]!"
        />
        <StatCard
          label="Audits Completed"
          value={
            isAuditLoading
              ? "..."
              : totalAudits > 0
                ? totalAudits
                : completedAuditsCount
          }
          color="text-[#F59E0B]!"
        />
        <StatCard
          label="Audits In Progress"
          value={isAuditLoading ? "..." : inProgressAuditsCount}
          color="text-[#3B82F6]!"
        />
        <StatCard
          label="Available Services"
          value="3"
          color="text-[#8B5CF6]!"
        />
      </div>

      {/* Loading state skeleton */}
      {isAuditLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto mb-4" />
          <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto mb-6" />
          <div className="h-64 bg-slate-100 rounded" />
        </div>
      )}

      {/* Audit Analysis & Report Section (when audits exist) */}
      {!isAuditLoading && hasAudits && selectedAudit && (
        <div ref={reportRef} className="space-y-6">
          {/* Active Audit Context Selector Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-[#E7E9E8] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2DAD00]/10 text-[#2DAD00]">
                <Sparkles className="w-3.5 h-3.5" />
                Active Audit Report
              </span>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 font-medium">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>
                  {buildingNameMap[selectedAudit.buildingId] ||
                    `Building: ${selectedAudit.buildingId.slice(0, 8)}...`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  {new Date(selectedAudit.createdAt).toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
            </div>

            {/* Selector if multiple audits exist */}
            {items.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">
                  Select Audit:
                </span>
                <div className="relative">
                  <select
                    value={selectedAudit.id}
                    onChange={(e) => handleSelectAudit(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm rounded-lg pl-3 pr-8 py-2 font-medium focus:ring-1 focus:ring-green-500 focus:outline-none cursor-pointer"
                  >
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.auditType.replace("_", " ")} -{" "}
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        ({item.status})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Render Full Energy Analysis Report */}
          <EnergyAnalysisReport report={formattedReport} />
        </div>
      )}

      {/* Audit History Table */}
      {!isAuditLoading && hasAudits && (
        <div ref={historyRef}>
          <AuditHistoryTable
            items={items}
            pagination={pagination}
            page={page}
            onPageChange={setPage}
            selectedAuditId={selectedAudit?.id}
            onSelectAudit={handleSelectAudit}
            buildingNameMap={buildingNameMap}
            isLoading={isAuditFetching}
          />
        </div>
      )}

      {/* When no audits exist yet, display the overview and call to action */}
      {!isAuditLoading && !hasAudits && <DashOverview />}

      {/* Renewable Microservices Section (unlocked when audit completed) */}
      <RenewableMicroservices
        isLocked={!hasAudits || completedAuditsCount === 0}
      />

      {/* Plan Journey Section */}
      <Journey />
    </div>
  );
};

export default BDashboard;
