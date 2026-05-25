import { useState } from "react";

export default function Submit() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        link: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }


    const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
    ) => {
    e.preventDefault();

    try {
        const response = await fetch(
        "http://localhost:3000/projects",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            type: "web_app",
            data: form
            })
        }
        );

        const result = await response.json();

        console.log(result);

    } catch (error) {
        console.error("Error submitting project", error);
    }
    };

    return (
        <div>
            <h2>Form</h2>

            <form onSubmit={handleSubmit}>
                <input 
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange} 
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />
                <input
                    name="link"
                    placeholder="Link"
                    value={form.link}
                    onChange={handleChange}
                />
                <button type="submit">Sumbit</button>
            </form>
        </div>
    );
}