import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AddMemberPromptProps {
    onSkip: () => void;
    onAddMember: () => void;
}

const AddMemberPrompt: React.FC<AddMemberPromptProps> = ({
    onSkip,
    onAddMember,
}) => {
    return (
        <div className="flex flex-col justify-center items-start h-full px-8 py-5 pt-[160px]">
            <Card className="bg-black border-none w-full">
                <CardHeader className='mb-8'>
                    <CardTitle className="font-inter font-semibold text-[32px] leading-none tracking-normal">
                        Manage store team
                    </CardTitle>
                    <p className="text-gray-400 text-sm ">
                        Add and manage admins or sellers for your store. Control who can access and run your shop on Hamza.
                    </p>
                </CardHeader>

                <CardContent>
                    <div className="w-full grid grid-cols-2 gap-4">
                        <Button
                            onClick={onAddMember}
                            className="bg-[#242424] text-white font-semibold px-6 py-3 rounded-full w-full h-14"
                        >
                            Add Member
                        </Button>
                        <Button
                            onClick={onSkip}
                            className="bg-[#94D42A] text-black font-semibold px-6 py-3 rounded-full w-full h-14"
                        >
                            Skip for now
                        </Button>
                    </div>
                </CardContent>

            </Card>
        </div>
    );
};

export default AddMemberPrompt;
