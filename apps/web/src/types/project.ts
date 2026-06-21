export interface Project {
  creatorId: {
    _id: string;
    username: string;
  };
  title: string;
  description: string;

  tags: string[];

  stats: {
    likes: number;
    comments: number;
    views: number;
  };

  createdAt: string;
  updatedAt: string;
}
