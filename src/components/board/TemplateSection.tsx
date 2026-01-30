import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api.ts";
import { Loader } from "lucide-react";

interface Template {
    id: string;
    name: string;
}

export function TemplateSection() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    async function fetchTemplates() {
        try {
            const res = await apiClient.get<{ data: Template[] }>("/templates");
            setTemplates(res.data.data);
            setLoading(false);
        }
        catch (err) {
            console.error("Error fetching templates: ", err);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold pl-4 mb-4">Templates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className="h-32 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center p-4"
                    >
                        <div className="text-center">
                            <h3 className="text-white font-semibold text-lg">
                                {template.name}
                            </h3>
                            {/* {template.description && (
                                <p className="text-white/80 text-sm mt-1">
                                    {template.description}
                                </p>
                            )} */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}