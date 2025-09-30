import { IStats } from './stats.interface';
import Stats from './stats.model';

const createStats = async (payload: IStats) => {
  const result = await Stats.create(payload);
  return result;
};

const getAllStats = async () => {
  const result = await Stats.find();
  return result;
};

const getSingleStats = async (id: string) => {
  const result = await Stats.findById(id);
  return result;
};

const updateStats = async (id: string, payload: Partial<IStats>) => {
  const result = await Stats.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteStats = async (id: string) => {
  const result = await Stats.findByIdAndDelete(id);
  return result;
};

export const StatsService = {
  createStats,
  getAllStats,
  getSingleStats,
  updateStats,
  deleteStats,
};
