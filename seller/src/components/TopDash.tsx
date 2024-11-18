import { SidebarTrigger } from '@/components/ui/sidebar';
import { ChevronDown, BellRing } from 'lucide-react';

const TopDash = () => {
    return (
        <div className="flex items-center bg-invisable h-[56px]">
            <SidebarTrigger className="ml-2" />
            <div className="flex  ml-auto">
                <div className="flex justify-center items-center h-[56px] w-[56px] rounded-full bg-[#121212]">
                    <BellRing size={'24px'} />
                </div>

                <div className="h-[56px] border-l-[1px] border-white mx-4" />
                {/* Login */}
                <button className="flex justify-evenly items-center bg-[#121212] h-[56px] w-[200px]">
                    <div className="h-[40px] w-[40px] rounded-full bg-white"></div>
                    <div className="flex flex-col w-[89px] mx-2">
                        <p className="text-lg font-semibold leading-none mr-auto">
                            John Doe
                        </p>
                        <p className="text-sm mr-auto">Admin</p>
                    </div>
                    <ChevronDown />
                </button>
            </div>
        </div>
    );
};

export default TopDash;
