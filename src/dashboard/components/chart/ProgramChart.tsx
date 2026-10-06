import MiniSpinner from "@/common/loading/MiniSpinner";
import { useGetAllProgramQuery } from "@/store/LMS/program/programApi";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ProgramChart = () => {
  const { data, isLoading } = useGetAllProgramQuery();

  const allProgram = data?.data ?? [];

  const processChartData = () => {
    // For price distribution chart
    const priceData = allProgram?.map((program) => ({
      name: program.title,
      price: program.price,
      publishedFor: program.publishedFor,
    }));

    // For publication type pie chart
    const publicationCount = allProgram.reduce(
      (acc, program) => {
        acc[program.publishedFor] = (acc[program.publishedFor] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const publicationData = Object.entries(publicationCount).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );

    // For creation timeline
    const creationData = allProgram.map((program) => ({
      date: format(new Date(program.createdAt), "yyyy-MM-dd"),
      title: program.title,
      price: program.price,
      publishedFor: program.publishedFor,
    }));

    return { priceData, publicationData, creationData };
  };

  const { priceData, publicationData, creationData } = processChartData();

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-8 w-full pb-8">
      {isLoading ? (
        <MiniSpinner />
      ) : (
        <>
          {/* Price Distribution Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Program Price Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="price" fill="#2dad00" name="Price ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Publication Type Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Publication Type Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={publicationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#2dad00"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {publicationData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Creation Timeline Scatter Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Program Creation Timeline
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis
                  dataKey="date"
                  name="Date"
                  tickFormatter={(date) => format(new Date(date), "MMM dd")}
                />
                <YAxis dataKey="price" name="Price ($)" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border rounded shadow">
                          <p>
                            <strong>{data.title}</strong>
                          </p>
                          <p>Price: ${data.price}</p>
                          <p>Published for: {data.publishedFor}</p>
                          <p>Created: {data.date}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Scatter
                  name="Programs"
                  data={creationData}
                  fill="#8884d8"
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Program Details</h2>
            <div className="overflow-x-auto">
              <div className="min-w-full grid grid-cols-5 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="px-6 py-3 text-left">Title</div>
                <div className="px-6 py-3 text-left">Description</div>
                <div className="px-6 py-3 text-left">Price</div>
                <div className="px-6 py-3 text-left">Published For</div>
                <div className="px-6 py-3 text-left">Created At</div>
              </div>
              <div className="bg-white divide-y divide-gray-200">
                {allProgram.map((program) => (
                  <div
                    key={program.id}
                    className="grid grid-cols-5 text-sm text-gray-700"
                  >
                    <div className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {program.title}
                    </div>
                    <div className="px-6 py-4 whitespace-nowrap line-clamp-1 text-gray-500">
                      {program.description}
                    </div>
                    <div className="px-6 py-4 whitespace-nowrap text-gray-500">
                      ${program.price}
                    </div>
                    <div className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {program.publishedFor}
                    </div>
                    <div className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {format(new Date(program.createdAt), "yyyy-MM-dd HH:mm")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgramChart;
