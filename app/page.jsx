import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function HomePage() {
    return (
        <div>
         <div>
         <Navbar />
         </div>
         <div className='text-center text-3xl font-bold mt-10 p-20'> 
          Hello
         </div>
         <div>
         <Footer />
         </div>
        </div>
    )
}