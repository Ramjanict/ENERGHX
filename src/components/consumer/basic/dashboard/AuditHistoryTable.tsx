import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import { EnergyAuditHistoryItem, Pagination } from "@/store/consumer/basic/analysis/types/analysis";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Eye, FileText, XCircle } from "lucide-react";
import React from "react";

interface AuditHistoryTableProps {
  items: EnergyAuditHistoryItem[];
  pagination?: Pagination;
  page: number;
  onPageChange: (newPage: number) => void;
  selectedAuditId?: string;
  onSelectAudit: (id: string) => void;
  buildingNameMap?: Record<string, string>;
  isLoading?: boolean;
}

const AuditHistoryTable: React.FC<AuditHistoryTableProps> = ({
  items,
  pagination,
  page,
  onPageChange,
  selectedAuditId,
  onSelectAudit,
  buildingNameMap = {},
  isLoading = false,
}) => {
  const total = pagination?.total ?? items.length;
  const pageSize = pagination?.pageSize ?? 10;
  const pageCount = pagination?.pageCount ?? Math.max(1, Math.ceil(total / pageSize));

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            In Progress
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <CommonBorderWrapper isShadow className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <SectionHeader
          size="xl"
          title="Audit History"
          description="View and switch between all completed and pending building audits"
        />
        {total > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2DAD00]/10 text-[#2DAD00] w-fit">
            {total} Total Audits
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/80 text-xs font-semibold uppercase text-gray-700 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3.5">Audit ID</th>
              <th className="px-4 py-3.5">Type</th>
              <th className="px-4 py-3.5">Building</th>
              <th className="px-4 py-3.5">Date Created</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Score</th>
              <th className="px-4 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No audit history records found.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = item.id === selectedAuditId;
                const score =
                  item.result?.data?.value?.[0]?.report?.summary?.energyScore;
                const buildingName =
                  buildingNameMap[item.buildingId] ||
                  `Building ${item.buildingId.slice(0, 8)}...`;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-gray-50/80 ${
                      isSelected ? "bg-[#2DAD00]/5 font-medium" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-gray-700">
                      <span title={item.id}>
                        #{item.id ? `${item.id.slice(0, 8)}...` : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-gray-800">
                        {item.auditType ? item.auditType.replace("_", " ") : "BASIC AUDIT"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      {buildingName}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-green-600">
                      {score != null ? `${score}/100` : "-"}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectAudit(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#2DAD00] text-white shadow-sm"
                            : "bg-gray-100 hover:bg-[#2DAD00]/10 text-gray-700 hover:text-[#2DAD00]"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {isSelected ? "Viewing" : "View Report"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
              {Math.min((page - 1) * pageSize + 1, total)}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-700">
              {Math.min(page * pageSize, total)}
            </span>{" "}
            of <span className="font-medium text-gray-700">{total}</span> audits
          </div>

          <div className="flex items-center gap-2">
            <CommonButton
              variant="outline"
              size="sm"
              shape="rounded"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
              className="px-2.5 py-1 text-xs"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </CommonButton>

            <span className="text-xs font-medium text-gray-700 px-2">
              Page {page} of {pageCount}
            </span>

            <CommonButton
              variant="outline"
              size="sm"
              shape="rounded"
              disabled={page >= pageCount || isLoading}
              onClick={() => onPageChange(page + 1)}
              className="px-2.5 py-1 text-xs"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </CommonButton>
          </div>
        </div>
      )}
    </CommonBorderWrapper>
  );
};

export default AuditHistoryTable;
