import { Button } from '../ui/button';

const PagingFooter = () => {
    return (
        <div className="flex  items-center justify-center py-4 space-x-4">
            <Button
                variant="outline"
                size="sm"
                // onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
                // disabled={!table.getCanPreviousPage()}
            >
                Previous
            </Button>
            <span className="flex items-center justify-center w-8 h-8">
                {/* {pageIndex + 1} */}
            </span>
            <Button
                variant="outline"
                size="sm"
                // onClick={() => setPageIndex((old) => old + 1)}
                // disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
        </div>
    );
};

export default PagingFooter;
