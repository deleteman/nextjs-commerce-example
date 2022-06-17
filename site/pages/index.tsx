import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Marquee, Hero } from '@components/ui'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { TrackerContext } from 'context/trackerProvider'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Product } from '@commerce/types/product'
import slugify from 'slugify'

type MakeUpProduct = {
  id: number
  name: string
  image_link: string
  price: string
}

async function getMakeUpProducts(): Promise<Product[]> {
  console.log('Getting the makeup products')
  let { data } = await axios.get(
    'https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline'
  )
  const products: MakeUpProduct[] = data

  let newProds: Product[] = products.map((p) => {
    return {
      id: '' + p.id,
      slug: slugify(p.name),
      name: p.name,
      description: '',
      images: [{ url: p.image_link }],
      variants: [],
      price: {
        value: +p.price,
      },
      options: [],
    }
  })

  return newProds
}

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { first: 6 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
    revalidate: 60,
  }
}

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { initTracker, startTracking } = useContext(TrackerContext)
  const [makeUpProducts, setMakeUpProducts] = useState<Product[]>([])

  useEffect(() => {
    initTracker()

    async function getProds() {
      await startTracking()
      const prods: Product[] = await getMakeUpProducts()
      setMakeUpProducts(prods)
    }
  }, [])

  return (
    <>
      <Grid variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
              priority: true,
            }}
          />
        ))}
      </Grid>
      <Marquee variant="secondary">
        {makeUpProducts.slice(0, 3).map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>
      <Hero
        headline=" Dessert dragée halvah croissant."
        description="Cupcake ipsum dolor sit amet lemon drops pastry cotton candy. Sweet carrot cake macaroon bonbon croissant fruitcake jujubes macaroon oat cake. Soufflé bonbon caramels jelly beans. Tiramisu sweet roll cheesecake pie carrot cake. "
      />
      <Grid layout="B" variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
        ))}
      </Grid>
      <Marquee>
        {products.slice(3).map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>
      {/* <HomeAllProductsGrid
        newestProducts={products}
        categories={categories}
        brands={brands}
      /> */}
    </>
  )
}

Home.Layout = Layout
