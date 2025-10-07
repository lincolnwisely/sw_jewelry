const dbManager = require('../utils/database');
const Subscriber = require('../models/Subscriber');

// POST - Subscribe to waitlist
const subscribe = async (req, res) => {
  try {
    const collection = await dbManager.getCollection('subscribers');

    // Create Subscriber instance
    const subscriber = new Subscriber(req.body);

    // Normalize email
    subscriber.normalizeEmail();

    // Validate subscriber data
    const validationErrors = subscriber.validate();
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if email already subscribed
    const existingSubscriber = await collection.findOne({
      email: subscriber.email
    });

    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed to our waitlist'
      });
    }

    // Insert subscriber
    await collection.insertOne(subscriber.toObject());

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed! We\'ll notify you when we launch.',
      data: {
        email: subscriber.email,
        name: subscriber.getDisplayName()
      }
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing subscription',
      error: error.message
    });
  }
};

// GET - Get all subscribers (admin only)
const getAllSubscribers = async (req, res) => {
  try {
    const collection = await dbManager.getCollection('subscribers');

    const subscribers = await collection
      .find({})
      .sort({ subscribedAt: -1 })
      .toArray();

    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers',
      error: error.message
    });
  }
};

// GET - Get subscriber stats (admin only)
const getSubscriberStats = async (req, res) => {
  try {
    const collection = await dbManager.getCollection('subscribers');

    const totalSubscribers = await collection.countDocuments();
    const notifiedCount = await collection.countDocuments({ isNotified: true });
    const pendingCount = totalSubscribers - notifiedCount;

    // Get recent subscribers (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = await collection.countDocuments({
      subscribedAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      data: {
        total: totalSubscribers,
        notified: notifiedCount,
        pending: pendingCount,
        recentSignups: recentCount
      }
    });
  } catch (error) {
    console.error('Error fetching subscriber stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriber statistics',
      error: error.message
    });
  }
};

// DELETE - Unsubscribe (by email)
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const collection = await dbManager.getCollection('subscribers');

    const result = await collection.deleteOne({
      email: email.toLowerCase().trim()
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our subscriber list'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing unsubscribe request',
      error: error.message
    });
  }
};

module.exports = {
  subscribe,
  getAllSubscribers,
  getSubscriberStats,
  unsubscribe
};
