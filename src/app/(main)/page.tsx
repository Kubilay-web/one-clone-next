import { useCartStore } from "@/cart-store/useCartStore";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Header from "@/components/store/layout/header/header";
import ProductList from "@/components/store/shared/product-list";
import useFromStore from "@/hooks/useFromStore";
import { getProducts } from "@/queries/product";

export default async function Home() {
  const productsData = await getProducts({}, "");
  const { products } = productsData;
  console.log("products", products);
  // const cart = useFromStore(useCartStore, (state) => state.cart);
  // const addToCart = useCartStore((state) => state.addToCart);
  // console.log("cart--->", cart);
  return (
    <div>
      <Header />
      <CategoriesHeader />
      <div className="p-14">
        <ProductList products={products} title="Products" arrow />
      </div>
    </div>
  );
}
