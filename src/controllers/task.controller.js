const taskService = require("../services/task.service");

const getAll = async (req, res) => {
  try {
    const { statusCode, data, message } = await taskService.getAall(req.query);

    return res.status(statusCode).json({ data, message: req.t(message) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { statusCode, data, message } = await taskService.getOne(req.params.id);

    if(data == null)
      return res.status(statusCode).json({ message: req.t(message) });

    return res.status(statusCode).json({
      data,
      message: req.t(message),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { body, user } = req;

    if (isEmpty(body.title) || isEmpty(body.description))
      return res.status(400).json({ message: req.t("record.required_fields_missing") });

    const { statusCode, data, message } = await taskService.create({
      title: body.title,
      description: body.description,
      author: user._id,
    });

    return res.status(statusCode).json({ data, message: req.t(message)});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    
    const { title, description, completed } = req.body;

    if (isEmpty(title) || isEmpty(description))
      return res.status(400).json({ message: req.t("record.required_fields_missing") });

    const { statusCode, data, message } = await taskService.update(req.params.id, {
      title,
      description,
      completed,
    });

    if(data == null)
      return res.status(statusCode).json({ message: req.t(message) });

    return res.status(statusCode).json({ data, message: req.t(message) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { statusCode, data, message } = await taskService.remove(req.params.id);

    if(data == null)
      return res.status(statusCode).json({ message: req.t(message) });

    return res.status(statusCode).json({ data, message: req.t(message) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
