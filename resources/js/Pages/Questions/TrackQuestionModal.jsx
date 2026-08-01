import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function TrackQuestionModal({ open, onClose }) {
    const { flash } = usePage().props;
    const [trackToken, setTrackToken] = useState('');
    const [trackError, setTrackError] = useState('');
    const [tracking, setTracking] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setTracking(true);
        setTrackError('');
        router.post(route('questions.track'), { token: trackToken }, {
            preserveState: true,
            onError: (errors) => {
                setTrackError(errors.token || 'No question found with that tracking token.');
                setTracking(false);
            },
            onFinish: () => setTracking(false),
        });
    };

    const flashError = flash?.error || '';

    return (
        <Modal
            show={open}
            onClose={onClose}
            maxWidth="md"
            title="Track Question"
            subtitle="Look up an anonymous post by its tracking token."
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <InputLabel htmlFor="track-token" value="Tracking Token" />
                    <TextInput
                        id="track-token"
                        value={trackToken}
                        onChange={(e) => setTrackToken(e.target.value.toUpperCase())}
                        className="font-mono tracking-wider"
                        placeholder="e.g. QA-ABCDEF"
                        required
                    />
                    <InputError message={trackError || flashError} className="mt-1" />
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit" disabled={tracking || !trackToken}>
                        {tracking ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                Searching...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-magnifying-glass mr-2"></i>
                                Lookup
                            </>
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
