import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';

export default function TrackGrievanceModal({ open, onClose }) {
    const { data, setData, get, processing, errors } = useForm({ code: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        get(route('grievances.track'), {
            preserveState: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal
            show={open}
            onClose={onClose}
            maxWidth="md"
            title="Track Grievance"
            subtitle="Look up an issue by its tracking code."
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <InputLabel htmlFor="grievance-code" value="Tracking Code" />
                    <TextInput
                        id="grievance-code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="font-mono tracking-wider"
                        placeholder="e.g. GRV-X8H2B1"
                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                        required
                    />
                    <InputError message={errors.code} className="mt-1" />
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing || !data.code}>
                        {processing ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                Tracking...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-magnifying-glass mr-2"></i>
                                Track Issue
                            </>
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
