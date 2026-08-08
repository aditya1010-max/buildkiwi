import { Project } from "../../../types/project";

interface ProjectGalleryProps {
  project: Project;
}

export default function ProjectGallery({ project }: ProjectGalleryProps) {
  const imageUrl = project.coverImage
    ? `http://localhost:3000/uploads/${project.coverImage}`
    : "/placeholder.png";

  return (
    <div className="project-gallery">
      <img
        src={imageUrl}
        alt={project.title}
        className="project-gallery_image"
      />
    </div>
  );
}
