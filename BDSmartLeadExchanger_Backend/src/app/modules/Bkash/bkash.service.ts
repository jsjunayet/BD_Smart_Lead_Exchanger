import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IBkash } from './bkash.interface';
import { Bkash } from './bkash.model';

const createBkash = async (body: IBkash) => {
  const { number, rate } = body;
  const newBkash = await Bkash.create({ number, rate });
  return newBkash;
};
const getAllBkashs = async () => {
  const list = await Bkash.find();
  return list;
};
const getBkashById = async (id: string) => {
  const result = await Bkash.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Not found');
  }
  return result;
};
const updateBkashStatus = async (id: string, body: Partial<IBkash>) => {
  const updated = await Bkash.findByIdAndUpdate(id, body, {
    new: true,
  });
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Not found');
  }
  return updated;
};
const DeletedBkashById = async (id: string) => {
  const deleted = await Bkash.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Not found');
  }
  return deleted;
};

export const BkashService = {
  createBkash,
  getAllBkashs,
  getBkashById,
  updateBkashStatus,
  DeletedBkashById,
};
