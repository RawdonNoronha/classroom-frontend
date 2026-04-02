import { DataProvider, BaseRecord, GetListParams, GetListResponse } from "@refinedev/core";

interface Subject extends BaseRecord {
  id: string;
  code: string;
  name: string;
  department: string;
  description: string;
}

const mockSubjects: Subject[] = [
  {
    id: "1",
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    description: "A foundational course covering basic programming concepts, algorithms, and data structures."
  },
  {
    id: "2",
    code: "MATH201",
    name: "Calculus II",
    department: "Mathematics",
    description: "Advanced calculus topics including integration techniques, series, and multivariable calculus."
  },
  {
    id: "3",
    code: "ENG301",
    name: "Advanced English Literature",
    department: "English",
    description: "Exploration of classic and contemporary literature with emphasis on critical analysis and writing."
  }
];

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({ resource }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") return { data: [] as TData[], total: 0 };
    
    return {
      data: mockSubjects as unknown as TData[],
      total: mockSubjects.length
    };

  },

  getOne: async () => { throw new Error('This function is not present in mock') },
  create: async () => { throw new Error('This function is not present in mock') },
  update: async () => { throw new Error('This function is not present in mock') },
  deleteOne: async () => { throw new Error('This function is not present in mock') },

  getApiUrl: () => '',
}