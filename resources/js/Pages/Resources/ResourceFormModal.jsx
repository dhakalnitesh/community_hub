import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';

export default function ResourceFormModal({ open, onClose, subjects = [], resource = null }) {
    const isEdit = resource !== null;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        subject_id: resource?.subject_id ?? subjects?.[0]?.id ?? '',
        title: resource?.title ?? '',
        description: resource?.description ?? '',
        type: resource?.type ?? 'DOCUMENT',
        attachment: null,
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
            put(route('resources.update', resource.id), options);
        } else {
            post(route('resources.store'), options);
        }
    };

    const selectClass =
        'w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

    const typeClass = (value) => {
        const map = {
            DOCUMENT: 'fa-file-lines',
            PDF: 'fa-file-pdf',
            VIDEO: 'fa-circle-play',
            PRESENTATION: 'fa-file-powerpoint',
            LINK: 'fa-link',
            OTHER: 'fa-file',
        };
        return map[value] || 'fa-file';
    };

    return (
        <Modal
            show={open}
            onClose={onClose}
            maxWidth="2xl"
            title={isEdit ? 'Edit Resource' : 'Create Resource'}
            subtitle={isEdit ? 'Update the details of this study material.' : 'Upload study material for your subject.'}
        >
            <form onSubmit={submit} className="p-6 space-y-5">
                {isEdit ? (
                    <div>
                        <InputLabel value="Subject" />
                        <TextInput value={resource.subject?.name || '—'} className="bg-gray-100" disabled />
                    </div>
                ) : (
                    <div>
                        <InputLabel htmlFor="res-subject" value="Subject" />
                        <select
                            id="res-subject"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="res-title" value="Title" />
                        <TextInput
                            id="res-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Chapter 5 - Sorting Algorithms"
                            required
                            maxLength={255}
                        />
                        <InputError message={errors.title} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="res-type" value="Type" />
                        <select
                            id="res-type"
                            className={selectClass}
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            required
                        >
                            <option value="DOCUMENT">Document</option>
                            <option value="PDF">PDF</option>
                            <option value="VIDEO">Video</option>
                            <option value="PRESENTATION">Presentation</option>
                            <option value="LINK">Link</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <InputError message={errors.type} className="mt-1" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="res-description" value="Description (Optional)" />
                    <textarea
                        id="res-description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-y"
                        rows={3}
                        placeholder="What is this material about?"
                    />
                    <InputError message={errors.description} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="res-attachment" value={isEdit ? 'Replace Attachment (Optional)' : 'Attachment (File)'} />
                    <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
                        <i className={`fa-solid ${typeClass(data.type)} text-xl text-slate-400`}></i>
                        <label className="flex-1 cursor-pointer">
                            <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                {data.attachment ? data.attachment.name : isEdit && resource.file_url ? 'Choose a new file' : 'Choose a file'}
                            </span>
                            <input
                                type="file"
                                id="res-attachment"
                                className="sr-only"
                                onChange={(e) => setData('attachment', e.target.files[0])}
                            />
                            {isEdit && resource.file_url && !data.attachment && (
                                <span className="ml-2 text-xs text-gray-500 truncate">Current: {resource.file_url}</span>
                            )}
                        </label>
                    </div>
                    <InputError message={errors.attachment} className="mt-1" />
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
                                <i className={`fa-solid ${isEdit ? 'fa-floppy-disk' : 'fa-cloud-arrow-up'} mr-2`}></i>
                                {isEdit ? 'Save Changes' : 'Create Resource'}
                            </>
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
