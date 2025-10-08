import { User } from '../Auth/auth.model';
import { Deposit } from '../deposit/deposit.model';
import { Job } from '../job/job.model';
import { JobSubmission } from '../JobSubmission/JobSubmission.model';
import { Report } from '../report/report.model';

export interface StatItem {
  title: string;
  value: string;
  trend: string;
  color: string;
}

export interface RecentActivity {
  type: 'deposit' | 'job' | 'submission' | 'report' | 'user';
  user: string;
  action: string;
  time: string;
  status: string;
}

export const getDashboardStats = async () => {
  try {
    console.log('📊 Fetching dashboard stats...'); // Debug log

    // Get counts for all metrics - REMOVE DATE FILTERS for total counts
    const [
      pendingDepositsCount,
      totalUsersCount,
      activeJobsCount,
      pendingSubmissionsCount,
      openReportsCount,
      yesterdayPendingDeposits,
      lastWeekUsersCount,
      yesterdayActiveJobs,
      yesterdayPendingSubmissions,
    ] = await Promise.all([
      // Current counts - NO DATE FILTER
      Deposit.countDocuments({ status: 'pending' }),
      User.countDocuments({ isDeleted: false }),
      Job.countDocuments({ approvedByAdmin: true }),
      JobSubmission.countDocuments({ status: 'submitted' }),
      Report.countDocuments({ status: 'pending' }),

      // Historical data for trends - FIXED DATE FILTERS
      Deposit.countDocuments({
        status: 'pending',
        createdAt: {
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          $lte: new Date(Date.now() - 0 * 60 * 60 * 1000), // Last 24 hours only
        },
      }),
      User.countDocuments({
        isDeleted: false,
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days only
        },
      }),
      Job.countDocuments({
        approvedByAdmin: true,
        createdAt: {
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours only
        },
      }),
      JobSubmission.countDocuments({
        status: 'submitted',
        createdAt: {
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours only
        },
      }),
    ]);

    console.log('📈 Counts:', {
      // Debug log
      pendingDepositsCount,
      totalUsersCount,
      activeJobsCount,
      pendingSubmissionsCount,
      openReportsCount,
      yesterdayPendingDeposits,
      lastWeekUsersCount,
      yesterdayActiveJobs,
      yesterdayPendingSubmissions,
    });

    // Calculate trends - FIXED: Use absolute values, not differences
    const depositTrend = yesterdayPendingDeposits; // Count from yesterday
    const userTrend = lastWeekUsersCount; // Count from last week
    const jobTrend = yesterdayActiveJobs; // Count from yesterday
    const submissionTrend = yesterdayPendingSubmissions; // Count from yesterday

    const stats: StatItem[] = [
      {
        title: 'Pending Deposits',
        value: pendingDepositsCount.toString(),
        trend:
          depositTrend > 0
            ? `${depositTrend} from yesterday`
            : 'No recent activity',
        color: 'bg-orange-500',
      },
      {
        title: 'Total Users',
        value: totalUsersCount.toString(),
        trend:
          userTrend > 0 ? `${userTrend} this week` : 'No new users this week',
        color: 'bg-blue-500',
      },
      {
        title: 'Active Jobs',
        value: activeJobsCount.toString(),
        trend: jobTrend > 0 ? `${jobTrend} new today` : 'No new jobs today',
        color: 'bg-green-500',
      },
      {
        title: 'Pending Submissions',
        value: pendingSubmissionsCount.toString(),
        trend:
          submissionTrend > 0
            ? `${submissionTrend} recent`
            : 'No recent submissions',
        color: 'bg-purple-500',
      },
      {
        title: 'Open Reports',
        value: openReportsCount.toString(),
        trend: 'Real-time',
        color: 'bg-red-500',
      },
    ];

    return stats;
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    throw new Error('Error fetching dashboard stats');
  }
};

export const getRecentActivities = async (
  limit: number = 10,
): Promise<RecentActivity[]> => {
  try {
    console.log('🕒 Fetching recent activities...'); // Debug log

    const recentActivities: RecentActivity[] = [];

    // Get recent deposits - FIXED: Check if collection has data first
    const recentDeposits = await Deposit.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    console.log('💰 Deposits found:', recentDeposits.length); // Debug log

    recentDeposits.forEach((deposit) => {
      recentActivities.push({
        type: 'deposit',
        user: (deposit.user as any)?.name || 'Unknown User',
        action: `deposited $${deposit.amount}`,
        time: getTimeAgo(deposit.createdAt),
        status: deposit.status,
      });
    });

    // Get recent jobs
    const recentJobs = await Job.find({})
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    console.log('💼 Jobs found:', recentJobs.length); // Debug log

    recentJobs.forEach((job) => {
      recentActivities.push({
        type: 'job',
        user: (job.postedBy as any)?.name || 'Unknown User',
        action: 'posted new job',
        time: getTimeAgo(job.createdAt),
        status: job.approvedByAdmin ? 'approved' : 'pending',
      });
    });

    // Get recent submissions
    const recentSubmissions = await JobSubmission.find({})
      .populate('user', 'name email')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
      .limit(limit);

    console.log('📋 Submissions found:', recentSubmissions.length); // Debug log

    recentSubmissions.forEach((submission) => {
      recentActivities.push({
        type: 'submission',
        user: (submission.user as any)?.name || 'Unknown User',
        action: 'submitted task proof',
        time: getTimeAgo(submission.createdAt),
        status: submission.status,
      });
    });

    // Get recent reports
    const recentReports = await Report.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    console.log('⚠️ Reports found:', recentReports.length); // Debug log

    recentReports.forEach((report) => {
      recentActivities.push({
        type: 'report',
        user: (report.user as any)?.name || 'Unknown User',
        action: 'reported submission',
        time: getTimeAgo(report.createdAt),
        status: report.status,
      });
    });

    // Get recent user registrations
    const recentUsers = await User.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit);

    console.log('👥 Users found:', recentUsers.length); // Debug log

    recentUsers.forEach((user) => {
      recentActivities.push({
        type: 'user',
        user: user.name,
        action: 'registered new account',
        time: getTimeAgo(user.createdAt),
        status: user.isApproved ? 'approved' : 'pending',
      });
    });

    console.log('📊 Total activities before sort:', recentActivities.length);

    // Sort all activities by time and return limited results
    const sortedActivities = recentActivities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);

    console.log('🎯 Final activities count:', sortedActivities.length); // Debug log

    return sortedActivities;
  } catch (error) {
    console.error('❌ Error fetching recent activities:', error);
    throw new Error('Error fetching recent activities');
  }
};

// Helper function to convert date to time ago string
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
};
