export interface Project {
  // i need a unique id here
  _id: string;

  creatorId: {
    _id: string;
    username: string;
  };
  title: string;
  description: string;

  tags: string[];

  coverImage: string;

  links: {
    github: string;
    demo: string;
  };

  stats: {
    likes: number;
    comments: number;
    views: number;
  };

  createdAt: string;
  updatedAt: string;
}
