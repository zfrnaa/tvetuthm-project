export const LoadingGeneral = () => {
    return (
        <div className="animate-pulse w-full">
            <div className="size-260 mx-auto mt-20">
                <div className="h-2 rounded bg-gray-200 mb-4"></div>
                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 h-60 rounded bg-gray-400"></div>
                        <div className="col-span-1 h-60 rounded bg-gray-400"></div>
                    </div>
                    <div className="h-14 rounded bg-gray-400"></div>
                </div>
            </div>
        </div>
   )
};