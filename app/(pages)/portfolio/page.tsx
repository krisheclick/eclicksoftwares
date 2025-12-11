import Banner from "@/components/portfoilo/Banner";
import GridList from "@/components/portfoilo/Grid";

const bannerData = {
  title: "Portfolio"
}

const Page = () => {
  return (
    <>
      <Banner data={bannerData} />
      <GridList />
    </>
  )
}

export default Page
