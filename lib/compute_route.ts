import axios from 'axios';
import { Segment } from '../database/types.d';

const computeRoute = async (from: number, to: number): Promise<Segment[]> => {
  try {
    const res = await axios.get(`/api/routes?from=${from}&to=${to}`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (_error) {
    return [];
  }
  return [];
};

export default computeRoute;
