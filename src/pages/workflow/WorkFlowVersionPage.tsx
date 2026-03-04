import React, { useState } from "react";
import { WorkflowSection } from "../../components/workflowVersion/WorkflowSection";
import { WORKFLOWS } from "../../../sampleData/WorkFlowVersionData";
import { CompareModal } from "../../components/workflowVersion/CompareModal";
import { ViewModal } from "../../components/workflowVersion/ViewModal";

export const WorkflowVersionPage: React.FC = () => {
    const [workflows, setWorkflows] = useState(WORKFLOWS);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    const [compareVersions, setCompareVersions] = useState<number[]>([]);
    const [viewVersion, setViewVersion] = useState<number | null>(null);

    // checkbox selection
    const handleToggle = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : prev.length < 2
                    ? [...prev, id]
                    : prev
        );
    };

    // delete
    const handleDeleteVersion = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this version?")) return;

        const updatedWorkflows = workflows.map((wf) => ({
            ...wf,
            versions: wf.versions.filter((v) => v.id !== id),
        }));
        setWorkflows(updatedWorkflows);

        // Remove from selected if it was selected
        setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    };

    // Rollback version
    const handleRollbackVersion = (versionId: number) => {
        // Find the version and its workflow
        const workflow = workflows.find((wf) =>
            wf.versions.some((v) => v.id === versionId)
        );
        if (!workflow) return;

        const version = workflow.versions.find((v) => v.id === versionId)!;

        if (version.status === "Active") {
            alert("This version is already active.");
            return;
        }

        if (version.status === "Deprecated") {
            alert("Cannot rollback to a deprecated version.");
            return;
        }

        if (!window.confirm(`Are you sure you want to rollback to version ${version.version}?`))
            return;

        const updatedWorkflows = workflows.map((wf) => ({
            ...wf,
            versions: wf.versions.map((v) => {
                if (v.id === versionId) return { ...v, status: "Active" };
                if (v.status === "Active") return { ...v, status: "Archived" };
                return v;
            }),
        }));

        // @ts-ignore
        setWorkflows(updatedWorkflows);
        alert(`Rolled back to version ${version.version} successfully!`);
    };
    // Get version by ID
    const getVersionById = (id: number) => {
        for (const wf of workflows) {
            const version = wf.versions.find((v) => v.id === id);
            if (version) return version;
        }
        return null;
    };

    // Compare
    const handleCompareClick = () => {
        if (selectedIds.length === 2) {
            setCompareVersions(selectedIds);
        } else {
            alert("Please select exactly 2 versions to compare.");
        }
    };

    const handleFilterChange = (category: string | null) => setFilterCategory(category);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchQuery(e.target.value);

    const filteredWorkflows = workflows
        .filter((wf) => !filterCategory || wf.category === filterCategory)
        .map((wf) => ({
            ...wf,
            versions: wf.versions.filter(
                (v) =>
                    v.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    v.description.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((wf) => wf.versions.length > 0);

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <h1 className="text-xl font-bold text-slate-800 mb-4">Workflow Versions</h1>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search versions..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring focus:border-blue-400"
                />

                <select
                    value={filterCategory || ""}
                    onChange={(e) => handleFilterChange(e.target.value || null)}
                    className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring focus:border-blue-400"
                >
                    <option value="">All Categories</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Legal">Legal</option>
                </select>

                <button
                    onClick={handleCompareClick}
                    disabled={selectedIds.length !== 2}
                    className={`px-4 py-2 rounded-lg font-semibold text-white ${
                        selectedIds.length === 2
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-purple-300 cursor-not-allowed"
                    }`}
                >
                    Compare
                </button>
            </div>

            {/* workflow Section */}
            <div className="space-y-4">
                {filteredWorkflows.map((workflow) => (
                    <WorkflowSection
                        key={workflow.id}
                        workflow={workflow}
                        selectedIds={selectedIds}
                        onToggleVersion={handleToggle}
                        onDeleteVersion={handleDeleteVersion}
                        onRollbackVersion={handleRollbackVersion}
                        onViewVersion={(id) => setViewVersion(id)}
                    />
                ))}
            </div>


            {compareVersions.length === 2 && (
                <CompareModal
                    workflowName="Comparison"
                    versionA={getVersionById(compareVersions[0])!}
                    versionB={getVersionById(compareVersions[1])!}
                    onClose={() => setCompareVersions([])}
                />
            )}

            {viewVersion && (
                <ViewModal
                    workflowName="View Version"
                    version={getVersionById(viewVersion)!}
                    onClose={() => setViewVersion(null)}
                />
            )}
        </div>
    );
};

export default WorkflowVersionPage;