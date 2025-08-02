import BrandsList from "../_components/brands";
import CategoriesPage from "../_components/categories";
import ProductsList from "../_components/products";

export default function Dashboard() {
  return (
    <div>
      <ProductsList />
      <CategoriesPage />
      <BrandsList />
    </div>
  );
}
