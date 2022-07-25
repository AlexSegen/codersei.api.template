const { v4: uuid } = require("uuid");
const aqp = require("api-query-params");

const Model = require("../models/task.model");
const {serviceResult} = require("../helpers/serviceResult");

const getAall = async (query) => {
  const { filter, limit, sort } = aqp(query);
  try {
    const records = await Model.find(filter).limit(limit).sort(sort);

    return serviceResult(200, records, "All records");
  } catch (error) {
    throw error;
  }
};

const getOne = async (id) => {
  try {
    const record = await Model.findById(id);

    return serviceResult(200, record, "Record found");

  } catch (error) {
    if (error.kind === "ObjectId")
      return serviceResult(404, null, `Record not found with id ${id}`);

    throw error;
  }
};

const create = async ({ title, description }) => {
  try {
    const data = new Model({
      title,
      description,
      identifier: uuid(),
    });

    let record = await data.save();

    record = await Model.findById(record._id);

    return serviceResult(201, record, "Record created");
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

    updated = await Model.findById(updated._id);

    return serviceResult(200, updated, "Record updated");
  } catch (error) {
    if (error.kind === "ObjectId")
      return serviceResult(404, null, null, `Record not found with id ${id}`);

    throw error;
  }
};

const remove = async (id) => {
  try {
    await Model.findByIdAndDelete(id);

    return serviceResult(200, { _id: id }, "Record deleted");
  } catch (error) {
    if (error.kind === "ObjectId")
      return serviceResult(404, null, null, `Record not found with id ${id}`);

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
