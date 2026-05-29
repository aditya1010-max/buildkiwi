import { useEffect, useState } from "react";
import { fetchProjects } from "../api/project.api";
import { Project } from "../types/project";

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoading(true);
                const response = await fetchProjects(1, 10); // Fetch first page with 10 projects(needs to change based on pagination implementation)
                setProjects(response.data);
            }catch (err) {
                setError(
                    "failed to load projects."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    return {
        projects, loading, error
    };
};