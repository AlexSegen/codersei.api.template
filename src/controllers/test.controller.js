const getTest = async (req, res) => {
  try {
    return res.status(200).json({
      data: {
        name: "test",
        user: req.user
      },
      message: "test",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
    getTest,
  };
  