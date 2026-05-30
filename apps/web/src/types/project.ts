export interface Project {
  _id: string;
  type: string;

  data: {
    title: string;
    description: string;
    tags: string[];
  };

  createdAt: string;
}
