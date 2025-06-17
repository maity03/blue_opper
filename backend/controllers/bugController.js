const Bug = require('../models/Bug');
const User = require('../models/User');
const { generateTags } = require('../services/tagService');

// Get all bugs with filtering and pagination
const getBugs = async (req, res) => {
  try {
    const { status, severity, assignedTo, tags, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (tags) {
      // Support both single tag and multiple tags (comma-separated)
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const bugs = await Bug.find(filter)
      .populate('reportedBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Bug.countDocuments(filter);

    res.json({
      bugs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single bug by ID
const getBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('reportedBy', 'username email')
      .populate('assignedTo', 'username email');

    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    res.json(bug);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new bug
const createBug = async (req, res) => {
  try {
    const { title, description, severity, assignedTo } = req.body;

    // Generate tags using AI
    const tags = await generateTags(title, description);

    const bug = new Bug({
      title,
      description,
      severity,
      assignedTo: assignedTo || null,
      reportedBy: req.user.id,
      tags
    });

    await bug.save();
    
    const populatedBug = await Bug.findById(bug._id)
      .populate('reportedBy', 'username email')
      .populate('assignedTo', 'username email');

    res.status(201).json(populatedBug);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Update bug
const updateBug = async (req, res) => {
  try {
    const { title, description, severity, status, assignedTo } = req.body;

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    // Update fields
    if (title !== undefined) bug.title = title;
    if (description !== undefined) bug.description = description;
    if (severity !== undefined) bug.severity = severity;
    if (status !== undefined) bug.status = status;
    if (assignedTo !== undefined) bug.assignedTo = assignedTo || null;

    // Regenerate tags if title or description changed
    if (title !== undefined || description !== undefined) {
      const newTags = await generateTags(bug.title, bug.description);
      bug.tags = newTags;
    }

    await bug.save();
    
    const updatedBug = await Bug.findById(bug._id)
      .populate('reportedBy', 'username email')
      .populate('assignedTo', 'username email');

    res.json(updatedBug);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete bug
const deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    // Only allow deletion by the person who reported it or admin
    if (bug.reportedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this bug' });
    }

    await Bug.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get users for assignment dropdown
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get bug statistics
const getBugStats = async (req, res) => {
  try {
    const stats = await Bug.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const severityStats = await Bug.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      statusStats: stats,
      severityStats: severityStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Regenerate tags for a bug
const regenerateTags = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    // Generate new tags
    const newTags = await generateTags(bug.title, bug.description);
    bug.tags = newTags;

    await bug.save();
    
    const updatedBug = await Bug.findById(bug._id)
      .populate('reportedBy', 'username email')
      .populate('assignedTo', 'username email');

    res.json(updatedBug);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all unique tags for filtering
const getAllTags = async (req, res) => {
  try {
    const tags = await Bug.distinct('tags');
    res.json(tags.filter(tag => tag && tag.trim() !== ''));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
  getUsers,
  getBugStats,
  regenerateTags,
  getAllTags
}; 