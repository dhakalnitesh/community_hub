import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';

export default function QuestionFormModal({ open, onClose, subjects = [], discussion = null }) {
    const isEdit = discussion !== null;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        discussionable_type: 'subject',
        discussionable_id: discussion?.discussionable_id ?? subjects?.[0]?.id ?? '',
        title: discussion?.title ?? '',
        body: discussion?.body ?? '',
        category: discussion?.category ?? '',
        is_anonymous: discussion?.is_anonymous ?? false,
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
            put(route('questions.update', discussion.id), options);
        } else {
            post(route('questions.store'), options);
        }
    };

    const selectClass =
        'w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <Modal
            show={open}
            onClose={onClose}
            maxWidth="2xl"
            title={isEdit ? 'Edit Question' : 'Ask a Question'}
            subtitle={isEdit ? 'Update the details of your question.' : 'Get help from the community.'}
        >
            <form onSubmit={submit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="q-subject" value="Subject / Course" />
                        <select
                            id="q-subject"
                            className={selectClass}
                            value={data.discussionable_id}
                            onChange={(e) => setData('discussionable_id', e.target.value)}
                            disabled={isEdit}
                            required
                        >
                            {subjects?.length === 0 && <option value="">No subjects found...</option>}
                            {subjects?.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name} {subject.semester ? `(${subject.semester.name})` : ''}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.discussionable_id} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="q-category" value="Category (Optional)" />
                        <select
                            id="q-category"
                            className={selectClass}
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                        >
                            <option value="">Select category...</option>
                            <option value="conceptual">Conceptual Problem</option>
                            <option value="assignment">Assignment / Lab</option>
                            <option value="exam">Exam Preparation</option>
                            <option value="career">Career / General</option>
                        </select>
                        <InputError message={errors.category} className="mt-1" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="q-title" value="Question Title" />
                    <TextInput
                        id="q-title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="e.g. How do polymorphic relations work in Laravel?"
                        required
                        maxLength={255}
                    />
                    <InputError message={errors.title} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="q-body" value="Details & Context" />
                    <textarea
                        id="q-body"
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        className="w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-y"
                        rows={5}
                        placeholder="Explain your doubt in detail. What have you tried? Where are you stuck?"
                        required
                    />
                    <InputError message={errors.body} className="mt-1" />
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-eye-slash text-indigo-400" />
                        <div>
                            <h4 className="text-sm font-semibold text-indigo-900">Post Anonymously</h4>
                            <p className="text-xs text-indigo-700 mt-0.5">Your identity will be hidden from other students.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setData('is_anonymous', !data.is_anonymous)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${data.is_anonymous ? 'bg-indigo-600' : 'bg-gray-300'}`}
                        role="switch"
                        aria-checked={data.is_anonymous}
                    >
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${data.is_anonymous ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
                    <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin mr-2" />
                                {isEdit ? 'Saving...' : 'Posting...'}
                            </>
                        ) : (
                            <>
                                <i className={`fa-solid ${isEdit ? 'fa-floppy-disk' : 'fa-paper-plane'} mr-2`} />
                                {isEdit ? 'Save Changes' : 'Post Question'}
                            </>
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
