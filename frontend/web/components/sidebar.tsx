import { Separator } from "@/components/ui/separator"
import { Squares2X2Icon, SquaresPlusIcon } from '@heroicons/react/24/outline'


const SideBar = () => {
    return (
        <div className="fixed top-0 left-0 h-screen w-64 flex flex-col m-0 bg-white-400 text-black shadow-lg">
            <h3>Title</h3>
            <Separator />
            <SiderBarItem icon={<Squares2X2Icon className="w-6 h-6" />} text="View Collections" />
            <SiderBarItem icon={<SquaresPlusIcon className="w-6 h-6" />} text="Add Collection" />
            <h1> Title2</h1>
        </div >
    )
}


const SiderBarItem = ({ icon, text }) => {
    return (
        <div className="flex m-3 items-cente hover:bg-gray-500 rounded-md bg-gray-200">
            {icon}
            <h1>{text}</h1>
        </div>
    )
}

export default SideBar