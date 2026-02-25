import CRAMonitoringVisitPrep from './templates/CRAMonitoringVisitPrep';
import AmendmentImpactAssessment from './templates/AmendmentImpactAssessment';
import { ArrowLeft, HardDrive } from 'lucide-react';
import { Button } from './ui/button';

export default function TemplateWorkspaceRenderer({ template, onBack }: { template: any, onBack: () => void }) {
    if (template.id === 'template-2') return <CRAMonitoringVisitPrep template={template} onBack={onBack} />;
    if (template.id === 'template-4') return <AmendmentImpactAssessment template={template} onBack={onBack} />;

    return (
        <div className="absolute inset-0 bg-white z-50 overflow-auto flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <HardDrive size={64} className="opacity-20 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Template Workspace</h2>
            <p className="max-w-md">The template "{template.name}" has been installed but does not have an interactive workspace in this demo build.</p>
            <Button variant="outline" onClick={onBack} className="mt-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
            </Button>
        </div>
    );
}
