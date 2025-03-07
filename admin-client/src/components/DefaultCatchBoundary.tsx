import {
    ErrorComponent,
    ErrorComponentProps,
    // rootRouteId,
    // useMatch,
    useRouter,
} from '@tanstack/react-router'
import ErrorIcon from '../../public/images/error/error-icon.svg';

// type DefaultCatchBoundaryType = {
//   status: number
//   statusText: string
//   data: string
//   isRoot?: boolean
// }

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
    const router = useRouter()
    // const isRoot = useMatch({
    //     strict: false,
    //     select: (state) => state.id === rootRouteId,
    // })

    console.error(error)

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{background: 'linear-gradient(to bottom, #020202 5vh, #2C272D 40vh)'}}
        >
            <div className="flex flex-col md:flex-row max-w-6xl w-full items-center justify-center text-white">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-6xl font-bold text-green-900">Oops!</h1>
                        <h2 className="text-2xl font-semibold text-green-900">Something Went Wrong.</h2>
                        <p>It looks like we hit a bump in the road. But don't worry, we're on it!</p>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-semibold">What can you do?</h3>
                        <ul className="list-disc pl-5">
                            <li>Try refreshing the page.</li>
                            <li>Check your connection.</li>
                            <li>Return to the homepage or navigate elsewhere.</li>
                            <li>If the problem persists, please contact support.</li>
                        </ul>
                    </div>
                    <div className="flex max-w-xs w-full gap-2">
                        <button
                            onClick={() => {
                                router.invalidate()
                            }}
                            className="h-13 w-[190px] border-2 border-green-900 text-green-900 rounded-full bg-transparent"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => {
                                router.navigate({ to: '/'})
                            }}
                            className="h-13 w-[190px] ml-auto rounded-full bg-green-900 text-black"
                        >
                            Go to Homepage
                        </button>
                    </div>
                    <ErrorComponent error={error}/>
                </div>
                <div className="mt-8 md:mt-0 md:ml-8">
                    <img src={ErrorIcon} alt="Error Icon"/>
                </div>
            </div>
        </div>
    )
}