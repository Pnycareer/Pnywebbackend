import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Protected (you decide who has access)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // remove password from output
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Update a user by ID
// @route   PUT /api/users/:id
// @access  Protected (maybe admin-only)
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, email, contact, role } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields conditionally
    user.name = name || user.name;
    user.email = email || user.email;
    user.contact = contact || user.contact;
    user.role = role || user.role;

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};


export const toggleBlockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.blocked = !user.blocked;
    await user.save();

    res.status(200).json({ message: `User ${user.blocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating block status' });
  }
};



export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

