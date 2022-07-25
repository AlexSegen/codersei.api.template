const taskService = require("../services/task.service");

const getAll = async (req, res) => {
  try {
    const { code, data, message } = await taskService.getAall(req.query);

    return res.status(code).json({ data, message });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { code, data, message } = await taskService.getOne(req.params.id);

    return res.status(code).json({
      data,
      message,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { body } = req;

    if (!body.title || !body.description) {
      return res.status(400).json({ message: "Required fields missing." });
    }

    const { code, data, message } = await taskService.create({
      title: body.title,
      description: body.description,
    });

    return res.status(code).json({ data, message });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const { code, data, message } = await taskService.update(req.params.id, {
      title,
      description,
      completed,
    });

    return res.status(code).json({ data, message });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { code, data, message } = await taskService.remove(req.params.id);

    return res.status(code).json({ data, message });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
