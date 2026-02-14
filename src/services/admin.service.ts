import Restaurant from '../models/restaurant.model';
import Event from '../models/event.model';
import Article from '../models/article.model';

class AdminService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const totalHotels = await Restaurant.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'upcoming' });
    const publishedArticles = await Article.countDocuments({ status: 'published' });

    // Aggregating views from restaurants (example logic)
    const restaurants = await Restaurant.find({}, 'views');
    let monthlyViews = 0;
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    restaurants.forEach((r) => {
      if (r.views && Array.isArray(r.views)) {
        r.views.forEach((v) => {
          if (v.date >= oneMonthAgo) {
            monthlyViews += v.count;
          }
        });
      }
    });

    return {
      totalHotels,
      activeEvents,
      publishedArticles,
      monthlyViews,
    };
  }

  /**
   * Get recent activity log (simple mock or from a dedicated Log model)
   * For now, returning recently created items as activity
   */
  async getRecentActivity() {
    const recentRestaurants = await Restaurant.find().sort({ createdAt: -1 }).limit(3);
    const recentArticles = await Article.find().sort({ createdAt: -1 }).limit(3);
    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(3);

    const activity = [
      ...recentRestaurants.map((r) => ({
        type: 'restaurant',
        name: r.name,
        date: r.createdAt,
        action: 'Added new restaurant',
      })),
      ...recentArticles.map((a) => ({
        type: 'article',
        name: a.title,
        date: a.createdAt,
        action: 'Published article',
      })),
      ...recentEvents.map((e) => ({
        type: 'event',
        name: e.name,
        date: e.createdAt,
        action: 'Scheduled event',
      })),
    ];

    return activity.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  }
}

export default new AdminService();
