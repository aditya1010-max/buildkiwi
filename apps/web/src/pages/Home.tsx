import { useEffect, useState } from "react"

export default function Home() {

    const [projects, setProjects] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/projects"
                );

                const data = await response.json();

                setProjects(data);

            } catch (error) {
                console.log("error fetching projects,", error);
            }
        };

        fetchProjects();
    }, []);
    return (
        <div>
            <h1>BuildKiwi</h1>

            {projects.map((projects) => (
                <div key={projects._id}>
                    <h2>{projects.data.title}</h2>
                    <p>{projects.data.description}</p>
                        <a 
                            href={projects.data.link}
                            target="_blank"
                            rel="noreferrer"
                        >
                         Visit Project
                        </a>
                    
                </div>
            ))}
        </div>
    );
}