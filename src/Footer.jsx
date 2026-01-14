import { Link } from 'react-router-dom'


export default function Footer(){
    return (
        <footer className="bg-white border-t mt-8">
            <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                <div>
                    <strong>Surplus Depot</strong>
                    <div className="text-sm text-gray-600">Quality military surplus since 2026</div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    <Link to="/about">AboutUS</Link>
                    <a href="#" onClick={(e)=>e.preventDefault()}>Support</a>
                    <a href="#" onClick={(e)=>e.preventDefault()}>Terms</a>
                </div>
            </div>
        </footer>
    )
}