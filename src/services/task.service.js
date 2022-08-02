const { v4: uuid } = require("uuid");
const aqp = require("api-query-params");

const Model = require("../models/task.model");
const {serviceResult} = require("../helpers/serviceResult");

const getAall = async (query) => {
  const { filter, limit, sort } = aqp(query);
  try {
    const records = await Model.find(filter)
    .populate({ path: "author", select: "avatar first_name last_name" })
    .limit(limit).sort(sort);

    return serviceResult(200, records, "record.list_all");
  } catch (error) {
    throw error;
  }
};

const getOne = async (id) => {
  try {
    const record = await Model.findById(id).populate({ path: "author", select: "avatar first_name last_name" });

    if (!record)
      return serviceResult(404, null, `record.not_found`);
    
    return serviceResult(200, record, "record.details");

  } catch (error) {
    if (error.kind === "ObjectId")
      return serviceResult(404, null, `record.not_found`);

    throw error;
  }
};

const create = async ({ title, description, author }) => {
  try {
    const data = new Model({
      title,
      description,
      author,
      identifier: uuid(),
    });

    let record = await data.save();

    record = await Model.findById(record._id)
    .populate({ path: "author", select: "avatar first_name last_name" });

    return serviceResult(201, record, "record.created");
  } catch (error) {
    throw error;
  }
};

const update = async (id, { title, description, completed }) => {
  try {
    let updated = await Model.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true }
    );

    updated = await Model.findById(updated._id)
    .populate({ path: "author", select: "avatar first_name last_name" });

    return serviceResult(200, updated, "record.updated");
  } catch (error) {
    if (error.kind === "ObjectId")
      return serviceResult(404, null, null, `record.not_found`);

    throw error;
  }
};

const remove = async (id) => {
  try {
    await Model.findByIdAndDelete(id);

    return serviceResult(200, { _id: id }, "record.deleted");
  } catch (error) {
    if (error.kind === "ObjectId")
      return serviceResult(404, null, null, `record.not_found`);

    throw error;
  }
};

module.exports = {
  getAall,
  getOne,
  create,
  update,
  remove,
};
