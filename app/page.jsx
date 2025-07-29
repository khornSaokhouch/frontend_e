import Footer from './components/Footer';
import Navbar from './components/Navbar';
import BrandCategorySection from './components/user/BrandCategorySection';
import ProductCategory from './components/user/ProductCategory';

export default function HomePage() {
    return (
        <div>
         <div>
         <Navbar />
         </div>
         <div> 
          <ProductCategory />
         </div>
         <div className='p-6'>
         <BrandCategorySection />
         </div>
         <div>
         <Footer />
         </div>
        </div>
    )
}