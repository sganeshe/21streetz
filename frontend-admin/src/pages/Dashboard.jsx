import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';
import { productService } from '../services/product.service';
import { subscriptionService } from '../services/subscription.service';

function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

function getWeekStart(week, year) {
  const jan4 = new Date(year, 0, 4);
  const mon = new Date(jan4);
  mon.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
  mon.setDate(mon.getDate() + (week - 1) * 7);
  return mon;
}

function weeksInYear(year) {
  return getISOWeek(new Date(year, 11, 28));
}

export default function DashboardOverview() {
  const now = new Date();
  const MIN_YEAR = now.getFullYear() - 4;
  const MAX_YEAR = now.getFullYear();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeSubscribers: 0,
    recentOrders: [],
  });

  const [selectedWeek, setSelectedWeek] = useState(getISOWeek(now));
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [chartData, setChartData] = useState([]);
  const [chartMeta, setChartMeta] = useState({
    weekStart: '',
    weekEnd: '',
    totalWeekRevenue: 0,
    totalWeekOrders: 0,
  });
  const [chartLoading, setChartLoading] = useState(false);

  const { showToast } = useToast();
  const router = useNavigate();

  // Main dashboard stats — runs once on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [dashRes, productsRes, subsRes] = await Promise.all([
          orderService.getDashboardStats().catch(() => ({ totalOrders: 0, totalRevenue: 0, recentOrders: [] })),
          productService.getAll().catch(() => ({ products: [] })),
          subscriptionService.getAll().catch(() => ({ subscribers: [] })),
        ]);
        const products = productsRes.products || productsRes || [];
        const subscribers = subsRes.subscribers || subsRes || [];
        const activeSubs = subscribers.filter(s => s.status === 'ACTIVE').length;
        setStats({
          revenue: dashRes.totalRevenue ?? 0,
          totalOrders: dashRes.totalOrders ?? 0,
          totalProducts: products.length,
          activeSubscribers: activeSubs,
          recentOrders: dashRes.recentOrders ?? [],
        });
      } catch {
        showToast('Failed to sync dashboard data', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [showToast]);

  // Chart data — reruns whenever week or year changes
  const fetchChartData = useCallback(async (week, year) => {
    setChartLoading(true);
    try {
      const res = await orderService.getWeeklyStats(week, year);
      setChartData(res.chartData ?? []);
      setChartMeta({
        weekStart: res.weekStart,
        weekEnd: res.weekEnd,
        totalWeekRevenue: res.totalWeekRevenue,
        totalWeekOrders: res.totalWeekOrders,
      });
    } catch {
      showToast('Failed to load chart data', 'error');
    } finally {
      setChartLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchChartData(selectedWeek, selectedYear);
  }, [selectedWeek, selectedYear, fetchChartData]);

  // Week navigation
  const goToPrevWeek = () => {
    if (selectedWeek > 1) {
      setSelectedWeek(w => w - 1);
    } else if (selectedYear > MIN_YEAR) {
      const prevYear = selectedYear - 1;
      setSelectedYear(prevYear);
      setSelectedWeek(weeksInYear(prevYear));
    }
  };

  const goToNextWeek = () => {
    const isCurrentWeek = selectedWeek === getISOWeek(now) && selectedYear === now.getFullYear();
    if (isCurrentWeek) return;
    const maxWeek = weeksInYear(selectedYear);
    if (selectedWeek < maxWeek) {
      setSelectedWeek(w => w + 1);
    } else {
      setSelectedYear(y => y + 1);
      setSelectedWeek(1);
    }
  };

  const handleYearChange = (newYear) => {
    const currentW = newYear === now.getFullYear() ? getISOWeek(now) : weeksInYear(newYear);
    setSelectedYear(newYear);
    setSelectedWeek(Math.min(selectedWeek, currentW));
  };

  // Formatting helpers
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const fmtShort = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const weekRangeLabel = () => {
    const start = getWeekStart(selectedWeek, selectedYear);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${fmtShort(start)} – ${fmtShort(end)}`;
  };

  const isCurrentWeek = selectedWeek === getISOWeek(now) && selectedYear === now.getFullYear();
  const isEarliestWeek = selectedWeek === 1 && selectedYear === MIN_YEAR;

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-neutral-400 font-sans">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm">Aggregating system data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-neutral-400 mt-1">Here is what is happening with your store today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-500 font-medium mb-1">Total Revenue</p>
              <h3 className="text-2xl font-semibold text-white">{formatCurrency(stats.revenue)}</h3>
            </div>
            <div className="p-2 bg-emerald-950/30 rounded-lg border border-emerald-900/50 text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-500 font-medium mb-1">Total Orders</p>
              <h3 className="text-2xl font-semibold text-white">{stats.totalOrders}</h3>
            </div>
            <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-500 font-medium mb-1">Active Inventory</p>
              <h3 className="text-2xl font-semibold text-white">{stats.totalProducts}</h3>
            </div>
            <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-500 font-medium mb-1">Mailing List</p>
              <h3 className="text-2xl font-semibold text-white">{stats.activeSubscribers}</h3>
            </div>
            <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-6">

          {/* Chart Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Revenue Overview</h3>
              {chartMeta.weekStart && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  {fmtShort(chartMeta.weekStart)} – {fmtShort(chartMeta.weekEnd)}
                  <span className="mx-1.5 text-neutral-600">·</span>
                  {chartMeta.totalWeekOrders} orders
                  <span className="mx-1.5 text-neutral-600">·</span>
                  {formatCurrency(chartMeta.totalWeekRevenue)}
                </p>
              )}
            </div>

            {/* Week Navigator */}
            <div className="flex items-center gap-1.5 bg-neutral-800/60 border border-neutral-700/80 rounded-xl px-2 py-1.5">
              <button
                onClick={goToPrevWeek}
                disabled={isEarliestWeek}
                aria-label="Previous week"
                className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex flex-col items-center min-w-[152px]">
                <span className="text-sm font-medium text-white leading-tight">
                  {weekRangeLabel()}
                </span>
                <span className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1">
                  Week {selectedWeek} ·
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                    className="bg-transparent text-neutral-500 text-[11px] cursor-pointer focus:outline-none hover:text-white transition-colors"
                  >
                    {Array.from({ length: 5 }, (_, i) => MAX_YEAR - i).map(y => (
                      <option key={y} value={y} className="bg-neutral-800 text-white">{y}</option>
                    ))}
                  </select>
                </span>
              </div>

              <button
                onClick={goToNextWeek}
                disabled={isCurrentWeek}
                aria-label="Next week"
                className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chart Body */}
          {chartLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
            </div>
          ) : chartData.length === 0 || chartData.every(d => d.revenue === 0) ? (
            <div className="h-[300px] flex items-center justify-center text-neutral-500 text-sm">
              No revenue recorded for this week.
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis dataKey="name" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Revenue' : 'Orders',
                    ]}
                    cursor={{ stroke: '#404040' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ffffff"
                    strokeWidth={2}
                    dot={{ fill: '#ffffff', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-white">Recent Orders</h3>
            <button
              onClick={() => router('/dashboard/orders')}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center mt-10">No orders placed yet.</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-950/50"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">#{order._id.substring(0, 8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{formatCurrency(order.totalPrice)}</p>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${order.isPaid ? 'text-emerald-500' : 'text-red-500'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}