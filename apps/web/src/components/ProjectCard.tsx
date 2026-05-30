import { Project } from "../types/project";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <div className="border p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold">{project.data.title}</h2>

      <p className="mt-2">{project.data.description}</p>

      <div className="flex gap-2 mt-3">
        {project.data.tags.map((tag) => (
          <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-sm">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
