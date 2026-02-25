import ProtocolReader from './skills/ProtocolReader';
import AuditTrailGenerator from './skills/AuditTrailGenerator';
import { ArrowLeft, HardDrive } from 'lucide-react';
import { Button } from './ui/button';

export default function SkillWorkspaceRenderer({ skill, onBack }: { skill: any, onBack: () => void }) {
    if (skill.id === 'skill-1') return <ProtocolReader skill={skill} onBack={onBack} />;
    if (skill.id === 'skill-5') return <AuditTrailGenerator skill={skill} onBack={onBack} />;

    return (
        <div className="absolute inset-0 bg-white z-50 overflow-auto flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <HardDrive size={64} className="opacity-20 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Skill Active</h2>
            <p className="max-w-md">The skill "{skill.name}" is active but does not have an interactive workspace in this demo build.</p>
            <Button variant="outline" onClick={onBack} className="mt-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
            </Button>
        </div>
    );
}
