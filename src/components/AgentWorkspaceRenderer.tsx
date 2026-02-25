// removed React
import ProtocolScorer from './agents/ProtocolScorer';
import ProtocolToOps from './agents/ProtocolToOps';
import ReconciliationBot from './agents/ReconciliationBot';
import RegulatoryFactory from './agents/RegulatoryFactory';
import TrialRehearsal from './agents/TrialRehearsal';
import VirtualSMO from './agents/VirtualSMO';
import { ArrowLeft, HardDrive } from 'lucide-react';
import { Button } from './ui/button';

export default function AgentWorkspaceRenderer({ agent, onBack }: { agent: any, onBack: () => void }) {
    if (agent.id === 'agent-1') return <ProtocolScorer agent={agent} onBack={onBack} />;
    if (agent.id === 'agent-2') return <ProtocolToOps agent={agent} onBack={onBack} />;
    if (agent.id === 'agent-3') return <ReconciliationBot agent={agent} onBack={onBack} />;
    if (agent.id === 'agent-4') return <RegulatoryFactory agent={agent} onBack={onBack} />;
    if (agent.id === 'agent-5') return <TrialRehearsal agent={agent} onBack={onBack} />;
    if (agent.id === 'agent-6') return <VirtualSMO agent={agent} onBack={onBack} />;

    // General fallback for unknown
    return (
        <div className="absolute inset-0 bg-white z-50 overflow-auto flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <HardDrive size={64} className="opacity-20 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Agent Not Deployed</h2>
            <p className="max-w-md">The agent `{agent.name}` does not have an active workspace implemented yet in this demo build.</p>
            <Button variant="outline" onClick={onBack} className="mt-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
            </Button>
        </div>
    );
}
