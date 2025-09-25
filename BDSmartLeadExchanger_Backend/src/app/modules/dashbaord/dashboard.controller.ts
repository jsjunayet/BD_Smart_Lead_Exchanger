import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { getDashboardStats, getRecentActivities } from './dashboard.service'; // FIXED: Import both functions

export const getAdminDashboardStats = catchAsync(
  async (req: Request, res: Response) => {
    const stats = await getDashboardStats();
    const recentActivities = await getRecentActivities(10);

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        stats,
        recentActivities,
      },
    });
  },
);

export const getStatsWithFilter = catchAsync(
  async (req: Request, res: Response) => {
    const { timeframe } = req.query;
    const limit = parseInt(req.query.limit as string) || 10;

    const stats = await getDashboardStats();
    const recentActivities = await getRecentActivities(limit);

    res.status(200).json({
      success: true,
      message: 'Filtered stats fetched successfully',
      data: {
        stats,
        recentActivities,
        timeframe: timeframe || 'all',
      },
    });
  },
);
