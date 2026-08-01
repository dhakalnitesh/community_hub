import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';

export default function AnnouncementFormModal({ open, onClose, subjects = [], announcement = null }) {
    const isEdit = announcement !== null;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        subject_id: announcement?.subject_id ?? subjects?.[0]?.id ?? '',
        title: announcement?.title ?? '',
        content: announcement?.content ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                onClose();
                reset();
            },
        };
        if (isEdit) {
            put(route('announcements.update', announcement.id), options);
        } else {
            post(route('announcements.store'), options);
        }
    };

    const selectClass =
        'w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <Modal
            show={open}
            onClose={onClose}
            maxWidth="lg"
            title={isEdit ? 'Edit Announcement' : 'Post Announcement'}
            subtitle={isEdit ? 'Update the details of this announcement.' : 'Share an update with your class.'}
        >
            <form onSubmit={submit} className="p-6 space-y-5">
                {isEdit ? (
                    <div>
                        <InputLabel value="Subject" />
                        <TextInput value={announcement.subject?.name || '—'} className="bg-gray-100" disabled />
                    </div>
                ) : (
                    <div>
                        <InputLabel htmlFor="ann-subject" value="Subject" />
                        <select
                            id="ann-subject"
                            className={selectClass}
                            value={data.subject_id}
                            onChange={(e) => setData('subject_id', e.target.value)}
                            required
                        >
                            <option value="">Select subject...</option>
                            {subjects?.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name} {subject.semester ? `(${subject.semester.name})` : ''}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.subject_id} className="mt-1" />
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="ann-title" value="Title" />
                    <TextInput
                        id="ann-title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="e.g. Mid-term exam schedule released"
                        required
                        maxLength={255}
                    />
                    <InputError message={errors.title} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="ann-content" value="Content" />
                    <textarea
                        id="ann-content"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className="w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-y"
                        rows={5}
                        placeholder="Write the announcement details..."
                        required
                    />
                    <InputError message={errors.content} className="mt-1" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
                    <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className={`fa-solid ${isEdit ? 'fa-floppy-disk' : 'fa-bullhorn'} mr-2`}></i>
                                {isEdit ? 'Save Changes' : 'Post Announcement'}
                            </>
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
