import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Note = {
    id: string;
    note: string;
    public: boolean;
    created_at: string;
    updated_at: string;
};

type OrderNotesProps = {
    notes: Note[];
    onAddNote?: (newNote: { note: string; public: boolean }) => void;
};

export function OrderNotes({ notes, onAddNote }: OrderNotesProps) {
    const [noteContent, setNoteContent] = useState('');
    const [noteType, setNoteType] = useState<'private' | 'public'>('private');

    const handleAddNote = () => {
        if (!noteContent.trim()) return;
        if (onAddNote) {
            onAddNote({ note: noteContent, public: noteType === 'public' });
        }
        setNoteContent('');
    };

    const publicNotes = notes.filter((n) => n.public).slice().reverse();
    const privateNotes = notes.filter((n) => !n.public).slice().reverse();

    return (
        <div className="space-y-4 text-white">
            {/* Title and Textarea */}
            <div>
                <h2 className="text-lg font-bold mb-2">Note</h2>
                <textarea
                    id="noteContent"
                    className="w-full h-20 rounded-md bg-primary-black-85 p-2 text-sm text-white placeholder:text-primary-black-60 focus:outline-none"
                    placeholder="Add your note here..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2">
                <div className="w-[70%]">
                    <Select
                        onValueChange={(value) =>
                            setNoteType(value as 'private' | 'public')
                        }
                        defaultValue={noteType}
                    >
                        <SelectTrigger className="w-full border border-primary-black-65 rounded-md">
                            <SelectValue placeholder="Select Visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-[30%]">
                    <Button
                        onClick={handleAddNote}
                        className="flex items-center justify-center h-10 w-full px-4 py-2 gap-2 bg-[#242424] rounded-[49px] text-white"
                    >
                        + Add Note
                    </Button>

                </div>
            </div>

            <hr className="border-primary-black-65 w-full mx-auto my-[32px]" />


            {/* Private Notes Section */}
            <div>
                <h3 className="font-sora font-normal text-[14px] leading-[25px] text-[#C2C2C2] mb-2">Private Notes</h3>
                {privateNotes.length > 0 ? (
                    <div className="flex flex-col items-start p-0 gap-2">
                        {privateNotes.map((note) => (
                            <div
                                key={note.id}
                                className="flex flex-row items-start p-6 gap-[10px] bg-[#080808] rounded-[8px] w-full"
                            >
                                <span className="text-sm text-white">
                                    {note.note}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-white ml-4">No private notes yet.</p>
                )}
            </div>

            {/* Public Notes Section */}
            <div>
                <h3 className="font-sora font-normal text-[14px] leading-[25px] text-[#C2C2C2] mb-2">Public Notes</h3>
                {publicNotes.length > 0 ? (
                    <div className="flex flex-col items-start p-0 gap-2">
                        {publicNotes.map((note) => (
                            <div
                                key={note.id}
                                className="flex flex-row items-start p-6 gap-[10px] bg-[#080808] rounded-[8px] w-full"
                            >
                                <span className="text-sm text-white">
                                    {note.note}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-white ml-4">No public notes yet.</p>
                )}
            </div>
        </div>
    );
}
